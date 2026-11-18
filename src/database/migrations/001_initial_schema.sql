-- BIBLE: 001_initial_schema.sql
-- Migración base del sistema: configuraciones y tabla de historial

-- Tabla de configuraciones generales clave/valor (JSON)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial general de proyecciones
CREATE TABLE IF NOT EXISTS projection_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module TEXT NOT NULL,          -- 'bible', 'chorus', 'preaching', 'spot', 'roulette', 'countdown'
  title TEXT NOT NULL,           -- Referencia bíblica, título del corito o nombre del archivo
  content TEXT,                  -- Contenido textual o metadato proyectado
  projected_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización de consultas en el historial
CREATE INDEX IF NOT EXISTS idx_history_module ON projection_history(module);
CREATE INDEX IF NOT EXISTS idx_history_projected_at ON projection_history(projected_at DESC);

-- Configuraciones predeterminadas iniciales
INSERT OR IGNORE INTO settings (key, value) VALUES 
('projection.display_index', '1'),
('projection.theme', '"dark"'),
('projection.default_background', '"bg-default-1.jpg"'),
('projection.transition', '"fade"'),
('projection.transition_duration_ms', '300');
