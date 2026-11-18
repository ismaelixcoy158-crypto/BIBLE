const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const SpotsRepository = require('../../src/database/repositories/spots.repository.js');

test('SpotsRepository - Gestión de Spots Multimedia', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_spots_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new SpotsRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe listar los spots de muestra iniciales', () => {
    const list = repo.getAll();
    assert.ok(list.length >= 2);
    const video = list.find(s => s.file_type === 'video');
    const image = list.find(s => s.file_type === 'image');
    assert.ok(video, 'Debe haber un spot de video');
    assert.ok(image, 'Debe haber un spot de imagen');
  });

  await t.test('debe filtrar por tipo de archivo', () => {
    const videos = repo.getAll('video');
    assert.ok(videos.every(v => v.file_type === 'video'));

    const images = repo.getAll('image');
    assert.ok(images.every(i => i.file_type === 'image'));
  });

  await t.test('debe crear, actualizar y eliminar un nuevo spot', () => {
    const nuevo = repo.create({
      title: 'Anuncio: Escuela Dominical',
      file_type: 'image',
      original_filename: 'escuela.jpg',
      stored_filename: 'spot_123_escuela.jpg',
      mime_type: 'image/jpeg',
      file_size: 512000
    });

    assert.ok(nuevo.id);
    assert.equal(nuevo.title, 'Anuncio: Escuela Dominical');

    const actualizado = repo.update(nuevo.id, { title: 'Escuela Bíblica Infantil', loop_enabled: false });
    assert.equal(actualizado.title, 'Escuela Bíblica Infantil');
    assert.equal(actualizado.loop_enabled, 0);

    repo.delete(nuevo.id);
    const busqueda = repo.getById(nuevo.id);
    assert.equal(busqueda, undefined);
  });
});
