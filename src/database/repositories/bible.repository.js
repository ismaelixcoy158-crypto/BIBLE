const BibleReferenceParser = require('../../main/services/bible-reference-parser.js');

/**
 * BIBLE — BibleRepository
 * Gestión de consultas sobre los 66 libros y versículos bíblicos (RV1909, RVG) en SQLite.
 */
class BibleRepository {
  constructor(db) {
    this.db = db;
    this.parser = new BibleReferenceParser();
  }

  /**
   * Obtiene la lista de versiones bíblicas instaladas
   */
  getAllVersions() {
    try {
      return this.db.prepare(`
        SELECT code, name, short_name, is_default 
        FROM bible_versions 
        ORDER BY is_default DESC, name ASC
      `).all();
    } catch {
      return [
        { code: 'RV1909', name: 'Reina-Valera 1909 (Clásica)', short_name: 'RV1909', is_default: 1 },
        { code: 'RVG', name: 'Reina Valera Gómez (Moderna)', short_name: 'RVG', is_default: 0 }
      ];
    }
  }

  /**
   * Obtiene la lista completa de los 66 libros ordenados canónicamente
   */
  getAllBooks() {
    return this.db.prepare(`
      SELECT id, testament, name, standard_abbrev, chapters_count 
      FROM bible_books 
      ORDER BY id ASC
    `).all();
  }

  /**
   * Obtiene la información de un libro por su ID (1-66)
   */
  getBookById(id) {
    return this.db.prepare('SELECT * FROM bible_books WHERE id = ?').get(id);
  }

  /**
   * Obtiene todos los versículos de un capítulo específico para la versión dada
   */
  getVersesByChapter(bookId, chapter, version = 'RV1909') {
    return this.db.prepare(`
      SELECT id, version_code, book_id, chapter, verse, text 
      FROM bible_verses 
      WHERE book_id = ? AND chapter = ? AND version_code = ?
      ORDER BY verse ASC
    `).all(bookId, chapter, version);
  }

  /**
   * Obtiene un versículo individual para la versión dada
   */
  getVerse(bookId, chapter, verse, version = 'RV1909') {
    return this.db.prepare(`
      SELECT id, version_code, book_id, chapter, verse, text 
      FROM bible_verses 
      WHERE book_id = ? AND chapter = ? AND verse = ? AND version_code = ?
    `).get(bookId, chapter, verse, version);
  }

  /**
   * Obtiene un rango de versículos para la versión dada
   */
  getVerseRange(bookId, chapter, startVerse, endVerse, version = 'RV1909') {
    return this.db.prepare(`
      SELECT id, version_code, book_id, chapter, verse, text 
      FROM bible_verses 
      WHERE book_id = ? AND chapter = ? AND verse BETWEEN ? AND ? AND version_code = ?
      ORDER BY verse ASC
    `).all(bookId, chapter, startVerse, endVerse, version);
  }

  /**
   * Busca por referencia de texto libre utilizando el parser inteligente
   * @param {string} rawReference Ej: "Juan 3:16", "jn 3.16-18", "sal23"
   * @param {string} version Código de versión bíblica (ej. 'RV1909', 'RVG')
   */
  searchReference(rawReference, version = 'RV1909') {
    const parseResult = this.parser.parse(rawReference, version);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error };
    }

    let verses = [];
    if (parseResult.endVerse) {
      verses = this.getVerseRange(
        parseResult.bookId,
        parseResult.chapter,
        parseResult.startVerse,
        parseResult.endVerse,
        version
      );
    } else {
      const single = this.getVerse(
        parseResult.bookId,
        parseResult.chapter,
        parseResult.startVerse,
        version
      );
      if (single) verses = [single];
    }

    return {
      success: true,
      parseInfo: parseResult,
      verses
    };
  }

  /**
   * Búsqueda por palabras clave en la versión seleccionada usando FTS5
   */
  searchByText(keyword, limit = 50, version = 'RV1909') {
    const cleanKeyword = (keyword || '').trim().replace(/[^\w\s]/g, '');
    if (!cleanKeyword) return [];

    const query = `
      SELECT v.id, v.version_code, v.book_id, b.name as book_name, v.chapter, v.verse, v.text 
      FROM bible_verses_fts fts
      JOIN bible_verses v ON v.id = fts.rowid
      JOIN bible_books b ON b.id = v.book_id
      WHERE bible_verses_fts MATCH ? AND v.version_code = ?
      ORDER BY v.book_id ASC, v.chapter ASC, v.verse ASC
      LIMIT ?
    `;

    try {
      return this.db.prepare(query).all(cleanKeyword, version, limit);
    } catch (err) {
      console.warn('[BibleRepository] Error en consulta FTS5:', err);
      // Fallback a LIKE estándar si el término tiene caracteres especiales de FTS
      return this.db.prepare(`
        SELECT v.id, v.version_code, v.book_id, b.name as book_name, v.chapter, v.verse, v.text 
        FROM bible_verses v
        JOIN bible_books b ON b.id = v.book_id
        WHERE v.text LIKE ? AND v.version_code = ?
        ORDER BY v.book_id ASC, v.chapter ASC, v.verse ASC
        LIMIT ?
      `).all(`%${cleanKeyword}%`, version, limit);
    }
  }
}

module.exports = BibleRepository;

