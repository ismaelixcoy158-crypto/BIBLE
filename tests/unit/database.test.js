const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');

test('DatabaseManager - Inicialización, WAL y Migraciones', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_bible_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);

  t.after(() => {
    manager.close();
    // Limpieza de archivos de prueba
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe inicializar la base de datos y activar el modo WAL', () => {
    const db = manager.init();
    assert.ok(db, 'La base de datos debe ser instanciada');
    assert.equal(db.open, true, 'La base de datos debe estar abierta');

    const journalMode = db.pragma('journal_mode', { simple: true });
    assert.equal(journalMode.toLowerCase(), 'wal', 'Debe estar en modo WAL');

    const foreignKeys = db.pragma('foreign_keys', { simple: true });
    assert.equal(foreignKeys, 1, 'Las claves foráneas deben estar activadas');
  });

  await t.test('debe haber aplicado la migración 001 correctamente', () => {
    const db = manager.getInstance();
    
    // Verificar tabla de control
    const migrations = db.prepare('SELECT * FROM _migrations WHERE version = ?').get('001');
    assert.ok(migrations, 'La migración 001 debe estar registrada');
    assert.equal(migrations.version, '001');

    // Verificar tabla settings y valores por defecto
    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get('projection.theme');
    assert.ok(setting, 'La clave projection.theme debe existir');
    assert.equal(setting.value, '"dark"');

    // Verificar tabla projection_history
    const historyTable = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='projection_history'"
    ).get();
    assert.ok(historyTable, 'La tabla projection_history debe existir');
  });

  await t.test('no debe reaplicar migraciones ya ejecutadas', () => {
    const db = manager.getInstance();
    const countBefore = db.prepare('SELECT COUNT(*) as count FROM _migrations').get().count;
    // Ejecutar de nuevo el método de migraciones
    assert.doesNotThrow(() => manager.runMigrations());
    const countAfter = db.prepare('SELECT COUNT(*) as count FROM _migrations').get().count;
    assert.equal(countAfter, countBefore, 'El número de migraciones registradas debe mantenerse idéntico');
  });
});
