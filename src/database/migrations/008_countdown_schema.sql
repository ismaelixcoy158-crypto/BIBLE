-- BIBLE: 008_countdown_schema.sql
-- Almacenamiento de preajustes y configuración para la cuenta regresiva

CREATE TABLE IF NOT EXISTS countdown_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  duration_seconds INTEGER NOT NULL,
  end_message TEXT DEFAULT '¡Bienvenidos a la Casa de Dios!',
  background TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO countdown_presets (id, name, duration_seconds, end_message, is_default)
VALUES 
(1, 'Inicio de Culto (5 min)', 300, '¡Bienvenidos a la Casa de Dios! El culto ha comenzado', 1),
(2, 'Aviso Previo (10 min)', 600, '¡Bienvenidos! Iniciamos en unos momentos', 0),
(3, 'Apertura Solemne (15 min)', 900, 'Tiempo de Oración y Alabanza', 0),
(4, 'Antesala de Servicio (30 min)', 1800, 'Bienvenidos a la Casa del Señor', 0);

