const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const CountdownRepository = require('../../src/database/repositories/countdown.repository.js');

test('CountdownRepository - Preajustes de Cuenta Regresiva', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_countdown_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new CountdownRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe listar los preajustes iniciales', () => {
    const presets = repo.getAllPresets();
    assert.ok(presets.length >= 4);
    assert.equal(presets[0].duration_seconds, 300); // 5 min
  });

  await t.test('debe crear y eliminar un nuevo preajuste', () => {
    const nuevo = repo.createPreset({
      name: 'Vigilia Especial (45 min)',
      duration_seconds: 2700,
      end_message: 'Comienza la Vigilia'
    });

    assert.ok(nuevo.id);
    assert.equal(nuevo.duration_seconds, 2700);

    repo.deletePreset(nuevo.id);
    const busqueda = repo.getPresetById(nuevo.id);
    assert.equal(busqueda, undefined);
  });
});
