const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const RouletteRepository = require('../../src/database/repositories/roulette.repository.js');

test('RouletteRepository - Listas de Ruleta y Elementos', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_roulette_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new RouletteRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe listar las listas predeterminadas sembradas', () => {
    const lists = repo.getAllLists();
    assert.ok(lists.length >= 2);
    const soc = lists.find(l => l.name.includes('Sociedades'));
    assert.ok(soc);
    assert.equal(soc.item_count, 6);
  });

  await t.test('debe obtener una lista con todos sus elementos ordenados', () => {
    const list = repo.getListById(1);
    assert.ok(list);
    assert.equal(list.items.length, 6);
    assert.equal(list.items[0].label, 'Jóvenes');
  });

  await t.test('debe crear una nueva lista y agregar elementos', () => {
    const creada = repo.createList('Preguntas Bíblicas', ['¿Quién construyó el arca?', '¿Quién abrió el mar?']);
    assert.ok(creada.id);
    assert.equal(creada.items.length, 2);

    const conNuevo = repo.addItem(creada.id, '¿Cuántos días llovió?');
    assert.equal(conNuevo.items.length, 3);
  });

  await t.test('debe eliminar elementos y listas', () => {
    const lista = repo.createList('Lista temporal', ['Elemento 1', 'Elemento 2']);
    repo.removeItem(lista.items[0].id);

    const reloaded = repo.getListById(lista.id);
    assert.equal(reloaded.items.length, 1);

    repo.deleteList(lista.id);
    const busqueda = repo.getListById(lista.id);
    assert.equal(busqueda, null);
  });
});

