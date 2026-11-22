/**
 * BIBLE — CountdownController
 * Arquitectura Orientada a Objetos para el Módulo de Cuenta Regresiva de Entrada.
 *
 * Características:
 * 1. Tiempo Personalizado (Horas, Minutos, Segundos) y Ajustes Rápidos (+1m, +5m, -1m).
 * 2. Preajustes Rápidos Dinámicos cargados desde base de datos.
 * 3. Proyección en Pantalla Pública directa o al iniciar el temporizador.
 * 4. Integración estandarizada con ProjectionToolbarController:
 *    - Selector de Fondo de Proyección (Modal con video en bucle, fotos locales, URLs HTTP, degradados).
 *    - Selector de Color de Letra (Blanco / Negro).
 *    - Selector de Tipografía (Moderna Sans, Clásica Bíblica, Impacto Bold, Condensada).
 *    - Control de Tamaño de Letra (A- / 100% / A+).
 * 5. Tally EN PANTALLA PÚBLICA en tiempo real.
 * 6. Campanilla triunfal opcional al llegar a 00:00:00 con Web Audio API.
 */
import { ProjectionToolbarController } from '../../../shared/js/projection-toolbar.js';

export class CountdownController {
  constructor() {
    this.presets = [];
    this.selectedSeconds = 300; // 5 minutos por defecto
    this.pollInterval = null;
    this.wasFinished = false;
    this.audioCtx = null;

    this.cacheElements();
    this.init();
  }

  cacheElements() {
    // Header & Tally
    this.btnProjectCountdown = document.getElementById('btnProjectCountdown');
    this.txtBtnProjectCountdown = document.getElementById('txtBtnProjectCountdown');
    this.countdownTallyChip = document.getElementById('countdownTallyChip');
    this.txtCountdownTally = document.getElementById('txtCountdownTally');

    // Reloj Digital
    this.clockDisplay = document.getElementById('digitalClockDisplay');

    // Configuración de Tiempo Personalizado
    this.inputCustomHours = document.getElementById('inputCustomHours');
    this.inputCustomMinutes = document.getElementById('inputCustomMinutes');
    this.inputCustomSeconds = document.getElementById('inputCustomSeconds');
    this.btnSetCustomTime = document.getElementById('btnSetCustomTime');

    // Ajustes Rápidos
    this.btnQuickSub1 = document.getElementById('btnQuickSub1');
    this.btnQuickAdd1 = document.getElementById('btnQuickAdd1');
    this.btnQuickAdd5 = document.getElementById('btnQuickAdd5');

    // Preajustes
    this.presetsContainer = document.getElementById('presetsRow');

    // Controles Maestros
    this.btnStart = document.getElementById('btnStartCountdown');
    this.btnPause = document.getElementById('btnPauseCountdown');
    this.btnResume = document.getElementById('btnResumeCountdown');
    this.btnReset = document.getElementById('btnResetCountdown');

    // Ajustes de Texto
    this.inputSubtitle = document.getElementById('inputSubtitle');
    this.inputEndMessage = document.getElementById('inputEndMessage');
    this.chkEndChime = document.getElementById('chkEndChime');

    // Barra Inferior
    this.countdownLiveStatus = document.getElementById('countdownLiveStatus');
    this.bottomBarContainer = document.querySelector('.countdown-bottom-bar');
  }

  async init() {
    this.initToolbar();
    this.bindEvents();
    await this.loadPresets();
    await this.syncState();

    // Sincronizar estado cada 500ms
    this.pollInterval = setInterval(() => this.syncState(), 500);
  }

  initToolbar() {
    if (!this.bottomBarContainer) return;

    this.toolbar = new ProjectionToolbarController({
      container: this.bottomBarContainer,
      module: 'countdown',
      onBackgroundChange: async (bg) => {
        const state = await window.bibleAPI.countdown.getState();
        const projState = await window.bibleAPI.projection.getState();
        if (projState.activeContent?.module === 'countdown') {
          await window.bibleAPI.countdown.project({ background: bg });
        }
      },
      onTextColorChange: async (color) => {
        const state = await window.bibleAPI.countdown.getState();
        const projState = await window.bibleAPI.projection.getState();
        if (projState.activeContent?.module === 'countdown') {
          await window.bibleAPI.countdown.project({ textColor: color });
        }
      }
    });

    this.toolbar.init();
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
    if (!this.presetsContainer) return;
    this.presetsContainer.innerHTML = '';

    this.presets.forEach(preset => {
      const btn = document.createElement('button');
      const isActive = preset.duration_seconds === this.selectedSeconds;
      btn.className = `preset-chip-btn ${isActive ? 'active' : ''}`;
      btn.textContent = preset.name;
      btn.dataset.seconds = preset.duration_seconds;

      btn.addEventListener('click', async () => {
        this.selectedSeconds = preset.duration_seconds;
        this.updateCustomInputsFromSeconds(this.selectedSeconds);
        this.renderPresets();

        if (preset.end_message && this.inputEndMessage) {
          this.inputEndMessage.value = preset.end_message;
        }

        await window.bibleAPI.countdown.setTime({
          seconds: this.selectedSeconds,
          endMessage: this.inputEndMessage?.value.trim(),
          subtitle: this.inputSubtitle?.value.trim()
        });

        await this.syncState();
      });

      this.presetsContainer.appendChild(btn);
    });
  }

  updateCustomInputsFromSeconds(totalSecs) {
    const s = Math.max(0, Math.floor(totalSecs));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    if (this.inputCustomHours && document.activeElement !== this.inputCustomHours) {
      this.inputCustomHours.value = hours;
    }
    if (this.inputCustomMinutes && document.activeElement !== this.inputCustomMinutes) {
      this.inputCustomMinutes.value = minutes;
    }
    if (this.inputCustomSeconds && document.activeElement !== this.inputCustomSeconds) {
      this.inputCustomSeconds.value = seconds;
    }
  }

  getCustomSecondsFromInputs() {
    const h = parseInt(this.inputCustomHours?.value, 10) || 0;
    const m = parseInt(this.inputCustomMinutes?.value, 10) || 0;
    const s = parseInt(this.inputCustomSeconds?.value, 10) || 0;
    const total = Math.max(0, h * 3600 + m * 60 + s);
    return total > 0 ? total : 300;
  }

  async syncState() {
    try {
      const state = await window.bibleAPI.countdown.getState();
      if (!state) return;

      const projState = await window.bibleAPI.projection.getState();
      const isProjectedNow = projState?.activeContent?.module === 'countdown' && !projState?.isBlackout;

      // 1. Tally y Botón de Proyección
      if (this.countdownTallyChip) {
        if (isProjectedNow) {
          this.countdownTallyChip.className = 'countdown-tally-chip projected';
          if (this.txtCountdownTally) this.txtCountdownTally.textContent = 'EN PANTALLA PÚBLICA';
          if (this.btnProjectCountdown) {
            this.btnProjectCountdown.classList.add('btn-primary');
            this.btnProjectCountdown.classList.remove('btn-secondary');
          }
          if (this.txtBtnProjectCountdown) this.txtBtnProjectCountdown.textContent = 'En Pantalla Pública';
        } else {
          this.countdownTallyChip.className = 'countdown-tally-chip not-projected';
          if (this.txtCountdownTally) this.txtCountdownTally.textContent = 'Temporizador en Espera';
          if (this.btnProjectCountdown) {
            this.btnProjectCountdown.classList.remove('btn-primary');
            this.btnProjectCountdown.classList.add('btn-secondary');
          }
          if (this.txtBtnProjectCountdown) this.txtBtnProjectCountdown.textContent = 'Proyectar en Pantalla';
        }
      }

      if (this.countdownLiveStatus) {
        if (isProjectedNow) {
          this.countdownLiveStatus.textContent = state.isFinished ? 'Culto Iniciado' : 'Cuenta Regresiva';
        } else {
          this.countdownLiveStatus.textContent = 'En espera';
        }
        const livePill = this.countdownLiveStatus.closest('.live-status-pill');
        if (livePill) {
          livePill.classList.toggle('live', Boolean(isProjectedNow));
        }
      }

      // 2. Pantalla Digital
      if (state.isFinished) {
        this.clockDisplay?.classList.add('finished');
        if (this.clockDisplay) {
          this.clockDisplay.textContent = state.endMessage || '¡Bienvenidos!';
        }
        if (this.btnStart) this.btnStart.style.display = 'none';
        if (this.btnPause) this.btnPause.style.display = 'none';
        if (this.btnResume) this.btnResume.style.display = 'none';
        if (this.btnReset) this.btnReset.style.display = 'inline-flex';

        // Reproducir campanilla sonora si acaba de finalizar
        if (!this.wasFinished && this.chkEndChime?.checked) {
          this.playEndChime();
        }
        this.wasFinished = true;
      } else {
        this.wasFinished = false;
        this.clockDisplay?.classList.remove('finished');
        if (this.clockDisplay) {
          this.clockDisplay.textContent = state.formattedTime || '00:05:00';
        }

        // Si no está corriendo ni el usuario está editando los inputs, reflejar el tiempo
        if (!state.isRunning && !state.isPaused) {
          this.updateCustomInputsFromSeconds(state.totalSeconds || state.remainingSeconds);
        }

        if (state.isRunning) {
          if (this.btnStart) this.btnStart.style.display = 'none';
          if (this.btnPause) this.btnPause.style.display = 'inline-flex';
          if (this.btnResume) this.btnResume.style.display = 'none';
          if (this.btnReset) this.btnReset.style.display = 'inline-flex';
        } else if (state.isPaused) {
          if (this.btnStart) this.btnStart.style.display = 'none';
          if (this.btnPause) this.btnPause.style.display = 'none';
          if (this.btnResume) this.btnResume.style.display = 'inline-flex';
          if (this.btnReset) this.btnReset.style.display = 'inline-flex';
        } else {
          if (this.btnStart) this.btnStart.style.display = 'inline-flex';
          if (this.btnPause) this.btnPause.style.display = 'none';
          if (this.btnResume) this.btnResume.style.display = 'none';
          if (this.btnReset) this.btnReset.style.display = 'inline-flex';
        }
      }

      // Actualizar estado activo en presets
      if (this.presetsContainer && state.totalSeconds) {
        this.selectedSeconds = state.totalSeconds;
        const chips = this.presetsContainer.querySelectorAll('.preset-chip-btn');
        chips.forEach(chip => {
          const s = parseInt(chip.dataset.seconds, 10);
          chip.classList.toggle('active', s === state.totalSeconds);
        });
      }
    } catch (err) {
      console.error('[CountdownController] Error al sincronizar estado:', err);
    }
  }

  playEndChime() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Acorde Mayor Triunfal)
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + (index * 0.15);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });
    } catch (e) {
      console.warn('[CountdownController] No se pudo reproducir campana sonora:', e);
    }
  }

  bindEvents() {
    // 1. Proyectar en Pantalla Pública
    this.btnProjectCountdown?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.project();
      await this.syncState();
    });

    // 2. Aplicar Tiempo Personalizado
    this.btnSetCustomTime?.addEventListener('click', async () => {
      const secs = this.getCustomSecondsFromInputs();
      this.selectedSeconds = secs;
      await window.bibleAPI.countdown.setTime({
        seconds: secs,
        endMessage: this.inputEndMessage?.value.trim(),
        subtitle: this.inputSubtitle?.value.trim()
      });
      await this.syncState();
    });

    // 3. Ajustes Rápidos (-1 min, +1 min, +5 min)
    this.btnQuickSub1?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.addSeconds(-60);
      const state = await window.bibleAPI.countdown.getState();
      this.updateCustomInputsFromSeconds(state.remainingSeconds);
      await this.syncState();
    });

    this.btnQuickAdd1?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.addSeconds(60);
      const state = await window.bibleAPI.countdown.getState();
      this.updateCustomInputsFromSeconds(state.remainingSeconds);
      await this.syncState();
    });

    this.btnQuickAdd5?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.addSeconds(300);
      const state = await window.bibleAPI.countdown.getState();
      this.updateCustomInputsFromSeconds(state.remainingSeconds);
      await this.syncState();
    });

    // 4. Iniciar Temporizador
    this.btnStart?.addEventListener('click', async () => {
      const secs = this.getCustomSecondsFromInputs();
      this.selectedSeconds = secs;
      const endMsg = this.inputEndMessage?.value.trim();
      const subtitle = this.inputSubtitle?.value.trim();

      await window.bibleAPI.countdown.start({
        seconds: secs,
        endMessage: endMsg,
        subtitle: subtitle
      });
      await this.syncState();
    });

    // 5. Pausar
    this.btnPause?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.pause();
      await this.syncState();
    });

    // 6. Reanudar
    this.btnResume?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.resume();
      await this.syncState();
    });

    // 7. Reiniciar
    this.btnReset?.addEventListener('click', async () => {
      await window.bibleAPI.countdown.reset();
      await this.syncState();
    });

    // 8. Actualizar títulos al perder foco
    this.inputSubtitle?.addEventListener('change', async () => {
      const state = await window.bibleAPI.countdown.getState();
      await window.bibleAPI.countdown.setTime({
        seconds: state.remainingSeconds,
        endMessage: this.inputEndMessage?.value.trim(),
        subtitle: this.inputSubtitle?.value.trim()
      });
    });

    this.inputEndMessage?.addEventListener('change', async () => {
      const state = await window.bibleAPI.countdown.getState();
      await window.bibleAPI.countdown.setTime({
        seconds: state.remainingSeconds,
        endMessage: this.inputEndMessage?.value.trim(),
        subtitle: this.inputSubtitle?.value.trim()
      });
    });
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}
