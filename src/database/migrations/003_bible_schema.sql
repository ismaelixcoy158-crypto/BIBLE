-- BIBLE: 003_bible_schema.sql
-- Estructura de almacenamiento de la Biblia Reina-Valera 1909

-- Tabla de Libros Bíblicos (66 libros)
CREATE TABLE IF NOT EXISTS bible_books (
  id INTEGER PRIMARY KEY,                -- 1 a 66 orden canónico
  testament TEXT CHECK (testament IN ('OT', 'NT')) NOT NULL,
  name TEXT NOT NULL UNIQUE,             -- 'Génesis', 'Juan', etc.
  standard_abbrev TEXT NOT NULL,         -- 'Gn', 'Jn', etc.
  aliases_json TEXT NOT NULL,            -- Variaciones y abreviaturas en formato JSON
  chapters_count INTEGER NOT NULL
);

-- Tabla de Versículos Bíblicos
CREATE TABLE IF NOT EXISTS bible_verses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  UNIQUE(book_id, chapter, verse)
);

-- Índices compuestos para búsqueda instantánea
CREATE INDEX IF NOT EXISTS idx_verses_lookup ON bible_verses(book_id, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_chapter ON bible_verses(book_id, chapter);

-- Tabla virtual FTS5 para búsqueda de texto completo en toda la Biblia
CREATE VIRTUAL TABLE IF NOT EXISTS bible_verses_fts USING fts5(
  text,
  content='bible_verses',
  content_rowid='id',
  tokenize = 'unicode61 remove_diacritics 2'
);

-- Triggers para mantener sincronizado el índice FTS5
CREATE TRIGGER IF NOT EXISTS bible_verses_ai AFTER INSERT ON bible_verses BEGIN
  INSERT INTO bible_verses_fts(rowid, text) VALUES (new.id, new.text);
END;

CREATE TRIGGER IF NOT EXISTS bible_verses_ad AFTER DELETE ON bible_verses BEGIN
  INSERT INTO bible_verses_fts(bible_verses_fts, rowid, text) VALUES('delete', old.id, old.text);
END;

CREATE TRIGGER IF NOT EXISTS bible_verses_au AFTER UPDATE ON bible_verses BEGIN
  INSERT INTO bible_verses_fts(bible_verses_fts, rowid, text) VALUES('delete', old.id, old.text);
  INSERT INTO bible_verses_fts(rowid, text) VALUES (new.id, new.text);
END;


-- Inserción canónica de los 66 libros
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (1, 'OT', 'Génesis', 'Gn', '["genesis","gen","gn","ge","1moises"]', 50);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (2, 'OT', 'Éxodo', 'Ex', '["exodo","exo","ex","2moises"]', 40);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (3, 'OT', 'Levítico', 'Lv', '["levitico","lev","lv","le","3moises"]', 27);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (4, 'OT', 'Números', 'Nm', '["numeros","num","nm","nu","4moises"]', 36);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (5, 'OT', 'Deuteronomio', 'Dt', '["deuteronomio","deut","dt","de","5moises"]', 34);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (6, 'OT', 'Josué', 'Jos', '["josue","jos","josh"]', 24);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (7, 'OT', 'Jueces', 'Jue', '["jueces","juez","jue","jdc"]', 21);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (8, 'OT', 'Rut', 'Rt', '["rut","rt","ruth"]', 4);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (9, 'OT', '1 Samuel', '1S', '["1 samuel","1samuel","1sam","1s","1sa","i samuel"]', 31);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (10, 'OT', '2 Samuel', '2S', '["2 samuel","2samuel","2sam","2s","2sa","ii samuel"]', 24);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (11, 'OT', '1 Reyes', '1R', '["1 reyes","1reyes","1rey","1r","1re","i reyes"]', 22);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (12, 'OT', '2 Reyes', '2R', '["2 reyes","2reyes","2rey","2r","2re","ii reyes"]', 25);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (13, 'OT', '1 Crónicas', '1Cr', '["1 cronicas","1cronicas","1cron","1cr","i cronicas"]', 29);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (14, 'OT', '2 Crónicas', '2Cr', '["2 cronicas","2cronicas","2cron","2cr","ii cronicas"]', 36);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (15, 'OT', 'Esdras', 'Esd', '["esdras","esd","ezr"]', 10);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (16, 'OT', 'Nehemías', 'Neh', '["nehemias","neh","ne"]', 13);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (17, 'OT', 'Ester', 'Est', '["ester","est","es"]', 10);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (18, 'OT', 'Job', 'Job', '["job","jb"]', 42);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (19, 'OT', 'Salmos', 'Sal', '["salmos","salmo","sal","ps","psalms"]', 150);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (20, 'OT', 'Proverbios', 'Pr', '["proverbios","proverbio","prov","pr","pro"]', 31);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (21, 'OT', 'Eclesiastés', 'Ec', '["eclesiastes","ecl","ec","cohelet"]', 12);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (22, 'OT', 'Cantares', 'Cnt', '["cantares","cantar","cnt","ct","cantardeloscantares"]', 8);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (23, 'OT', 'Isaías', 'Is', '["isaias","isa","is"]', 66);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (24, 'OT', 'Jeremías', 'Jer', '["jeremias","jer","jr"]', 52);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (25, 'OT', 'Lamentaciones', 'Lm', '["lamentaciones","lam","lm"]', 5);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (26, 'OT', 'Ezequiel', 'Ez', '["ezequiel","eze","ez"]', 48);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (27, 'OT', 'Daniel', 'Dn', '["daniel","dan","dn"]', 12);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (28, 'OT', 'Oseas', 'Os', '["oseas","os","ho"]', 14);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (29, 'OT', 'Joel', 'Jl', '["joel","jl","joe"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (30, 'OT', 'Amós', 'Am', '["amos","am"]', 9);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (31, 'OT', 'Abdías', 'Ob', '["abdias","abd","ob"]', 1);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (32, 'OT', 'Jonás', 'Jon', '["jonas","jon"]', 4);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (33, 'OT', 'Miqueas', 'Miq', '["miqueas","miq","mic"]', 7);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (34, 'OT', 'Nahúm', 'Nah', '["nahum","nah","na"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (35, 'OT', 'Habacuc', 'Hab', '["habacuc","hab"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (36, 'OT', 'Sofonías', 'Sof', '["sofonias","sof","so"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (37, 'OT', 'Hageo', 'Hag', '["hageo","hag","hg"]', 2);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (38, 'OT', 'Zacarías', 'Zac', '["zacarias","zac"]', 14);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (39, 'OT', 'Malaquías', 'Mal', '["malaquias","mal"]', 4);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (40, 'NT', 'Mateo', 'Mt', '["mateo","mat","mt"]', 28);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (41, 'NT', 'Marcos', 'Mc', '["marcos","mar","mc","mr"]', 16);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (42, 'NT', 'Lucas', 'Lc', '["lucas","luc","lc","lu"]', 24);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (43, 'NT', 'Juan', 'Jn', '["juan","jn","jhn"]', 21);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (44, 'NT', 'Hechos', 'Hch', '["hechos","hch","act","hchosp"]', 28);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (45, 'NT', 'Romanos', 'Ro', '["romanos","rom","ro","rm"]', 16);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (46, 'NT', '1 Corintios', '1Co', '["1 corintios","1corintios","1cor","1co","i corintios"]', 16);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (47, 'NT', '2 Corintios', '2Co', '["2 corintios","2corintios","2cor","2co","ii corintios"]', 13);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (48, 'NT', 'Gálatas', 'Gá', '["galatas","gal","ga"]', 6);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (49, 'NT', 'Efesios', 'Ef', '["efesios","efe","ef"]', 6);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (50, 'NT', 'Filipenses', 'Fil', '["filipenses","fil","flp"]', 4);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (51, 'NT', 'Colosenses', 'Col', '["colosenses","col","cl"]', 4);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (52, 'NT', '1 Tesalonicenses', '1Ts', '["1 tesalonicenses","1tesalonicenses","1tes","1ts","i tesalonicenses"]', 5);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (53, 'NT', '2 Tesalonicenses', '2Ts', '["2 tesalonicenses","2tesalonicenses","2tes","2ts","ii tesalonicenses"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (54, 'NT', '1 Timoteo', '1Ti', '["1 timoteo","1timoteo","1tim","1ti","i timoteo"]', 6);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (55, 'NT', '2 Timoteo', '2Ti', '["2 timoteo","2timoteo","2tim","2ti","ii timoteo"]', 4);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (56, 'NT', 'Tito', 'Tit', '["tito","tit","ti"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (57, 'NT', 'Filemón', 'Flm', '["filemon","flm","phm"]', 1);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (58, 'NT', 'Hebreos', 'He', '["hebreos","heb","he"]', 13);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (59, 'NT', 'Santiago', 'Stg', '["santiago","sant","stg","jas"]', 5);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (60, 'NT', '1 Pedro', '1P', '["1 pedro","1pedro","1ped","1pe","1p","i pedro"]', 5);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (61, 'NT', '2 Pedro', '2P', '["2 pedro","2pedro","2ped","2pe","2p","ii pedro"]', 3);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (62, 'NT', '1 Juan', '1Jn', '["1 juan","1juan","1jn","1jhn","i juan"]', 5);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (63, 'NT', '2 Juan', '2Jn', '["2 juan","2juan","2jn","2jhn","ii juan"]', 1);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (64, 'NT', '3 Juan', '3Jn', '["3 juan","3juan","3jn","3jhn","iii juan"]', 1);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (65, 'NT', 'Judas', 'Jds', '["judas","jud","jds"]', 1);
INSERT OR IGNORE INTO bible_books (id, testament, name, standard_abbrev, aliases_json, chapters_count) VALUES (66, 'NT', 'Apocalipsis', 'Ap', '["apocalipsis","apoc","ap","rev","revelacion"]', 22);

-- Versículos muestra para desarrollo inicial
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 3, 16, 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 3, 17, 'Porque no envió Dios á su Hijo al mundo para que condene al mundo, mas para que el mundo sea salvo por él.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 3, 18, 'El que en él cree, no es condenado; mas el que no cree, ya es condenado, porque no creyó en el nombre del unigénito Hijo de Dios.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 1, 1, 'EN el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 1, 2, 'Este era en el principio con Dios.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 1, 3, 'Todas las cosas por él fueron hechas; y sin él nada de lo que es hecho, fué hecho.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 1, 4, 'En él estaba la vida, y la vida era la luz de los hombres.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 1, 5, 'Y la luz en las tinieblas resplandece; mas las tinieblas no la comprendieron.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (43, 14, 6, 'Jesús le dice: Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 100, 1, 'CANTAD alegres á Dios, habitantes de toda la tierra.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 100, 2, 'Servid á Jehová con alegría: Venid ante su acatamiento con regocijo.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 100, 3, 'Reconoced que Jehová es Dios: El nos hizo, y no nosotros á nosotros mismos; Pueblo suyo somos, y ovejas de su prado.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 100, 4, 'Entrad por sus puertas con reconocimiento, Por sus atrios con alabanza: Alabadle, bendecid su nombre.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 100, 5, 'Porque Jehová es bueno; para siempre es su misericordia, Y su verdad por todas las generaciones.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 23, 1, 'JEHOVA es mi pastor; nada me faltará.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 23, 2, 'En lugares de delicados pastos me hará yacer: Junto á aguas de reposo me pastoreará.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 23, 3, 'Confortará mi alma; Guiárame por sendas de justicia por amor de su nombre.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 23, 4, 'Aunque ande en valle de sombra de muerte, No temeré mal alguno; porque tú estarás conmigo: Tu vara y tu cayado me infundirán aliento.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 23, 5, 'Aderezarás mesa delante de mí, en presencia de mis angustiadores: Ungiste mi cabeza con aceite: mi copa está rebosando.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (19, 23, 6, 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida: Y en la casa de Jehová moraré por largos días.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (1, 1, 1, 'EN el principio crió Dios los cielos y la tierra.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (1, 1, 2, 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la haz del abismo, y el Espíritu de Dios se movía sobre la haz de las aguas.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (1, 1, 3, 'Y dijo Dios: Sea la luz: y fué la luz.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (6, 1, 9, 'Mira que te mando que te esfuerces y seas valiente: no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (46, 13, 4, 'La caridad es sufrida, es benigna; la caridad no tiene envidia, la caridad no hace sinrazón, no se ensancha;');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (46, 13, 5, 'No es injuriosa, no busca lo suyo, no se irrita, no piensa el mal;');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (46, 13, 6, 'No se goza de la injusticia, mas se goza de la verdad;');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (46, 13, 7, 'Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (46, 13, 8, 'La caridad nunca deja de ser: mas las profecías se han de acabar, y cesarán las lenguas, y la ciencia ha de ser quitada.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (46, 13, 13, 'Y ahora permanecen la fe, la esperanza, y la caridad, estas tres: empero la mayor de ellas es la caridad.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (45, 8, 28, 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien, es á saber, á los que conforme al propósito son llamados.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (45, 8, 31, '¿Pues qué diremos á esto? Si Dios por nosotros, ¿quién contra nosotros?');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (45, 8, 38, 'Por lo cual estoy cierto que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir,');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (45, 8, 39, 'Ni lo alto, ni lo bajo, ni ninguna criatura nos podrá apartar del amor de Dios, que es en Cristo Jesús Señor nuestro.');
INSERT OR IGNORE INTO bible_verses (book_id, chapter, verse, text) VALUES (66, 22, 20, 'El que da testimonio de estas cosas, dice: Ciertamente, vengo en breve. Amén, sea así. Ven: Señor Jesús.');
