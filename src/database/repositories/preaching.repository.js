/**
 * BIBLE — PreachingRepository
 * Persistencia para presentaciones, diapositivas y conservación de posición de lectura.
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
      SELECT id, title, original_filename, file_type, slide_count, last_slide_index, updated_at
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
      SELECT slide_index, slide_image_path, notes 
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
  create({ title, original_filename, file_type, slides = [] }) {
    const trimmedTitle = (title || '').trim();
    if (!trimmedTitle) throw new Error('El título de la predicación es obligatorio');

    const insertPreachingStmt = this.db.prepare(`
      INSERT INTO preachings (title, original_filename, file_type, slide_count, last_slide_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertSlideStmt = this.db.prepare(`
      INSERT INTO preaching_slides (preaching_id, slide_index, slide_image_path, notes)
      VALUES (?, ?, ?, ?)
    `);

    const createTransaction = this.db.transaction(() => {
      const info = insertPreachingStmt.run(
        trimmedTitle,
        original_filename || 'presentacion',
        file_type || 'pdf',
        slides.length,
        0
      );

      const preachingId = info.lastInsertRowid;

      slides.forEach((slide, index) => {
        insertSlideStmt.run(
          preachingId,
          index,
          slide.imagePath || `slide_${index}.jpg`,
          slide.notes || null
        );
      });

      return preachingId;
    });

    const newId = createTransaction();
    return this.getById(newId);
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
