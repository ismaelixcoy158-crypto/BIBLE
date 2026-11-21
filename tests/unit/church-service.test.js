const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const dbManager = require('../../src/database/database.js');
const churchService = require('../../src/main/services/church-service.js');
const projectionService = require('../../src/main/services/projection-service.js');

describe('ChurchService - Identidad Congregacional y Logotipo', () => {
  beforeEach(() => {
    churchService.reset();
  });

  afterEach(() => {
    churchService.reset();
  });

  test('debe retornar la identidad inicial por defecto', () => {
    const identity = churchService.getIdentity();
    assert.equal(identity.name, 'Mi Iglesia');
    assert.equal(identity.logoFilename, null);
    assert.equal(identity.logoSourceType, 'none');
    assert.equal(identity.logoUrl, null);
  });

  test('debe actualizar el nombre de la congregación con updateName', () => {
    const updated = churchService.updateName('Comunidad Cristiana Bethel');
    assert.equal(updated.name, 'Comunidad Cristiana Bethel');

    const fresh = churchService.getIdentity();
    assert.equal(fresh.name, 'Comunidad Cristiana Bethel');
  });

  test('debe rechazar nombres vacíos', () => {
    assert.throws(() => {
      churchService.updateName('   ');
    }, /no puede estar vacío/);
  });

  test('debe subir y registrar un logotipo desde Base64 con uploadLogoBase64', () => {
    // 1x1 transparent PNG en Base64
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const updated = churchService.uploadLogoBase64(sampleBase64, 'test_logo.png');

    assert.ok(updated.logoFilename);
    assert.ok(updated.logoFilename.startsWith('logo_'));
    assert.equal(updated.logoSourceType, 'local');
    assert.ok(updated.logoUrl.startsWith('bible-media://branding/logo_'));

    // Verificar que el archivo existe en el disco
    const filePath = path.join(churchService.brandingDir, updated.logoFilename);
    assert.ok(fs.existsSync(filePath));
  });

  test('debe eliminar solo el logotipo con deleteLogo', () => {
    churchService.updateName('Iglesia Monte de Sion');
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    churchService.uploadLogoBase64(sampleBase64, 'mount.png');

    const afterDelete = churchService.deleteLogo();
    assert.equal(afterDelete.name, 'Iglesia Monte de Sion');
    assert.equal(afterDelete.logoFilename, null);
    assert.equal(afterDelete.logoUrl, null);
  });

  test('debe restablecer la identidad a los valores de fábrica con reset', () => {
    churchService.updateName('Iglesia Temporal');
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    churchService.uploadLogoBase64(sampleBase64, 'temp.png');

    const resetIdentity = churchService.reset();
    assert.equal(resetIdentity.name, 'Mi Iglesia');
    assert.equal(resetIdentity.logoFilename, null);
    assert.equal(resetIdentity.logoUrl, null);
    assert.equal(resetIdentity.logoSourceType, 'none');
  });
});

