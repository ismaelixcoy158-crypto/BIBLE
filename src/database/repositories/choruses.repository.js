/**
 * BIBLE — ChorusesRepository
 * Repositorio de persistencia y búsqueda FTS5 para el módulo de Coritos.
 */
class ChorusesRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Divide automáticamente la letra en diapositivas legibles
   * @param {string} lyrics Letra completa
   * @returns {string[]} Arreglo de diapositivas
   */
  static splitIntoSlides(lyrics) {
    if (!lyrics || typeof lyrics !== 'string') return [];
    
    // Normalizar posibles saltos literales escapados
    const normalized = lyrics.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');

    // División por dobles saltos de línea (párrafos / estrofas)
    const paragraphs = normalized
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const slides = [];

    for (const paragraph of paragraphs) {
      const lines = paragraph.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      // Si el párrafo tiene más de 4 líneas, subdividirlo en bloques de 2-4 líneas
      if (lines.length > 4) {
        for (let i = 0; i < lines.length; i += 4) {
          slides.push(lines.slice(i, i + 4).join('\n'));
        }
      } else {
        slides.push(lines.join('\n'));
      }
    }

    return slides.length > 0 ? slides : [lyrics.trim()];
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getAllCategories() {
    return this.db.prepare('SELECT * FROM chorus_categories ORDER BY id ASC').all();
  }

  /**
   * Obtiene la biblioteca de coritos con filtro opcional de categoría
   */
  getAll(categoryId = null) {
    let sql = `
      SELECT c.id, c.title, c.lyrics, c.category_id, cat.name as category_name, 
             cat.color as category_color, c.background, c.updated_at
      FROM choruses c
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
    `;
    const params = [];

    if (categoryId) {
      sql += ' WHERE c.category_id = ?';
      params.push(categoryId);
    }

    sql += ' ORDER BY c.title COLLATE NOCASE ASC';
    return this.db.prepare(sql).all(...params);
  }

  /**
   * Obtiene un corito por ID junto con sus diapositivas calculadas
   */
  getById(id) {
    const chorus = this.db.prepare(`
      SELECT c.*, cat.name as category_name, cat.color as category_color
      FROM choruses c
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE c.id = ?
    `).get(id);

    if (!chorus) return null;

    let slides = [];
    if (chorus.custom_slides_json) {
      try {
        slides = JSON.parse(chorus.custom_slides_json);
      } catch {
        slides = ChorusesRepository.splitIntoSlides(chorus.lyrics);
      }
    } else {
      slides = ChorusesRepository.splitIntoSlides(chorus.lyrics);
    }

    return {
      ...chorus,
      slides
    };
  }

  /**
   * Búsqueda en Modo Espontáneo en tiempo real (FTS5 + Coincidencias de prefijo)
   */
  searchSpontaneous(queryText, limit = 30) {
    const clean = (queryText || '').trim();
    if (!clean) return this.getAll().slice(0, limit);

    // Consulta FTS5 con comodín en cada término
    const ftsQuery = clean
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(w => `${w}*`)
      .join(' ');

    const sqlFTS = `
      SELECT c.id, c.title, c.lyrics, c.category_id, cat.name as category_name, 
             cat.color as category_color, c.background,
             snippet(choruses_fts, 1, '<b>', '</b>', '...', 10) as match_snippet
      FROM choruses_fts
      JOIN choruses c ON c.id = choruses_fts.rowid
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE choruses_fts MATCH ?
      ORDER BY bm25(choruses_fts) ASC
      LIMIT ?
    `;

    try {
      const results = this.db.prepare(sqlFTS).all(ftsQuery, limit);
      if (results.length > 0) return results;
    } catch {
      // Fallback a LIKE
    }

    // Fallback estándar con LIKE
    return this.db.prepare(`
      SELECT c.id, c.title, c.lyrics, c.category_id, cat.name as category_name, 
             cat.color as category_color, c.background
      FROM choruses c
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE c.title LIKE ? OR c.lyrics LIKE ?
      ORDER BY c.title ASC
      LIMIT ?
    `).all(`%${clean}%`, `%${clean}%`, limit);
  }

  /**
   * Crea un nuevo corito
   */
  create({ title, lyrics, category_id = 1, background = null, custom_slides = null }) {
    const trimmedTitle = (title || '').trim();
    const trimmedLyrics = (lyrics || '').trim();

    if (!trimmedTitle) throw new Error('El título del corito es obligatorio');
    if (!trimmedLyrics) throw new Error('La letra del corito es obligatoria');

    const slidesJson = custom_slides ? JSON.stringify(custom_slides) : null;

    const info = this.db.prepare(`
      INSERT INTO choruses (title, lyrics, category_id, background, custom_slides_json)
      VALUES (?, ?, ?, ?, ?)
    `).run(trimmedTitle, trimmedLyrics, category_id, background, slidesJson);

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Actualiza un corito existente
   */
  update(id, { title, lyrics, category_id, background, custom_slides }) {
    const current = this.getById(id);
    if (!current) throw new Error('Corito no encontrado');

    const newTitle = title !== undefined ? title.trim() : current.title;
    const newLyrics = lyrics !== undefined ? lyrics.trim() : current.lyrics;
    const newCategory = category_id !== undefined ? category_id : current.category_id;
    const newBackground = background !== undefined ? background : current.background;
    const newSlidesJson = custom_slides !== undefined ? JSON.stringify(custom_slides) : current.custom_slides_json;

    this.db.prepare(`
      UPDATE choruses 
      SET title = ?, lyrics = ?, category_id = ?, background = ?, custom_slides_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newTitle, newLyrics, newCategory, newBackground, newSlidesJson, id);

    return this.getById(id);
  }

  /**
   * Elimina un corito
   */
  delete(id) {
    this.db.prepare('DELETE FROM choruses WHERE id = ?').run(id);
    return true;
  }

  // --- REPERTORIO / LISTAS DE CULTO ---

  getPlaylists() {
    return this.db.prepare('SELECT * FROM chorus_playlists ORDER BY created_at DESC').all();
  }

  createPlaylist(name) {
    const clean = (name || '').trim();
    if (!clean) throw new Error('El nombre de la lista es obligatorio');
    const info = this.db.prepare('INSERT INTO chorus_playlists (name) VALUES (?)').run(clean);
    return { id: info.lastInsertRowid, name: clean };
  }

  getPlaylistItems(playlistId) {
    return this.db.prepare(`
      SELECT pi.position, c.id, c.title, c.lyrics, cat.name as category_name
      FROM chorus_playlist_items pi
      JOIN choruses c ON c.id = pi.chorus_id
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE pi.playlist_id = ?
      ORDER BY pi.position ASC
    `).all(playlistId);
  }

  addChorusToPlaylist(playlistId, chorusId) {
    const maxPos = this.db.prepare(
      'SELECT COALESCE(MAX(position), 0) as max_pos FROM chorus_playlist_items WHERE playlist_id = ?'
    ).get(playlistId).max_pos;

    this.db.prepare(`
      INSERT INTO chorus_playlist_items (playlist_id, chorus_id, position)
      VALUES (?, ?, ?)
    `).run(playlistId, chorusId, maxPos + 1);

    return this.getPlaylistItems(playlistId);
  }

  deletePlaylist(playlistId) {
    this.db.prepare('DELETE FROM chorus_playlists WHERE id = ?').run(playlistId);
    return true;
  }
}

module.exports = ChorusesRepository;
