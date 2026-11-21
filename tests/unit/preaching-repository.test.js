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

  await t.test('debe listar la presentación de muestra inicial enriquecida', () => {
    const list = repo.getAll();
    assert.ok(list.length >= 1);
    assert.equal(list[0].title, 'El Poder de la Oración y la Fe');
    assert.equal(list[0].slide_count, 4);
    assert.equal(list[0].render_mode, 'original');
  });

  await t.test('debe obtener presentación con sus diapositivas ordenadas y campos de fidelidad', () => {
    const preaching = repo.getById(1);
    assert.ok(preaching);
    assert.equal(preaching.slides.length, 4);
    assert.equal(preaching.slides[0].slide_index, 0);
    assert.ok(preaching.slides[0].slide_title);
    assert.ok(preaching.slides[0].slide_image_path);
  });

  await t.test('debe crear una nueva presentación con diapositivas en transacción', () => {
    const nueva = repo.create({
      title: 'Serie: Los Frutos del Espíritu',
      preacher: 'Pastor Pablo',
      bible_passage: 'Gálatas 5:22',
      original_filename: 'frutos.pdf',
      file_type: 'pdf',
      render_mode: 'original',
      slides: [
        { imagePath: 'fruto_1.jpg', title: '1. Amor', text: 'El amor de Dios en nosotros', notes: 'Amor' },
        { imagePath: 'fruto_2.jpg', title: '2. Gozo', text: 'El gozo del Señor es nuestra fuerza', notes: 'Gozo' },
        { imagePath: 'fruto_3.jpg', title: '3. Paz', text: 'La paz que sobrepasa todo entendimiento', notes: 'Paz' }
      ]
    });

    assert.ok(nueva.id);
    assert.equal(nueva.title, 'Serie: Los Frutos del Espíritu');
    assert.equal(nueva.preacher, 'Pastor Pablo');
    assert.equal(nueva.bible_passage, 'Gálatas 5:22');
    assert.equal(nueva.slide_count, 3);
    assert.equal(nueva.slides.length, 3);
  });

  await t.test('debe actualizar el modo de renderizado (original vs church_bg)', () => {
    repo.updateRenderMode(1, 'church_bg');
    let preaching = repo.getById(1);
    assert.equal(preaching.render_mode, 'church_bg');

    repo.updateRenderMode(1, 'original');
    preaching = repo.getById(1);
    assert.equal(preaching.render_mode, 'original');
  });

  await t.test('debe actualizar y preservar la diapositiva activa para reanudación', () => {
    // Simulamos que el predicador llegó a la diapositiva 2
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
