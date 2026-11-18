const test = require('node:test');
const assert = require('node:assert/strict');
const { ProjectionService } = require('../../src/main/services/projection-service.js');

test('ProjectionService - Máquina de Estados de Emisión', async (t) => {
  let mockPublicSent = null;
  let mockOperatorSent = null;

  const mockPublicWindow = {
    isDestroyed: () => false,
    webContents: {
      send: (channel, data) => { mockPublicSent = { channel, data }; }
    }
  };

  const mockOperatorWindow = {
    isDestroyed: () => false,
    webContents: {
      send: (channel, data) => { mockOperatorSent = { channel, data }; }
    }
  };

  const service = new ProjectionService();
  service.setWindows({ operatorWindow: mockOperatorWindow, publicWindow: mockPublicWindow });

  await t.test('debe inicializarse en estado inactivo limpio', () => {
    const state = service.getState();
    assert.equal(state.isBlackout, false);
    assert.equal(state.isLogo, false);
    assert.equal(state.isClearText, false);
    assert.equal(state.isFrozen, false);
    assert.equal(state.activeContent, null);
  });

  await t.test('debe proyectar contenido nuevo y emitir a ambas ventanas', () => {
    const payload = {
      module: 'bible',
      title: 'Juan 3:16',
      text: 'Porque de tal manera amó Dios al mundo...',
      reference: 'Juan 3:16 (RV1909)',
      background: 'bg-default-1.jpg'
    };

    const newState = service.project(payload);
    assert.equal(newState.activeContent.title, 'Juan 3:16');
    assert.equal(newState.isBlackout, false);

    assert.ok(mockPublicSent);
    assert.equal(mockPublicSent.channel, 'projection:update');
    assert.equal(mockPublicSent.data.activeContent.title, 'Juan 3:16');

    assert.ok(mockOperatorSent);
    assert.equal(mockOperatorSent.channel, 'projection:preview-update');
    assert.equal(mockOperatorSent.data.activeContent.title, 'Juan 3:16');
  });

  await t.test('debe alternar el modo NEGRO (Blackout)', () => {
    service.toggleBlackout(true);
    assert.equal(service.getState().isBlackout, true);
    assert.equal(mockPublicSent.data.isBlackout, true);

    service.toggleBlackout(false);
    assert.equal(service.getState().isBlackout, false);
  });

  await t.test('debe alternar el modo LOGO', () => {
    service.toggleLogo(true);
    assert.equal(service.getState().isLogo, true);

    service.toggleLogo(false);
    assert.equal(service.getState().isLogo, false);
  });

  await t.test('debe respetar el estado de CONGELADO (Freeze)', () => {
    service.toggleFreeze(true);
    assert.equal(service.getState().isFrozen, true);

    // Intentar proyectar algo nuevo mientras está congelado
    const nuevoPayload = {
      module: 'choruses',
      title: 'Alabaré a mi Señor',
      text: 'Alabaré, alabaré...'
    };
    service.project(nuevoPayload);

    // El estado público emitido NO debe haber cambiado el contenido activo
    assert.equal(service.getState().activeContent.title, 'Juan 3:16');

    // Descongelar
    service.toggleFreeze(false);
    service.project(nuevoPayload);
    assert.equal(service.getState().activeContent.title, 'Alabaré a mi Señor');
  });
});
