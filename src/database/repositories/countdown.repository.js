/**
 * BIBLE — CountdownRepository
 * Persistencia de preajustes y mensajes de bienvenida de la cuenta regresiva.
 */
class CountdownRepository {
  constructor(db) {
    this.db = db;
  }

  getAllPresets() {
    return this.db.prepare('SELECT * FROM countdown_presets ORDER BY duration_seconds ASC').all();
  }

  getPresetById(id) {
    return this.db.prepare('SELECT * FROM countdown_presets WHERE id = ?').get(id);
  }

  createPreset({ name, duration_seconds, end_message = '¡Bienvenidos!', background = null }) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre del preajuste es obligatorio');
    const seconds = parseInt(duration_seconds, 10);
    if (isNaN(seconds) || seconds <= 0) throw new Error('La duración debe ser mayor a cero');

    const info = this.db.prepare(`
      INSERT INTO countdown_presets (name, duration_seconds, end_message, background)
      VALUES (?, ?, ?, ?)
    `).run(cleanName, seconds, end_message, background);

    return this.getPresetById(info.lastInsertRowid);
  }

  deletePreset(id) {
    this.db.prepare('DELETE FROM countdown_presets WHERE id = ?').run(id);
    return true;
  }
}

module.exports = CountdownRepository;
