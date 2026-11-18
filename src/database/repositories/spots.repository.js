/**
 * BIBLE — SpotsRepository
 * Persistencia y consultas para la biblioteca de anuncios multimedia y videos.
 */
class SpotsRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene todos los spots registrados con filtro opcional de tipo (image/video)
   */
  getAll(fileType = null) {
    let sql = 'SELECT * FROM spots';
    const params = [];

    if (fileType) {
      sql += ' WHERE file_type = ?';
      params.push(fileType);
    }

    sql += ' ORDER BY created_at DESC';
    return this.db.prepare(sql).all(...params);
  }

  /**
   * Obtiene un spot por ID
   */
  getById(id) {
    return this.db.prepare('SELECT * FROM spots WHERE id = ?').get(id);
  }

  /**
   * Registra un nuevo spot multimedia
   */
  create({ title, file_type, original_filename, stored_filename, mime_type, file_size = 0, duration_seconds = 0, loop_enabled = 1 }) {
    const trimmedTitle = (title || '').trim();
    if (!trimmedTitle) throw new Error('El título del spot es obligatorio');

    const info = this.db.prepare(`
      INSERT INTO spots (title, file_type, original_filename, stored_filename, mime_type, file_size, duration_seconds, loop_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      trimmedTitle,
      file_type,
      original_filename || 'spot_file',
      stored_filename,
      mime_type || null,
      file_size,
      duration_seconds,
      loop_enabled ? 1 : 0
    );

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Actualiza el título o configuración de bucle del spot
   */
  update(id, { title, loop_enabled }) {
    const current = this.getById(id);
    if (!current) throw new Error('Spot no encontrado');

    const newTitle = title !== undefined ? title.trim() : current.title;
    const newLoop = loop_enabled !== undefined ? (loop_enabled ? 1 : 0) : current.loop_enabled;

    this.db.prepare(`
      UPDATE spots 
      SET title = ?, loop_enabled = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(newTitle, newLoop, id);

    return this.getById(id);
  }

  /**
   * Elimina un spot de la base de datos
   */
  delete(id) {
    this.db.prepare('DELETE FROM spots WHERE id = ?').run(id);
    return true;
  }
}

module.exports = SpotsRepository;
