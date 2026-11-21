/**
 * BIBLE — PreachingRepository
 * Persistencia para presentaciones, diapositivas y conservación de posición de lectura.
 * Soporta modos de fidelidad gráfica: 'original' (mantener diseño original) y 'church_bg' (fondo dinámico del culto).
 */
class PreachingRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene todas las presentaciones registradas
   */
  getAll() {
    return this.db.prepare(`
      SELECT id, title, preacher, bible_passage, original_filename, file_type, slide_count, last_slide_index, render_mode, updated_at
      FROM preachings
      ORDER BY updated_at DESC
    `).all();
  }

  /**
   * Obtiene una presentación con todas sus diapositivas
   */
  getById(id) {
    const preaching = this.db.prepare('SELECT * FROM preachings WHERE id = ?').get(id);
    if (!preaching) return null;

    const slides = this.db.prepare(`
      SELECT slide_index, slide_image_path, slide_title, slide_text, notes 
      FROM preaching_slides 
      WHERE preaching_id = ? 
      ORDER BY slide_index ASC
    `).all(id);

    return {
      ...preaching,
      slides
    };
  }

  /**
   * Registra una nueva presentación con sus diapositivas dentro de una transacción
   */
  create({ title, preacher = null, bible_passage = null, original_filename, file_type, render_mode = 'original', slides = [] }) {
    const trimmedTitle = (title || '').trim();
    if (!trimmedTitle) throw new Error('El título de la predicación es obligatorio');

    const insertPreachingStmt = this.db.prepare(`
      INSERT INTO preachings (title, preacher, bible_passage, original_filename, file_type, slide_count, last_slide_index, render_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSlideStmt = this.db.prepare(`
      INSERT INTO preaching_slides (preaching_id, slide_index, slide_image_path, slide_title, slide_text, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const createTransaction = this.db.transaction(() => {
      const info = insertPreachingStmt.run(
        trimmedTitle,
        preacher ? preacher.trim() : null,
        bible_passage ? bible_passage.trim() : null,
        original_filename || 'presentacion',
        file_type || 'pdf',
        slides.length,
        0,
        render_mode || 'original'
      );

      const preachingId = info.lastInsertRowid;

      slides.forEach((slide, index) => {
        insertSlideStmt.run(
          preachingId,
          index,
          slide.imagePath || slide.slide_image_path || `slide_${index}.jpg`,
          slide.title || slide.slide_title || null,
          slide.text || slide.slide_text || null,
          slide.notes || null
        );
      });

      return preachingId;
    });

    const newId = createTransaction();
    return this.getById(newId);
  }

  /**
   * Actualiza el modo de proyección ('original' o 'church_bg')
   */
  updateRenderMode(id, renderMode) {
    const mode = renderMode === 'church_bg' ? 'church_bg' : 'original';
    this.db.prepare(`
      UPDATE preachings 
      SET render_mode = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(mode, id);
    return true;
  }

  /**
   * Actualiza y preserva el índice de la última diapositiva proyectada
   */
  updateLastSlideIndex(id, slideIndex) {
    this.db.prepare(`
      UPDATE preachings 
      SET last_slide_index = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(slideIndex, id);

    return true;
  }

  /**
   * Elimina una presentación y sus registros de diapositivas
   */
  delete(id) {
    this.db.prepare('DELETE FROM preachings WHERE id = ?').run(id);
    return true;
  }
}

module.exports = PreachingRepository;
