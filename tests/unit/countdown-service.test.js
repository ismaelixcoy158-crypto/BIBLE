const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const countdownService = require('../../src/main/services/countdown-service.js');
const projectionService = require('../../src/main/services/projection-service.js');

describe('CountdownService - Temporizador de Precisión y Proyección', () => {
  beforeEach(() => {
    countdownService.stopInterval();
    countdownService.state.subtitle = 'El culto comenzará en breve';
    countdownService.state.endMessage = '¡Bienvenidos a la Casa de Dios! El culto ha comenzado';
    countdownService.reset();
  });

  afterEach(() => {
    countdownService.stopInterval();
  });

  test('debe configurar tiempo personalizado con setTime', () => {
    const state = countdownService.setTime(450, '¡Dios les bendiga!', { id: 'ocean' }, 'Comenzamos en breve');
    assert.equal(state.totalSeconds, 450);
    assert.equal(state.remainingSeconds, 450);
    assert.equal(state.formattedTime, '00:07:30');
    assert.equal(state.endMessage, '¡Dios les bendiga!');
    assert.equal(state.subtitle, 'Comenzamos en breve');
    assert.equal(state.isRunning, false);
    assert.equal(state.isFinished, false);
  });

  test('debe sumar y restar tiempo con addSeconds', () => {
    countdownService.setTime(300);
    assert.equal(countdownService.getState().formattedTime, '00:05:00');

    countdownService.addSeconds(60);
    assert.equal(countdownService.getState().formattedTime, '00:06:00');
    assert.equal(countdownService.getState().remainingSeconds, 360);

    countdownService.addSeconds(-120);
    assert.equal(countdownService.getState().formattedTime, '00:04:00');
    assert.equal(countdownService.getState().remainingSeconds, 240);
  });

  test('debe pausar, reanudar y reiniciar el temporizador', () => {
    countdownService.start(100);
    assert.equal(countdownService.getState().isRunning, true);
    assert.equal(countdownService.getState().isPaused, false);

    countdownService.pause();
    assert.equal(countdownService.getState().isRunning, false);
    assert.equal(countdownService.getState().isPaused, true);

    countdownService.resume();
    assert.equal(countdownService.getState().isRunning, true);
    assert.equal(countdownService.getState().isPaused, false);

    countdownService.reset();
    assert.equal(countdownService.getState().isRunning, false);
    assert.equal(countdownService.getState().isPaused, false);
    assert.equal(countdownService.getState().remainingSeconds, 100);
  });

  test('debe proyectar el temporizador en projectionService con background y tipografía', () => {
    const bgCustom = { id: 'test_bg', type: 'color', value: '#123456' };
    countdownService.setTime(180, '¡Bienvenidos!');
    countdownService.project({
      background: bgCustom,
      textColor: 'black',
      fontSize: 120,
      fontFamily: 'bold'
    });

    const projState = projectionService.getState();
    assert.equal(projState.activeContent?.module, 'countdown');
    assert.equal(projState.activeContent?.text, '00:03:00');
    assert.equal(projState.activeContent?.reference, 'El culto comenzará en breve');
    assert.deepEqual(projState.currentBackground, bgCustom);
    assert.equal(projState.currentTextColor, 'black');
    assert.equal(projState.currentFontSize, 120);
    assert.equal(projState.currentFontFamily, 'bold');
  });

  test('debe preservar y sincronizar el tamaño de letra personalizado sin revertir a 100%', () => {
    countdownService.setTime(300);
    countdownService.project();

    // El operador aumenta el tamaño de letra al 160% desde la barra inferior
    projectionService.updateFontSize(160);
    assert.equal(projectionService.getState().currentFontSize, 160);
    assert.equal(projectionService.getState().activeContent?.fontSize, 160);

    // Al emitir un tick de sincronización, NO debe restablecerse al 100%
    countdownService.emitSync();
    const projState = projectionService.getState();
    assert.equal(projState.currentFontSize, 160);
    assert.equal(projState.activeContent?.fontSize, 160);
  });

  test('debe emitir mensaje de bienvenida al finalizar', () => {
    countdownService.setTime(2, '¡Bienvenidos a la congregación!');
    countdownService.finish();

    const state = countdownService.getState();
    assert.equal(state.isFinished, true);
    assert.equal(state.remainingSeconds, 0);
    assert.equal(state.formattedTime, '00:00:00');

    const projState = projectionService.getState();
    assert.equal(projState.activeContent?.module, 'countdown');
    assert.equal(projState.activeContent?.text, '¡Bienvenidos a la congregación!');
    assert.equal(projState.activeContent?.reference, '¡Bienvenidos!');
  });
});
