const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const SpotsRepository = require('../../src/database/repositories/spots.repository.js');
const spotsService = require('../../src/main/services/spots-service.js');

test('SpotsService - Manejo de YouTube y URLs Web', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_spots_svc_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new SpotsRepository(db);

  spotsService.repo = repo;
  spotsService.spotsDir = testDbDir;

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe extraer el ID de YouTube en diversos formatos de enlace', () => {
    const urls = [
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
      { url: 'https://youtu.be/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=45s&feature=shared', expected: 'dQw4w9WgXcQ' }
    ];

    for (const item of urls) {
      const id = spotsService.extractYoutubeId(item.url);
      assert.equal(id, item.expected, `Falló al extraer ID para ${item.url}`);
    }

    assert.equal(spotsService.extractYoutubeId('https://ejemplo.com/video.mp4'), null);
    assert.equal(spotsService.extractYoutubeId(''), null);
    assert.equal(spotsService.extractYoutubeId(null), null);
  });

  await t.test('debe formatear spot de YouTube con URL de incrustación y miniatura oficial', () => {
    const rawSpot = {
      id: 99,
      title: 'Alabanza Oficial YouTube',
      file_type: 'video',
      original_filename: 'https://youtu.be/7wtfhZwyrcc',
      stored_filename: 'https://youtu.be/7wtfhZwyrcc',
      mime_type: 'video/youtube',
      loop_enabled: 1
    };

    const formatted = spotsService.formatSpot(rawSpot);
    assert.equal(formatted.isYoutube, true);
    assert.equal(formatted.youtubeId, '7wtfhZwyrcc');
    assert.ok(formatted.mediaUrl.includes('youtube-nocookie.com/embed/7wtfhZwyrcc'));
    assert.ok(formatted.mediaUrl.includes('autoplay=1'));
    assert.ok(formatted.mediaUrl.includes('enablejsapi=1'));
    assert.equal(formatted.thumbnailUrl, 'https://img.youtube.com/vi/7wtfhZwyrcc/hqdefault.jpg');
  });

  await t.test('debe crear un spot de YouTube automáticamente como video sin descarga forzada', async () => {
    const created = await spotsService.createFromUrl({
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      title: 'Primer Video de YouTube',
      loopEnabled: true
    });

    assert.ok(created.id);
    assert.equal(created.file_type, 'video');
    assert.equal(created.isYoutube, true);
    assert.equal(created.youtubeId, 'jNQXAC9IVRw');
    assert.ok(created.mediaUrl.includes('jNQXAC9IVRw'));
  });

  await t.test('debe normalizar y crear spot de imagen desde Google Drive / URL directa', async () => {
    const created = await spotsService.createFromUrl({
      url: 'https://drive.google.com/file/d/1B7H0K-AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing',
      title: 'Flyer Conferencia Especial'
    });

    assert.ok(created.id);
    assert.equal(created.file_type, 'image');
    assert.ok(created.mediaUrl.includes('1B7H0K-AbCdEfGhIjKlMnOpQrStUvWxYz'));
  });
});
