const dbManager = require('../../database/database.js');
const CountdownRepository = require('../../database/repositories/countdown.repository.js');
const projectionService = require('./projection-service.js');

/**
 * BIBLE — CountdownService
 * Motor de tiempo de alta precisión (sin desfase) para cuentas regresivas de culto.
 */
class CountdownService {
  constructor() {
    this.repo = null;
    this.timerInterval = null;
    this.state = {
      totalSeconds: 300,
      remainingSeconds: 300,
      isRunning: false,
      isPaused: false,
      isFinished: false,
      formattedTime: '00:05:00',
      endMessage: '¡Bienvenidos a la Casa de Dios! El culto ha comenzado',
      subtitle: 'El culto comenzará en breve',
      background: null,
      textColor: 'white',
      fontSize: 100,
      fontFamily: 'sans-serif'
    };
    this.targetEndTime = null;
    this.isProjected = false;
  }

  project(options = {}) {
    if (options.background) this.state.background = options.background;
    if (options.textColor) this.state.textColor = options.textColor;
    if (options.fontSize) this.state.fontSize = options.fontSize;
    if (options.fontFamily) this.state.fontFamily = options.fontFamily;
    this.isProjected = true;
    this.emitSync(true);
    return this.getState();
  }

  init() {
    if (!this.repo) {
      const db = dbManager.getInstance();
      this.repo = new CountdownRepository(db);
    }
  }

  getPresets() {
    this.init();
    return this.repo.getAllPresets();
  }

  getState() {
    return { ...this.state };
  }

  formatTime(totalSecs) {
    const s = Math.max(0, Math.floor(totalSecs));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  setTime(seconds = 300, endMessage = null, background = null, subtitle = null) {
    this.stopInterval();
    const safeSecs = Math.max(0, Math.floor(seconds));
    this.state.totalSeconds = safeSecs;
    this.state.remainingSeconds = safeSecs;
    this.state.formattedTime = this.formatTime(safeSecs);
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.isFinished = false;
    if (endMessage !== null && endMessage !== undefined) this.state.endMessage = endMessage;
    if (background !== null && background !== undefined) this.state.background = background;
    if (subtitle !== null && subtitle !== undefined) this.state.subtitle = subtitle;

    this.emitSync();
    return this.getState();
  }

  addSeconds(delta = 60) {
    if (this.state.isFinished) {
      return this.setTime(Math.max(0, delta));
    }
    const newRemaining = Math.max(0, this.state.remainingSeconds + delta);
    this.state.remainingSeconds = newRemaining;
    if (newRemaining > this.state.totalSeconds) {
      this.state.totalSeconds = newRemaining;
    }
    this.state.formattedTime = this.formatTime(newRemaining);
    if (this.state.isRunning) {
      this.targetEndTime = Date.now() + newRemaining * 1000;
    }
    this.emitSync();
    return this.getState();
  }

  start(seconds = null, endMessage = null, background = null, subtitle = null) {
    this.stopInterval();

    if (seconds !== null && seconds !== undefined) {
      const safeSecs = Math.max(0, Math.floor(seconds));
      this.state.totalSeconds = safeSecs;
      this.state.remainingSeconds = safeSecs;
    }

    if (this.state.remainingSeconds <= 0) {
      this.state.remainingSeconds = this.state.totalSeconds || 300;
    }

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.isFinished = false;
    this.state.formattedTime = this.formatTime(this.state.remainingSeconds);
    if (endMessage !== null && endMessage !== undefined) this.state.endMessage = endMessage;
    if (background !== null && background !== undefined) this.state.background = background;
    if (subtitle !== null && subtitle !== undefined) this.state.subtitle = subtitle;

    this.targetEndTime = Date.now() + this.state.remainingSeconds * 1000;
    this.isProjected = true;
    this.emitSync(true);

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diffSecs = (this.targetEndTime - now) / 1000;

      if (diffSecs <= 0) {
        this.finish();
      } else {
        this.state.remainingSeconds = Math.ceil(diffSecs);
        this.state.formattedTime = this.formatTime(this.state.remainingSeconds);
        this.emitSync();
      }
    }, 500);

    return this.getState();
  }

  pause() {
    if (!this.state.isRunning || this.state.isPaused) return this.getState();

    this.stopInterval();
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.emitSync();
    return this.getState();
  }

  resume() {
    if (!this.state.isPaused) return this.getState();

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.targetEndTime = Date.now() + this.state.remainingSeconds * 1000;

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diffSecs = (this.targetEndTime - now) / 1000;

      if (diffSecs <= 0) {
        this.finish();
      } else {
        this.state.remainingSeconds = Math.ceil(diffSecs);
        this.state.formattedTime = this.formatTime(this.state.remainingSeconds);
        this.emitSync();
      }
    }, 500);

    this.emitSync();
    return this.getState();
  }

  reset() {
    this.stopInterval();
    this.state.remainingSeconds = this.state.totalSeconds;
    this.state.formattedTime = this.formatTime(this.state.totalSeconds);
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.isFinished = false;

    this.emitSync();
    return this.getState();
  }

  finish() {
    this.stopInterval();
    this.state.remainingSeconds = 0;
    this.state.formattedTime = '00:00:00';
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.isFinished = true;

    this.emitSync();
  }

  stopInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  emitSync(force = false) {
    const isCountdownActive = force || this.isProjected || projectionService.state.activeContent?.module === 'countdown';
    if (!isCountdownActive) {
      return;
    }
    this.isProjected = true;
    const isFinished = Boolean(this.state.isFinished);
    projectionService.project({
      module: 'countdown',
      title: isFinished ? (this.state.subtitle || 'Culto Iniciado') : (this.state.subtitle || 'Cuenta Regresiva'),
      text: isFinished ? this.state.endMessage : this.state.formattedTime,
      reference: isFinished ? '¡Bienvenidos!' : (this.state.subtitle || 'Inicio de Culto'),
      refPosition: 'top',
      background: this.state.background || projectionService.state.currentBackground,
      textColor: this.state.textColor || projectionService.state.currentTextColor,
      fontSize: this.state.fontSize || projectionService.state.currentFontSize,
      fontFamily: this.state.fontFamily || projectionService.state.currentFontFamily,
      countdown: { ...this.state }
    });
  }
}

module.exports = new CountdownService();

