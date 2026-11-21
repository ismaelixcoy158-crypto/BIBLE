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
    assert.ok(resLetra.some(c => c.title === 'Alabaré a mi Señor'), 'Debe encontrar Alabaré a mi Señor');

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
    const playlist = repo.createPlaylist('Culto de Jóvenes', '2026-11-24');
    assert.ok(playlist.id);
    assert.equal(playlist.service_date, '2026-11-24');

    // Agregar corito 1 y 2
    repo.addChorusToPlaylist(playlist.id, 1);
    const items = repo.addChorusToPlaylist(playlist.id, 2);
    assert.equal(items.length, 2);
    assert.equal(items[0].position, 1);
    assert.equal(items[1].position, 2);

    // No debe duplicar si ya existe
    const itemsRep = repo.addChorusToPlaylist(playlist.id, 1);
    assert.equal(itemsRep.length, 2);

    // Quitar un corito y reordenar posiciones
    const itemsAfterRemove = repo.removeChorusFromPlaylist(playlist.id, 1);
    assert.equal(itemsAfterRemove.length, 1);
    assert.equal(itemsAfterRemove[0].position, 1);
    assert.equal(itemsAfterRemove[0].id, 2);

    // Limpieza
    repo.deletePlaylist(playlist.id);
    const playlists = repo.getPlaylists();
    assert.ok(!playlists.some(p => p.id === playlist.id));
  });

  await t.test('debe soportar búsqueda en línea de alabanzas tanto por título como por frase de la letra (searchOnline)', async () => {
    // Por frase de la letra:
    const byLyric = await repo.searchOnline('Dios no rechaza oracion');
    assert.ok(Array.isArray(byLyric));
    if (byLyric.length > 0) {
      assert.ok(byLyric[0].title);
      assert.ok(byLyric[0].lyrics);
      assert.ok(Array.isArray(byLyric[0].slides));
      assert.equal(byLyric[0].isOnline, true);
    }

    // Por título:
    const byTitle = await repo.searchOnline('Way Maker');
    assert.ok(Array.isArray(byTitle));
    if (byTitle.length > 0) {
      assert.ok(byTitle[0].title);
      assert.ok(byTitle[0].lyrics);
    }
  });
});

