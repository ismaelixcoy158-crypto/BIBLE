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
      endMessage: '¡Bienvenidos a la Casa de Dios!',
      background: null
    };
    this.targetEndTime = null;
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

  start(seconds = 300, endMessage = null, background = null) {
    this.stopInterval();

    this.state.totalSeconds = seconds;
    this.state.remainingSeconds = seconds;
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.isFinished = false;
    this.state.formattedTime = this.formatTime(seconds);
    if (endMessage) this.state.endMessage = endMessage;
    if (background) this.state.background = background;

    this.targetEndTime = Date.now() + seconds * 1000;
    this.emitSync();

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

  emitSync() {
    // Proyectar el reloj a la pantalla congregacional
    projectionService.project({
      module: 'countdown',
      title: 'Cuenta Regresiva',
      text: this.state.isFinished ? this.state.endMessage : this.state.formattedTime,
      reference: this.state.isFinished ? '¡Comenzamos!' : 'Inicio de Culto',
      refPosition: 'bottom',
      background: this.state.background,
      countdown: { ...this.state }
    });
  }
}

module.exports = new CountdownService();

