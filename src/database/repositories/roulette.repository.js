/**
 * BIBLE — RouletteRepository
 * Persistencia para listas de ruleta y sus elementos configurados.
 */
class RouletteRepository {
  constructor(db) {
    this.db = db;
  }

  static getPalette() {
    return [
      '#EF4444', '#F97316', '#F59E0B', '#10B981', 
      '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
      '#14B8A6', '#6366F1'
    ];
  }

  /**
   * Obtiene todas las listas registradas con su conteo de elementos
   */
  getAllLists() {
    return this.db.prepare(`
      SELECT l.id, l.name, l.created_at, l.updated_at, COUNT(i.id) as item_count
      FROM roulette_lists l
      LEFT JOIN roulette_items i ON i.list_id = l.id
      GROUP BY l.id
      ORDER BY l.updated_at DESC
    `).all();
  }

  /**
   * Obtiene una lista con todos sus elementos
   */
  getListById(id) {
    const list = this.db.prepare('SELECT * FROM roulette_lists WHERE id = ?').get(id);
    if (!list) return null;

    const items = this.db.prepare(`
      SELECT id, label, color, position 
      FROM roulette_items 
      WHERE list_id = ? 
      ORDER BY position ASC, id ASC
    `).all(id);

    return {
      ...list,
      items
    };
  }

  /**
   * Crea una lista nueva con elementos opcionales en una transacción
   */
  createList(name, items = []) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre de la lista de ruleta es obligatorio');

    const palette = RouletteRepository.getPalette();
    const insertList = this.db.prepare('INSERT INTO roulette_lists (name) VALUES (?)');
    const insertItem = this.db.prepare(`
      INSERT INTO roulette_items (list_id, label, color, position) 
      VALUES (?, ?, ?, ?)
    `);

    const transaction = this.db.transaction(() => {
      const info = insertList.run(cleanName);
      const listId = info.lastInsertRowid;

      items.forEach((item, idx) => {
        const label = typeof item === 'string' ? item : item.label;
        const color = (typeof item === 'object' && item.color) || palette[idx % palette.length];
        insertItem.run(listId, label, color, idx + 1);
      });

      return listId;
    });

    const newId = transaction();
    return this.getListById(newId);
  }

  /**
   * Agrega un elemento a una lista existente
   */
  addItem(listId, label, color = null) {
    const cleanLabel = (label || '').trim();
    if (!cleanLabel) throw new Error('La etiqueta del elemento es obligatoria');

    const palette = RouletteRepository.getPalette();
    const count = this.db.prepare('SELECT COUNT(*) as count FROM roulette_items WHERE list_id = ?').get(listId).count;
    const finalColor = color || palette[count % palette.length];

    this.db.prepare(`
      INSERT INTO roulette_items (list_id, label, color, position)
      VALUES (?, ?, ?, ?)
    `).run(listId, cleanLabel, finalColor, count + 1);

    this.db.prepare('UPDATE roulette_lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(listId);
    return this.getListById(listId);
  }

  /**
   * Agrega múltiples elementos en lote (por ejemplo pegados por el usuario)
   */
  addItemsBatch(listId, labels = []) {
    if (!Array.isArray(labels) || labels.length === 0) return this.getListById(listId);

    const palette = RouletteRepository.getPalette();
    const insertItem = this.db.prepare(`
      INSERT INTO roulette_items (list_id, label, color, position)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = this.db.transaction(() => {
      let currentCount = this.db.prepare('SELECT COUNT(*) as count FROM roulette_items WHERE list_id = ?').get(listId).count;

      labels.forEach(rawLabel => {
        const clean = (rawLabel || '').trim();
        if (!clean) return;
        currentCount++;
        const color = palette[(currentCount - 1) % palette.length];
        insertItem.run(listId, clean, color, currentCount);
      });

      this.db.prepare('UPDATE roulette_lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(listId);
    });

    transaction();
    return this.getListById(listId);
  }

  /**
   * Elimina todos los elementos de una lista para vaciarla
   */
  clearItems(listId) {
    this.db.prepare('DELETE FROM roulette_items WHERE list_id = ?').run(listId);
    this.db.prepare('UPDATE roulette_lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(listId);
    return this.getListById(listId);
  }

  /**
   * Renombra una lista existente
   */
  renameList(id, name) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre de la lista es obligatorio');
    this.db.prepare('UPDATE roulette_lists SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(cleanName, id);
    return this.getListById(id);
  }

  /**
   * Elimina un elemento de la ruleta
   */
  removeItem(itemId) {
    this.db.prepare('DELETE FROM roulette_items WHERE id = ?').run(itemId);
    return true;
  }

  /**
   * Elimina una lista completa y sus elementos
   */
  deleteList(id) {
    this.db.prepare('DELETE FROM roulette_lists WHERE id = ?').run(id);
    return true;
  }
}

module.exports = RouletteRepository;

