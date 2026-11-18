const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const ChorusesRepository = require('../../src/database/repositories/choruses.repository.js');

test('ChorusesRepository - CRUD, Búsqueda Espontánea y Repertorios', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_choruses_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new ChorusesRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe cargar las categorías predeterminadas', () => {
    const categories = repo.getAllCategories();
    assert.ok(categories.length >= 2);
    assert.equal(categories[0].name, 'Coritos Pentecostales');
    assert.equal(categories[1].name, 'Coros de Adoración');
  });

  await t.test('debe listar los coritos iniciales sembrados', () => {
    const list = repo.getAll();
    assert.ok(list.length >= 5);
    const alabare = list.find(c => c.title.includes('Alabaré'));
    assert.ok(alabare, 'Debe existir Alabaré a mi Señor');
  });

  await t.test('debe dividir automáticamente la letra en diapositivas lógicas', () => {
    const chorus = repo.getById(1); // Alabaré
    assert.ok(chorus.slides.length >= 2, 'Debe tener al menos 2 diapositivas');
    assert.ok(chorus.slides[0].includes('Alabaré'));
  });

  await t.test('debe encontrar coritos en el Modo Espontáneo por título o letra', () => {
    // Búsqueda por fragmento de letra
    const resLetra = repo.searchSpontaneous('redimidos');
    assert.ok(resLetra.length >= 1);
    assert.equal(resLetra[0].title, 'Alabaré a mi Señor');

    // Búsqueda por inicio de título
    const resTitulo = repo.searchSpontaneous('Como el ciervo');
    assert.ok(resTitulo.length >= 1);
    assert.equal(resTitulo[0].title, 'Como el ciervo brama');
  });

  await t.test('debe permitir crear, actualizar y eliminar un corito', () => {
    // Crear
    const nuevo = repo.create({
      title: 'Fuego, fuego la iglesia pide fuego',
      lyrics: 'Fuego, fuego la iglesia pide fuego\nFuego, fuego fuego celestial',
      category_id: 1
    });
    assert.ok(nuevo.id);
    assert.equal(nuevo.title, 'Fuego, fuego la iglesia pide fuego');

    // Actualizar
    const actualizado = repo.update(nuevo.id, { title: 'Fuego Celestial' });
    assert.equal(actualizado.title, 'Fuego Celestial');

    // Eliminar
    repo.delete(nuevo.id);
    const busqueda = repo.getById(nuevo.id);
    assert.equal(busqueda, null);
  });

  await t.test('debe gestionar listas de repertorio de culto', () => {
    const playlist = repo.createPlaylist('Culto de Jóvenes');
    assert.ok(playlist.id);

    // Agregar corito 1 y 2
    repo.addChorusToPlaylist(playlist.id, 1);
    const items = repo.addChorusToPlaylist(playlist.id, 2);
    assert.equal(items.length, 2);
    assert.equal(items[0].position, 1);
    assert.equal(items[1].position, 2);

    // Limpieza
    repo.deletePlaylist(playlist.id);
  });
});

