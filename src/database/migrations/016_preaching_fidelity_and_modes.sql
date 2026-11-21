-- BIBLE: 016_preaching_fidelity_and_modes.sql
-- Ampliación del esquema de predicaciones para fidelidad gráfica completa y alternancia de fondos

ALTER TABLE preachings ADD COLUMN preacher TEXT;
ALTER TABLE preachings ADD COLUMN bible_passage TEXT;
ALTER TABLE preachings ADD COLUMN render_mode TEXT DEFAULT 'original'; -- 'original' | 'church_bg'

ALTER TABLE preaching_slides ADD COLUMN slide_title TEXT;
ALTER TABLE preaching_slides ADD COLUMN slide_text TEXT;

-- Asegurar que la presentación de muestra inicial exista con datos enriquecidos
INSERT OR IGNORE INTO preachings (id, title, preacher, bible_passage, original_filename, file_type, slide_count, last_slide_index, render_mode)
VALUES (1, 'El Poder de la Oración y la Fe', 'Pastor de la Iglesia', 'Santiago 5:16', 'predica_ejemplo.pdf', 'pdf', 4, 0, 'original');

-- Actualizar si ya existía sin los nuevos campos
UPDATE preachings 
SET preacher = COALESCE(preacher, 'Pastor de la Iglesia'),
    bible_passage = COALESCE(bible_passage, 'Santiago 5:16'),
    render_mode = COALESCE(render_mode, 'original'),
    slide_count = 4
WHERE id = 1;

DELETE FROM preaching_slides WHERE preaching_id = 1;

INSERT INTO preaching_slides (preaching_id, slide_index, slide_image_path, slide_title, slide_text, notes)
VALUES 
(1, 0, 'pres_1/slide_001.png', 'El Poder de la Oración y la Fe', '«La oración eficaz del justo puede mucho.» (Santiago 5:16)', 'Introducción: Definición bíblica de la oración eficaz y el poder de clamar en unidad.'),
(1, 1, 'pres_1/slide_002.png', '1. La Certeza de la Fe', '«Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.» (Hebreos 11:1)', 'Punto 1: La fe inquebrantable que no duda en medio de la prueba.'),
(1, 2, 'pres_1/slide_003.png', '2. Clamor en el Altar', '«Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.» (Jeremías 33:3)', 'Punto 2: El llamado divino al altar de oración.'),
(1, 3, 'pres_1/slide_004.png', '3. Victoria por el Espíritu Santo', '«No con ejército, ni con fuerza, sino con mi Espíritu, ha dicho Jehová de los ejércitos.» (Zacarías 4:6)', 'Conclusión: La victoria final no es en nuestras fuerzas, sino por el poder del Espíritu Santo.');

