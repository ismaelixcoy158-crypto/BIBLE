-- BIBLE: 005_preaching_schema.sql
-- Almacenamiento y gestión de presentaciones para predicación

-- Tabla de Presentaciones
CREATE TABLE IF NOT EXISTS preachings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT CHECK(file_type IN ('pdf', 'pptx', 'images')) NOT NULL,
  slide_count INTEGER DEFAULT 0,
  last_slide_index INTEGER DEFAULT 0, -- Preserva la diapositiva activa
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Diapositivas individuales
CREATE TABLE IF NOT EXISTS preaching_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  preaching_id INTEGER NOT NULL REFERENCES preachings(id) ON DELETE CASCADE,
  slide_index INTEGER NOT NULL,
  slide_image_path TEXT NOT NULL,
  notes TEXT,
  UNIQUE(preaching_id, slide_index)
);

CREATE INDEX IF NOT EXISTS idx_preaching_slides ON preaching_slides(preaching_id, slide_index);

-- Presentación de muestra para pruebas de desarrollo
INSERT OR IGNORE INTO preachings (id, title, original_filename, file_type, slide_count, last_slide_index)
VALUES (1, 'El Poder de la Oración y la Fe', 'predica_ejemplo.pdf', 'pdf', 3, 0);

INSERT OR IGNORE INTO preaching_slides (preaching_id, slide_index, slide_image_path, notes)
VALUES 
(1, 0, 'sample_slide_1.jpg', 'Introducción: Definición de la fe bíblica'),
(1, 1, 'sample_slide_2.jpg', 'Punto 1: La constancia en la oración secreta'),
(1, 2, 'sample_slide_3.jpg', 'Conclusión: Resultados y testimonios de la fe');

