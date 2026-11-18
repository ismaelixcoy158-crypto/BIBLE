const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const PreachingRepository = require('../../src/database/repositories/preaching.repository.js');

test('PreachingRepository - Presentaciones y Preservación de Diapositiva', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_preaching_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new PreachingRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe listar la presentación de muestra inicial', () => {
    const list = repo.getAll();
    assert.ok(list.length >= 1);
    assert.equal(list[0].title, 'El Poder de la Oración y la Fe');
    assert.equal(list[0].slide_count, 3);
  });

  await t.test('debe obtener presentación con sus diapositivas ordenadas', () => {
    const preaching = repo.getById(1);
    assert.ok(preaching);
    assert.equal(preaching.slides.length, 3);
    assert.equal(preaching.slides[0].slide_index, 0);
    assert.equal(preaching.slides[1].slide_index, 1);
    assert.equal(preaching.slides[2].slide_index, 2);
  });

  await t.test('debe crear una nueva presentación con diapositivas en transacción', () => {
    const nueva = repo.create({
      title: 'Serie: Los Frutos del Espíritu',
      original_filename: 'frutos.pdf',
      file_type: 'pdf',
      slides: [
        { imagePath: 'fruto_1.jpg', notes: 'Amor' },
        { imagePath: 'fruto_2.jpg', notes: 'Gozo' },
        { imagePath: 'fruto_3.jpg', notes: 'Paz' }
      ]
    });

    assert.ok(nueva.id);
    assert.equal(nueva.title, 'Serie: Los Frutos del Espíritu');
    assert.equal(nueva.slide_count, 3);
    assert.equal(nueva.slides.length, 3);
  });

  await t.test('debe actualizar y preservar la diapositiva activa para reanudación', () => {
    // Simulamos que el predicador llegó a la diapositiva 2 (tercera diapositiva)
    repo.updateLastSlideIndex(1, 2);
    const updated = repo.getById(1);
    assert.equal(updated.last_slide_index, 2, 'Debe haber memorizado la diapositiva 2');
  });

  await t.test('debe eliminar presentación y sus diapositivas en cascada', () => {
    const nueva = repo.create({
      title: 'Temporal para borrar',
      original_filename: 'temp.pdf',
      file_type: 'pdf',
      slides: [{ imagePath: 'temp_1.jpg' }]
    });

    repo.delete(nueva.id);
    const search = repo.getById(nueva.id);
    assert.equal(search, null);
  });
});
