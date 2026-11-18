const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../src/database/database.js');
const ChurchRepository = require('../../src/database/repositories/church.repository.js');

test('ChurchRepository - Gestión de Identidad de la Iglesia', async (t) => {
  const testDbDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  const testDbPath = path.join(testDbDir, `test_church_${Date.now()}.db`);
  const manager = new DatabaseManager(testDbPath);
  const db = manager.init();
  const repo = new ChurchRepository(db);

  t.after(() => {
    manager.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(`${testDbPath}-wal`)) fs.unlinkSync(`${testDbPath}-wal`);
    if (fs.existsSync(`${testDbPath}-shm`)) fs.unlinkSync(`${testDbPath}-shm`);
  });

  await t.test('debe retornar la identidad por defecto inicial', () => {
    const identity = repo.get();
    assert.equal(identity.id, 1);
    assert.equal(identity.name, 'Mi Iglesia');
    assert.equal(identity.logo_filename, null);
    assert.equal(identity.logo_source_type, 'none');
  });

  await t.test('debe actualizar el nombre de la congregación correctamente', () => {
    const updated = repo.updateName('Iglesia Pentecostal de la Fe');
    assert.equal(updated.name, 'Iglesia Pentecostal de la Fe');

    // Validación de nombres vacíos
    assert.throws(() => repo.updateName('   '), /no puede estar vacío/);

    // Validación de longitud excesiva (> 120 caracteres)
    const longName = 'A'.repeat(125);
    assert.throws(() => repo.updateName(longName), /excede los 120 caracteres/);
  });

  await t.test('debe registrar un logotipo y su origen', () => {
    const withLogo = repo.updateLogo('logo_12345.png', 'local');
    assert.equal(withLogo.logo_filename, 'logo_12345.png');
    assert.equal(withLogo.logo_source_type, 'local');

    // Validación de tipo de origen no permitido
    assert.throws(() => repo.updateLogo('logo.png', 'invalid'), /Tipo de origen de logo inválido/);
  });

  await t.test('debe eliminar solo el logotipo sin alterar el nombre', () => {
    const afterDelete = repo.deleteLogo();
    assert.equal(afterDelete.name, 'Iglesia Pentecostal de la Fe');
    assert.equal(afterDelete.logo_filename, null);
    assert.equal(afterDelete.logo_source_type, 'none');
  });

  await t.test('debe restablecer toda la identidad a los valores de fábrica', () => {
    repo.updateName('Otra Congregación');
    repo.updateLogo('logo_otra.png', 'url');

    const resetIdentity = repo.reset();
    assert.equal(resetIdentity.name, 'Mi Iglesia');
    assert.equal(resetIdentity.logo_filename, null);
    assert.equal(resetIdentity.logo_source_type, 'none');
  });
});

