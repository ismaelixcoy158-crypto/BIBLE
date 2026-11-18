-- BIBLE: 007_roulette_schema.sql
-- Almacenamiento de listas y elementos para la ruleta dinámica

-- Tabla de Listas de Ruleta
CREATE TABLE IF NOT EXISTS roulette_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Elementos / Opciones de cada Ruleta
CREATE TABLE IF NOT EXISTS roulette_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL REFERENCES roulette_lists(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  color TEXT,
  position INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_roulette_items ON roulette_items(list_id);

-- Listas iniciales de muestra
INSERT OR IGNORE INTO roulette_lists (id, name) VALUES 
(1, 'Sociedades y Departamentos'),
(2, 'Números Sorteo (1 al 8)');

INSERT OR IGNORE INTO roulette_items (list_id, label, color, position) VALUES 
(1, 'Jóvenes', '#EF4444', 1),
(1, 'Damas', '#F59E0B', 2),
(1, 'Caballeros', '#3B82F6', 3),
(1, 'Niños', '#10B981', 4),
(1, 'Músicos', '#8B5CF6', 5),
(1, 'Ujieres', '#EC4899', 6),

(2, 'Número 1', '#EF4444', 1),
(2, 'Número 2', '#F97316', 2),
(2, 'Número 3', '#F59E0B', 3),
(2, 'Número 4', '#10B981', 4),
(2, 'Número 5', '#06B6D4', 5),
(2, 'Número 6', '#3B82F6', 6),
(2, 'Número 7', '#8B5CF6', 7),
(2, 'Número 8', '#EC4899', 8);

