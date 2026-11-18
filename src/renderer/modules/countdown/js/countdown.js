/**
 * BIBLE — CountdownController
 * Controlador para la cuenta regresiva, preajustes de tiempo y controles de inicio/pausa.
 */
export class CountdownController {
  constructor() {
    this.presets = [];
    this.selectedSeconds = 300; // 5 minutos por defecto
    this.pollInterval = null;

    // Elementos DOM
    this.clockDisplay = document.getElementById('digitalClockDisplay');
    this.presetsContainer = document.getElementById('presetsRow');
    this.inputEndMessage = document.getElementById('inputEndMessage');

    this.btnStart = document.getElementById('btnStartCountdown');
    this.btnPause = document.getElementById('btnPauseCountdown');
    this.btnResume = document.getElementById('btnResumeCountdown');
    this.btnReset = document.getElementById('btnResetCountdown');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadPresets();
    await this.syncState();

    // Sincronizar estado cada 500ms
    this.pollInterval = setInterval(() => this.syncState(), 500);
  }

  async loadPresets() {
    try {
      this.presets = await window.bibleAPI.countdown.getPresets();
      this.renderPresets();
    } catch (err) {
      console.error('[CountdownController] Error al cargar preajustes:', err);
    }
  }

  renderPresets() {
    this.presetsContainer.innerHTML = '';
    this.presets.forEach(preset => {
      const btn = document.createElement('button');
      btn.className = `preset-chip-btn ${preset.duration_seconds === this.selectedSeconds ? 'active' : ''}`;
      btn.textContent = preset.name;
      btn.dataset.seconds = preset.duration_seconds;

      btn.addEventListener('click', async () => {
        this.selectedSeconds = preset.duration_seconds;
        this.renderPresets();
        if (preset.end_message) {
          this.inputEndMessage.value = preset.end_message;
        }
        await window.bibleAPI.countdown.reset();
        await window.bibleAPI.countdown.start({
          seconds: this.selectedSeconds,
          endMessage: this.inputEndMessage.value.trim()
        });
        await window.bibleAPI.countdown.pause();
      });

      this.presetsContainer.appendChild(btn);
    });
  }

  async syncState() {
    try {
      const state = await window.bibleAPI.countdown.getState();
      if (!state) return;

      if (state.isFinished) {
        this.clockDisplay.classList.add('finished');
        this.clockDisplay.textContent = state.endMessage || '¡Bienvenidos!';
        this.btnStart.style.display = 'none';
        this.btnPause.style.display = 'none';
        this.btnResume.style.display = 'none';
        this.btnReset.style.display = 'inline-flex';
      } else {
        this.clockDisplay.classList.remove('finished');
        this.clockDisplay.textContent = state.formattedTime || '00:05:00';

        if (state.isRunning) {
          this.btnStart.style.display = 'none';
          this.btnPause.style.display = 'inline-flex';
          this.btnResume.style.display = 'none';
        } else if (state.isPaused) {
          this.btnStart.style.display = 'none';
          this.btnPause.style.display = 'none';
          this.btnResume.style.display = 'inline-flex';
        } else {
          this.btnStart.style.display = 'inline-flex';
          this.btnPause.style.display = 'none';
          this.btnResume.style.display = 'none';
        }
      }
    } catch (err) {
      console.error('[CountdownController] Error al sincronizar estado:', err);
    }
  }

  bindEvents() {
    this.btnStart.addEventListener('click', async () => {
      const endMsg = this.inputEndMessage.value.trim();
      await window.bibleAPI.countdown.start({
        seconds: this.selectedSeconds,
        endMessage: endMsg
      });
      await this.syncState();
    });

    this.btnPause.addEventListener('click', async () => {
      await window.bibleAPI.countdown.pause();
      await this.syncState();
    });

    this.btnResume.addEventListener('click', async () => {
      await window.bibleAPI.countdown.resume();
      await this.syncState();
    });

    this.btnReset.addEventListener('click', async () => {
      await window.bibleAPI.countdown.reset();
      await this.syncState();
    });
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}
