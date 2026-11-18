const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const BibleRepository = require('../../src/database/repositories/bible.repository.js');

test('BibleRepository - Consultas, Referencias y FTS', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_bible_repo_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new BibleRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe listar los 66 libros bíblicos', () => {
    const books = repo.getAllBooks();
    assert.equal(books.length, 66);
    assert.equal(books[0].name, 'Génesis');
    assert.equal(books[65].name, 'Apocalipsis');
  });

  await t.test('debe localizar un versículo exacto por referencia (Juan 3:16)', () => {
    const result = repo.searchReference('Juan 3:16');
    assert.equal(result.success, true);
    assert.equal(result.verses.length, 1);
    assert.equal(result.verses[0].verse, 16);
    assert.ok(result.verses[0].text.includes('Porque de tal manera amó Dios al mundo'));
  });

  await t.test('debe localizar un rango de versículos (Juan 3:16-18)', () => {
    const result = repo.searchReference('jn 3:16-18');
    assert.equal(result.success, true);
    assert.equal(result.verses.length, 3);
    assert.equal(result.verses[0].verse, 16);
    assert.equal(result.verses[1].verse, 17);
    assert.equal(result.verses[2].verse, 18);
  });

  await t.test('debe realizar búsqueda por texto completo con FTS5', () => {
    const results = repo.searchByText('pastor');
    assert.ok(results.length >= 1);
    const foundSalmo23 = results.some(r => r.book_name === 'Salmos' && r.chapter === 23 && r.verse === 1);
    assert.ok(foundSalmo23, 'Debe encontrar Salmos 23:1 con la palabra pastor');
  });
});
