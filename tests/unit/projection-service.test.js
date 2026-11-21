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

  await t.test('debe permitir congelar y descongelar con toggleFreeze', () => {
    service.toggleFreeze(true);
    assert.equal(service.getState().isFrozen, true);

    service.toggleFreeze(false);
    assert.equal(service.getState().isFrozen, false);
  });

  await t.test('debe preservar el fondo global activo al cambiar de módulo sin fondo explícito', () => {
    // 1. En Biblia se proyecta con fondo 'Océano Profundo'
    service.project({
      module: 'bible',
      title: 'Salmos 23:1',
      text: 'Jehová es mi pastor...',
      background: { id: 'preset_ocean', name: 'Océano Profundo', value: 'linear-gradient(...)' }
    });
    assert.equal(service.getState().currentBackground.name, 'Océano Profundo');
    assert.equal(service.getState().activeContent.background.name, 'Océano Profundo');

    // 2. Al cambiar a Coritos y proyectar una diapositiva sin fondo explícito, debe conservar 'Océano Profundo'
    const chorusesState = service.project({
      module: 'choruses',
      title: 'Alabaré a mi Señor',
      text: 'Alabaré, alabaré, alabaré a mi Señor'
      // background omitido intencionalmente
    });
    assert.ok(chorusesState.activeContent.background);
    assert.equal(chorusesState.activeContent.background.name, 'Océano Profundo');
    assert.equal(chorusesState.currentBackground.name, 'Océano Profundo');

    // 3. Al cambiar a Predicación, también preserva el fondo activo
    const preachState = service.project({
      module: 'preaching',
      title: 'Sermón de la Gracia',
      text: 'Punto 1: La justificación'
    });
    assert.ok(preachState.activeContent.background);
    assert.equal(preachState.activeContent.background.name, 'Océano Profundo');
  });

  await t.test('debe actualizar el fondo global y notificar en tiempo real con updateBackground', () => {
    service.updateBackground({ id: 'preset_obsidian', name: 'Obsidiana Noche', value: '#0f172a' });
    const state = service.getState();
    assert.equal(state.currentBackground.name, 'Obsidiana Noche');
    assert.equal(state.activeContent.background.name, 'Obsidiana Noche');
    assert.equal(mockPublicSent.data.currentBackground.name, 'Obsidiana Noche');
  });

  await t.test('debe actualizar el color de letra global con updateTextColor', () => {
    service.updateTextColor('black');
    const state = service.getState();
    assert.equal(state.currentTextColor, 'black');
    assert.equal(state.activeContent.textColor, 'black');
    assert.equal(mockPublicSent.data.currentTextColor, 'black');
  });

  await t.test('debe actualizar el tamaño de letra global con updateFontSize', () => {
    service.updateFontSize(130);
    const state = service.getState();
    assert.equal(state.currentFontSize, 130);
    assert.equal(state.activeContent.fontSize, 130);
    assert.equal(mockPublicSent.data.currentFontSize, 130);

    // Clampeo inferior y superior
    service.updateFontSize(40);
    assert.equal(service.getState().currentFontSize, 60);

    service.updateFontSize(300);
    assert.equal(service.getState().currentFontSize, 220);
  });

  await t.test('debe actualizar la tipografía global con updateFontFamily', () => {
    service.updateFontFamily('serif');
    const state = service.getState();
    assert.equal(state.currentFontFamily, 'serif');
    assert.equal(state.activeContent.fontFamily, 'serif');
    assert.equal(mockPublicSent.data.currentFontFamily, 'serif');
  });

  await t.test('debe preservar tamaño de letra y tipografía en proyecciones subsiguientes', () => {
    service.updateFontSize(140);
    service.updateFontFamily('serif');

    const newState = service.project({
      module: 'choruses',
      title: 'Grande es Tu Fidelidad',
      text: 'Oh Dios eterno, tu misericordia...'
    });
    assert.equal(newState.currentFontSize, 140);
    assert.equal(newState.currentFontFamily, 'serif');
    assert.equal(newState.activeContent.fontSize, 140);
    assert.equal(newState.activeContent.fontFamily, 'serif');
  });
});

