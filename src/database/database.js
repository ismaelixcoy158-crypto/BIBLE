const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor(customDbPath = null) {
    this.customDbPath = customDbPath;
    this.db = null;
  }

  /**
   * Obtiene la ruta física del archivo SQLite
   */
  getDatabasePath() {
    if (this.customDbPath) {
      return this.customDbPath;
    }

    // Si estamos en entorno Electron
    if (process.versions.electron) {
      const electron = require('electron');
      const app = electron.app || (electron.remote && electron.remote.app);
      if (app && typeof app.getPath === 'function') {
        const userDataDir = app.getPath('userData');
        const dbDir = path.join(userDataDir, 'database');
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        return path.join(dbDir, 'bible.db');
      }
    }

    // Entorno de pruebas o Node puro
    const localDir = path.join(process.cwd(), 'userData', 'database');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'bible.db');
  }

  /**
   * Inicializa la conexión SQLite con optimizaciones WAL e integridad referencial
   */
  init() {
    if (this.db) {
      return this.db;
    }

    const dbPath = this.getDatabasePath();
    this.db = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : null
    });

    // Optimizaciones de estabilidad y rendimiento requeridas
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('foreign_keys = ON');

    this.runMigrations();
    return this.db;
  }

  /**
   * Ejecuta migraciones versionadas de forma transaccional
   */
  runMigrations() {
    // 1. Crear tabla de control de migraciones si no existe
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Leer archivos en src/database/migrations
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    const getAppliedStmt = this.db.prepare('SELECT version FROM _migrations WHERE version = ?');
    const insertMigrationStmt = this.db.prepare(
      'INSERT INTO _migrations (version, name) VALUES (?, ?)'
    );

    for (const file of files) {
      const versionMatch = file.match(/^(\d+)_(.+)\.sql$/);
      if (!versionMatch) continue;

      const [, version, name] = versionMatch;
      const alreadyApplied = getAppliedStmt.get(version);

      if (!alreadyApplied) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');

        // Ejecutar migración dentro de una transacción segura
        const applyMigration = this.db.transaction(() => {
          this.db.exec(sql);
          insertMigrationStmt.run(version, name);
        });

        applyMigration();
      }
    }

    // Auto-seed de la Biblia completa Reina-Valera 1909 si está vacía
    this.seedFullBibleIfEmpty();

    // Auto-seed de más de 300 coritos pentecostales si la tabla tiene menos de 50 registros
    this.seedChorusesIfEmpty();
  }

  /**
   * Carga más de 300 coritos pentecostales clásicos si la base de datos es nueva o incompleta
   */
  seedChorusesIfEmpty() {
    try {
      const chorusesCount = this.db.prepare("SELECT COUNT(*) as count FROM choruses").get();
      if (!chorusesCount || chorusesCount.count < 50) {
        // Asegurar que las categorías temáticas existan
        const insertCat = this.db.prepare("INSERT OR IGNORE INTO chorus_categories (id, name, color) VALUES (?, ?, ?)");
        const defaultCats = [
          [1, 'Coritos Pentecostales', '#EF4444'],
          [2, 'Coros de Adoración', '#3B82F6'],
          [3, 'Felicidad, Gozo y Alegría', '#F59E0B'],
          [4, 'Júbilo y Alabanza', '#10B981'],
          [5, 'Espíritu Santo y Avivamiento', '#EF4444'],
          [6, 'Victoria y Guerra Espiritual', '#8B5CF6'],
          [7, 'Gratitud y Bendición', '#06B6D4'],
          [8, 'Adoración y Presencia de Dios', '#3B82F6'],
          [9, 'Salvación y Testimonio', '#EC4899'],
          [10, 'Iglesia, Unidad y Servicio', '#14B8A6'],
          [11, 'Cielo, Esperanza y Segunda Venida', '#F97316']
        ];
        for (const [cid, cname, ccolor] of defaultCats) {
          insertCat.run(cid, cname, ccolor);
        }

        const seedPath = path.join(__dirname, 'seeds', 'pentecostal-choruses.json');
        if (fs.existsSync(seedPath)) {
          const raw = fs.readFileSync(seedPath, 'utf-8');
          const choruses = JSON.parse(raw);
          const insertStmt = this.db.prepare(`
            INSERT OR IGNORE INTO choruses (title, lyrics, category_id)
            VALUES (@title, @lyrics, @category_id)
          `);
          const insertMany = this.db.transaction((items) => {
            for (const item of items) {
              insertStmt.run(item);
            }
          });
          insertMany(choruses);

          try {
            this.db.exec("INSERT INTO choruses_fts(choruses_fts) VALUES('rebuild');");
          } catch (e) {
            console.warn('[Database] Error reconstruyendo FTS5 de coritos:', e.message);
          }

          console.log(`[Database] Sembrados ${choruses.length} coritos pentecostales clásicos.`);
        }
      }
    } catch (err) {
      console.warn('[Database] Advertencia al sembrar coritos pentecostales:', err.message);
    }
  }

  /**
   * Carga los 31,102 versículos de la RV1909 y RVG si la base de datos es nueva
   */
  seedFullBibleIfEmpty() {
    try {
      // 1. Sembrar RV1909 si está vacía
      const rv1909Count = this.db.prepare("SELECT COUNT(*) as count FROM bible_verses WHERE version_code = 'RV1909'").get();
      if (!rv1909Count || rv1909Count.count < 100) {
        const seed1909Path = path.join(__dirname, 'seeds', 'rv1909-complete.json');
        if (fs.existsSync(seed1909Path)) {
          const raw = fs.readFileSync(seed1909Path, 'utf-8');
          const verses = JSON.parse(raw);
          const insertStmt = this.db.prepare(`
            INSERT OR REPLACE INTO bible_verses (version_code, book_id, chapter, verse, text)
            VALUES ('RV1909', @book_id, @chapter, @verse, @text)
          `);
          const insertMany = this.db.transaction((items) => {
            for (const item of items) {
              insertStmt.run(item);
            }
          });
          insertMany(verses);
          console.log(`[Database] Sembrados ${verses.length} versículos de la RV1909 completa.`);
        }
      }

      // 2. Sembrar RVG si está vacía
      const rvgCount = this.db.prepare("SELECT COUNT(*) as count FROM bible_verses WHERE version_code = 'RVG'").get();
      if (!rvgCount || rvgCount.count < 100) {
        const seedRvgPath = path.join(__dirname, 'seeds', 'rvg-complete.json');
        if (fs.existsSync(seedRvgPath)) {
          const raw = fs.readFileSync(seedRvgPath, 'utf-8');
          const verses = JSON.parse(raw);
          const insertStmt = this.db.prepare(`
            INSERT OR REPLACE INTO bible_verses (version_code, book_id, chapter, verse, text)
            VALUES ('RVG', @book_id, @chapter, @verse, @text)
          `);
          const insertMany = this.db.transaction((items) => {
            for (const item of items) {
              insertStmt.run(item);
            }
          });
          insertMany(verses);
          console.log(`[Database] Sembrados ${verses.length} versículos de la RVG completa.`);
        }
      }
    } catch (err) {
      console.warn('[Database] Advertencia al sembrar versículos bíblicos:', err.message);
    }
  }

  /**
   * Cierra la conexión de forma limpia
   */
  close() {
    if (this.db && this.db.open) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Obtiene la instancia activa
   */
  getInstance() {
    if (!this.db) {
      return this.init();
    }
    return this.db;
  }
}

// Exportar singleton por defecto y la clase para pruebas aisladas
const defaultInstance = new DatabaseManager();
module.exports = defaultInstance;
module.exports.DatabaseManager = DatabaseManager;

