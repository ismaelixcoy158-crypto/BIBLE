/**
 * BIBLE — ChurchRepository
 * Acceso transaccional a la tabla church_identity en SQLite.
 */
class ChurchRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene la identidad actual configurada
   */
  get() {
    const row = this.db.prepare('SELECT * FROM church_identity WHERE id = 1').get();
    if (!row) {
      this.db.prepare(`
        INSERT INTO church_identity (id, name, logo_filename, logo_source_type)
        VALUES (1, 'Mi Iglesia', NULL, 'none')
      `).run();
      return this.db.prepare('SELECT * FROM church_identity WHERE id = 1').get();
    }
    return row;
  }

  /**
   * Actualiza el nombre de la iglesia
   * @param {string} name
   */
  updateName(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      throw new Error('El nombre de la iglesia no puede estar vacío');
    }
    if (trimmed.length > 120) {
      throw new Error('El nombre de la iglesia excede los 120 caracteres');
    }

    this.db.prepare(`
      UPDATE church_identity 
      SET name = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `).run(trimmed);

    return this.get();
  }

  /**
   * Actualiza el archivo del logotipo
   * @param {string} filename Nombre del archivo en userData/media/branding/
   * @param {'local'|'url'} sourceType Origen del archivo
   */
  updateLogo(filename, sourceType) {
    if (!['local', 'url'].includes(sourceType)) {
      throw new Error('Tipo de origen de logo inválido');
    }

    this.db.prepare(`
      UPDATE church_identity 
      SET logo_filename = ?, logo_source_type = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `).run(filename, sourceType);

    return this.get();
  }

  /**
   * Elimina el logotipo manteniendo el nombre
   */
  deleteLogo() {
    this.db.prepare(`
      UPDATE church_identity 
      SET logo_filename = NULL, logo_source_type = 'none', updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `).run();

    return this.get();
  }

  /**
   * Restablece la identidad completa a los valores por defecto
   */
  reset() {
    this.db.prepare(`
      UPDATE church_identity 
      SET name = 'Mi Iglesia', logo_filename = NULL, logo_source_type = 'none', updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `).run();

    return this.get();
  }
}

module.exports = ChurchRepository;
