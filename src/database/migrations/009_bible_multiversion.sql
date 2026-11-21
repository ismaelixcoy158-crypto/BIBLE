-- BIBLE: 009_bible_multiversion.sql
-- Añade soporte multiversión con Reina-Valera 1909 (RV1909) y Reina Valera Gómez (RVG)

-- 1. Tabla de Versiones Bíblicas
CREATE TABLE IF NOT EXISTS bible_versions (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  is_default INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO bible_versions (code, name, short_name, is_default)
VALUES ('RV1909', 'Reina-Valera 1909 (Clásica)', 'RV1909', 1);

INSERT OR IGNORE INTO bible_versions (code, name, short_name, is_default)
VALUES ('RVG', 'Reina Valera Gómez (Moderna)', 'RVG', 0);

-- 2. Migrar tabla bible_verses para incluir version_code
CREATE TABLE IF NOT EXISTS bible_verses_multiver (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version_code TEXT NOT NULL DEFAULT 'RV1909' REFERENCES bible_versions(code) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  UNIQUE(version_code, book_id, chapter, verse)
);

-- Copiar versículos existentes asignándoles 'RV1909'
INSERT OR IGNORE INTO bible_verses_multiver (id, version_code, book_id, chapter, verse, text)
SELECT id, 'RV1909', book_id, chapter, verse, text FROM bible_verses;

DROP TABLE IF EXISTS bible_verses;
ALTER TABLE bible_verses_multiver RENAME TO bible_verses;

-- 3. Índices optimizados para búsqueda instantánea por versión
CREATE INDEX IF NOT EXISTS idx_verses_ver_lookup ON bible_verses(version_code, book_id, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_ver_chapter ON bible_verses(version_code, book_id, chapter);

-- 4. Reconstrucción de FTS5 para búsqueda con versión
DROP TABLE IF EXISTS bible_verses_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS bible_verses_fts USING fts5(
  text,
  content='bible_verses',
  content_rowid='id',
  tokenize = 'unicode61 remove_diacritics 2'
);

INSERT INTO bible_verses_fts(rowid, text) SELECT id, text FROM bible_verses;

-- Triggers de FTS5
DROP TRIGGER IF EXISTS bible_verses_ai;
DROP TRIGGER IF EXISTS bible_verses_ad;
DROP TRIGGER IF EXISTS bible_verses_au;

CREATE TRIGGER bible_verses_ai AFTER INSERT ON bible_verses BEGIN
  INSERT INTO bible_verses_fts(rowid, text) VALUES (new.id, new.text);
END;

CREATE TRIGGER bible_verses_ad AFTER DELETE ON bible_verses BEGIN
  INSERT INTO bible_verses_fts(bible_verses_fts, rowid, text) VALUES('delete', old.id, old.text);
END;

CREATE TRIGGER bible_verses_au AFTER UPDATE ON bible_verses BEGIN
  INSERT INTO bible_verses_fts(bible_verses_fts, rowid, text) VALUES('delete', old.id, old.text);
  INSERT INTO bible_verses_fts(rowid, text) VALUES (new.id, new.text);
END;

