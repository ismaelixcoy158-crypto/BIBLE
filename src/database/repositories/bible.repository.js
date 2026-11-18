const BibleReferenceParser = require('../../main/services/bible-reference-parser.js');

/**
 * BIBLE — BibleRepository
 * Gestión de consultas sobre los 66 libros y versículos de la RV1909 en SQLite.
 */
class BibleRepository {
  constructor(db) {
    this.db = db;
    this.parser = new BibleReferenceParser();
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
   * Obtiene todos los versículos de un capítulo específico
   */
  getVersesByChapter(bookId, chapter) {
    return this.db.prepare(`
      SELECT id, book_id, chapter, verse, text 
      FROM bible_verses 
      WHERE book_id = ? AND chapter = ? 
      ORDER BY verse ASC
    `).all(bookId, chapter);
  }

  /**
   * Obtiene un versículo individual
   */
  getVerse(bookId, chapter, verse) {
    return this.db.prepare(`
      SELECT id, book_id, chapter, verse, text 
      FROM bible_verses 
      WHERE book_id = ? AND chapter = ? AND verse = ?
    `).get(bookId, chapter, verse);
  }

  /**
   * Obtiene un rango de versículos (ej. Juan 3:16-18)
   */
  getVerseRange(bookId, chapter, startVerse, endVerse) {
    return this.db.prepare(`
      SELECT id, book_id, chapter, verse, text 
      FROM bible_verses 
      WHERE book_id = ? AND chapter = ? AND verse BETWEEN ? AND ? 
      ORDER BY verse ASC
    `).all(bookId, chapter, startVerse, endVerse);
  }

  /**
   * Busca por referencia de texto libre utilizando el parser inteligente
   * @param {string} rawReference Ej: "Juan 3:16", "jn 3.16-18", "sal23"
   */
  searchReference(rawReference) {
    const parseResult = this.parser.parse(rawReference);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error };
    }

    let verses = [];
    if (parseResult.endVerse) {
      verses = this.getVerseRange(
        parseResult.bookId,
        parseResult.chapter,
        parseResult.startVerse,
        parseResult.endVerse
      );
    } else {
      const single = this.getVerse(
        parseResult.bookId,
        parseResult.chapter,
        parseResult.startVerse
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
   * Búsqueda por palabras clave en toda la Biblia usando FTS5
   */
  searchByText(keyword, limit = 50) {
    const cleanKeyword = (keyword || '').trim().replace(/[^\w\s]/g, '');
    if (!cleanKeyword) return [];

    const query = `
      SELECT v.id, v.book_id, b.name as book_name, v.chapter, v.verse, v.text 
      FROM bible_verses_fts fts
      JOIN bible_verses v ON v.id = fts.rowid
      JOIN bible_books b ON b.id = v.book_id
      WHERE bible_verses_fts MATCH ?
      ORDER BY v.book_id ASC, v.chapter ASC, v.verse ASC
      LIMIT ?
    `;

    try {
      return this.db.prepare(query).all(cleanKeyword, limit);
    } catch (err) {
      console.warn('[BibleRepository] Error en consulta FTS5:', err);
      // Fallback a LIKE estándar si el término tiene caracteres especiales de FTS
      return this.db.prepare(`
        SELECT v.id, v.book_id, b.name as book_name, v.chapter, v.verse, v.text 
        FROM bible_verses v
        JOIN bible_books b ON b.id = v.book_id
        WHERE v.text LIKE ?
        ORDER BY v.book_id ASC, v.chapter ASC, v.verse ASC
        LIMIT ?
      `).all(`%${cleanKeyword}%`, limit);
    }
  }
}

module.exports = BibleRepository;
