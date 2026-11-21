-- BIBLE: 015_chorus_playlists_service_date.sql
-- Añade la columna service_date para repertorios organizados por día o fecha del culto

ALTER TABLE chorus_playlists ADD COLUMN service_date TEXT;

