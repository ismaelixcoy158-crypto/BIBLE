-- BIBLE: 004_choruses_schema.sql
-- Estructura para el módulo de Coritos Pentecostales y de Adoración

-- Categorías de Coritos
CREATE TABLE IF NOT EXISTS chorus_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Principal de Coritos
CREATE TABLE IF NOT EXISTS choruses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  category_id INTEGER REFERENCES chorus_categories(id) ON DELETE SET NULL,
  background TEXT,
  custom_slides_json TEXT, -- JSON con diapositivas editadas manualmente si aplica
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_choruses_category ON choruses(category_id);
CREATE INDEX IF NOT EXISTS idx_choruses_title ON choruses(title);

-- Tabla de Listas de Culto / Repertorios
CREATE TABLE IF NOT EXISTS chorus_playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Elementos de cada lista de culto
CREATE TABLE IF NOT EXISTS chorus_playlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id INTEGER NOT NULL REFERENCES chorus_playlists(id) ON DELETE CASCADE,
  chorus_id INTEGER NOT NULL REFERENCES choruses(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  UNIQUE(playlist_id, position)
);

-- Búsqueda Instantánea en Texto Completo (FTS5) para Modo Espontáneo
CREATE VIRTUAL TABLE IF NOT EXISTS choruses_fts USING fts5(
  title,
  lyrics,
  content='choruses',
  content_rowid='id',
  tokenize = 'unicode61 remove_diacritics 2'
);

-- Triggers para mantener sincronizado el índice FTS5
CREATE TRIGGER IF NOT EXISTS choruses_ai AFTER INSERT ON choruses BEGIN
  INSERT INTO choruses_fts(rowid, title, lyrics) VALUES (new.id, new.title, new.lyrics);
END;

CREATE TRIGGER IF NOT EXISTS choruses_ad AFTER DELETE ON choruses BEGIN
  INSERT INTO choruses_fts(choruses_fts, rowid, title, lyrics) VALUES('delete', old.id, old.title, old.lyrics);
END;

CREATE TRIGGER IF NOT EXISTS choruses_au AFTER UPDATE ON choruses BEGIN
  INSERT INTO choruses_fts(choruses_fts, rowid, title, lyrics) VALUES('delete', old.id, old.title, old.lyrics);
  INSERT INTO choruses_fts(rowid, title, lyrics) VALUES (new.id, new.title, new.lyrics);
END;

-- Inserción de Categorías Predeterminadas
INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES 
(1, 'Coritos Pentecostales', '#EF4444'),
(2, 'Coros de Adoración', '#3B82F6');

-- Inserción de Coritos Iniciales de Muestra para el Culto
INSERT OR IGNORE INTO choruses (id, title, lyrics, category_id) VALUES
(1, 'Alabaré a mi Señor', 'Alabaré, alabaré, alabaré, alabaré\nAlabaré a mi Señor\n\nJuan vio el número de los redimidos\nY todos alababan al Señor\nUnos oraban, otros cantaban\nY todos alababan al Señor\n\nAlabaré, alabaré, alabaré, alabaré\nAlabaré a mi Señor', 1),
(2, 'En el principio el Espíritu de Dios', 'En el principio el Espíritu de Dios\nSe movía sobre las aguas\n\nY hoy se mueve dentro de mi corazón\nY hoy se mueve dentro de mi corazón', 1),
(3, 'Una mirada de fe', 'Una mirada de fe, una mirada de fe\nEs la que puede salvar al pecador\n\nY si tú vienes a Cristo Jesús\nÉl te perdonará\nPorque una mirada de fe\nEs la que te puede salvar', 1),
(4, 'Como el ciervo brama', 'Como el ciervo brama por las corrientes de las aguas\nAsí clama por ti, oh Dios, el alma mía\n\nMi alma tiene sed del Dios vivo\n¿Cuándo vendré y me presentaré delante de Dios?', 2),
(5, 'Yo me alegré con los que me decían', 'Yo me alegré con los que me decían\nA la casa de Jehová iremos\n\nAllí estaré, allí estaré\nA la casa de Jehová iremos', 1);

