-- BIBLE: 002_church_identity.sql
-- Tabla para almacenar la identidad institucional de la iglesia (registro único)

CREATE TABLE IF NOT EXISTS church_identity (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'Mi Iglesia',
  logo_filename TEXT,
  logo_source_type TEXT CHECK (logo_source_type IN ('local', 'url', 'none')) DEFAULT 'none',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar registro inicial por defecto
INSERT OR IGNORE INTO church_identity (id, name, logo_filename, logo_source_type)
VALUES (1, 'Mi Iglesia', NULL, 'none');

