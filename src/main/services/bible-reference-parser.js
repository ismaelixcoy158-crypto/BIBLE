const BIBLE_BOOKS = require('../../database/seeds/bible-books-seed.js');

/**
 * BIBLE — BibleReferenceParser
 * Parser tolerante para citas bíblicas por teclado.
 */
class BibleReferenceParser {
  constructor() {
    this.books = BIBLE_BOOKS;
    this.index = this.buildSearchIndex();
  }

  /**
   * Elimina diacríticos (tildes), caracteres no alfanuméricos y estandariza espacios
   */
  normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Construye un mapa en memoria de alias normalizados -> objeto libro
   */
  buildSearchIndex() {
    const map = new Map();

    for (const book of this.books) {
      // 1. Nombre oficial normalizado
      map.set(this.normalize(book.name), book);
      // 2. Abreviatura estándar normalizada
      map.set(this.normalize(book.standard_abbrev), book);
      // 3. Alias y variantes
      if (Array.isArray(book.aliases)) {
        for (const alias of book.aliases) {
          map.set(this.normalize(alias), book);
        }
      }
    }

    return map;
  }

  /**
   * Distancia Levenshtein para medir similitud de cadenas cortas
   */
  levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // sustitución
            matrix[i][j - 1] + 1,     // inserción
            matrix[i - 1][j] + 1      // eliminación
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Busca el libro coincidente por igualdad directa, prefijo o distancia Levenshtein
   */
  findBook(rawBookText) {
    const normalized = this.normalize(rawBookText);
    if (!normalized) return null;

    // 1. Coincidencia exacta en índice de alias
    if (this.index.has(normalized)) {
      return this.index.get(normalized);
    }

    // 2. Búsqueda por prefijo si la longitud es razonable (>= 3)
    if (normalized.length >= 3) {
      for (const [alias, book] of this.index.entries()) {
        if (alias.startsWith(normalized) || normalized.startsWith(alias)) {
          return book;
        }
      }
    }

    // 3. Tolerancia de error tipográfico menor (distancia Levenshtein <= 1)
    let bestMatch = null;
    let minDistance = 2; // Máximo 1 error permitido

    for (const [alias, book] of this.index.entries()) {
      if (Math.abs(alias.length - normalized.length) <= 1) {
        const dist = this.levenshtein(normalized, alias);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = book;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Analiza una cadena de texto y extrae la referencia bíblica
   * @param {string} input Texto ingresado (ej. "Juan 3:16", "jn 3.16-18", "sal23:1")
   */
  parse(input) {
    if (!input || typeof input !== 'string') {
      return { success: false, error: 'Entrada vacía o inválida' };
    }

    const cleanInput = input.trim();

    // Expresión regular universal para referencias bíblicas en español
    // Soporta: "1 Juan 3:16", "juan3:16", "jn 3.16-18", "Salmos 23"
    const regex = /^([1-3]?\s*[a-záéíóúñ\s]+?)\s*(\d+)(?:[:.,](\d+)(?:-(\d+))?)?$/i;
    const match = cleanInput.match(regex);

    if (!match) {
      return { success: false, error: `Referencia no reconocida: "${cleanInput}"` };
    }

    const [, rawBook, rawChapter, rawStartVerse, rawEndVerse] = match;

    const book = this.findBook(rawBook);
    if (!book) {
      return { success: false, error: `Libro no encontrado: "${rawBook.trim()}"` };
    }

    const chapter = parseInt(rawChapter, 10);
    if (chapter < 1 || chapter > book.chapters_count) {
      return {
        success: false,
        error: `El libro ${book.name} solo tiene ${book.chapters_count} capítulos (solicitado: ${chapter})`
      };
    }

    const startVerse = rawStartVerse ? parseInt(rawStartVerse, 10) : 1;
    const endVerse = rawEndVerse ? parseInt(rawEndVerse, 10) : (rawStartVerse ? null : null);

    let formattedReference = `${book.name} ${chapter}`;
    if (rawStartVerse) {
      formattedReference += `:${startVerse}`;
      if (rawEndVerse && rawEndVerse !== rawStartVerse) {
        formattedReference += `-${endVerse}`;
      }
    }
    formattedReference += ' (RV1909)';

    return {
      success: true,
      bookId: book.id,
      bookName: book.name,
      standardAbbrev: book.standard_abbrev,
      chapter,
      startVerse,
      endVerse: endVerse || (rawStartVerse ? startVerse : null),
      isSingleVerse: !endVerse || endVerse === startVerse,
      formattedReference
    };
  }
}

module.exports = BibleReferenceParser;
