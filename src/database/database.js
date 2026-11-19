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
      const { app } = require('electron');
      const userDataDir = app.getPath('userData');
      const dbDir = path.join(userDataDir, 'database');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      return path.join(dbDir, 'bible.db');
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
  }

  /**
   * Carga los 31,102 versículos de la RV1909 si la base de datos es nueva
   */
  seedFullBibleIfEmpty() {
    try {
      const countRow = this.db.prepare('SELECT COUNT(*) as count FROM bible_verses').get();
      if (countRow && countRow.count < 100) {
        const seedPath = path.join(__dirname, 'seeds', 'rv1909-complete.json');
        if (fs.existsSync(seedPath)) {
          const raw = fs.readFileSync(seedPath, 'utf-8');
          const verses = JSON.parse(raw);
          const insertStmt = this.db.prepare(`
            INSERT OR REPLACE INTO bible_verses (book_id, chapter, verse, text)
            VALUES (@book_id, @chapter, @verse, @text)
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

