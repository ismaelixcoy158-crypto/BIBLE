-- BIBLE: 006_spots_schema.sql
-- Almacenamiento y biblioteca de anuncios multimedia y spots

CREATE TABLE IF NOT EXISTS spots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_type TEXT CHECK(file_type IN ('image', 'video')) NOT NULL,
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER DEFAULT 0,
  duration_seconds REAL DEFAULT 0,
  loop_enabled INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_spots_type ON spots(file_type);

-- Muestras para desarrollo inicial
INSERT OR IGNORE INTO spots (id, title, file_type, original_filename, stored_filename, mime_type, file_size, loop_enabled)
VALUES 
(1, 'Campamento Nacional de Jóvenes 2026', 'image', 'campamento.png', 'sample_campamento.png', 'image/png', 2048500, 0),
(2, 'Gran Vigilia de Oración y Avivamiento', 'video', 'vigilia_spot.mp4', 'sample_vigilia.mp4', 'video/mp4', 15480000, 1);
