/**
 * BIBLE — Shell Maestro del Operador
 * Coordina la navegación entre módulos, reloj maestro, atajos globales y la sincronización del monitor de proyección.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elementos de la interfaz
  const tallyBadge = document.getElementById('tallyStatusBadge');
  const previewBg = document.getElementById('previewBg');
  const previewTitle = document.getElementById('previewTitle');
  const previewText = document.getElementById('previewText');
  const blackoutOverlay = document.getElementById('previewBlackoutOverlay');
  const logoOverlay = document.getElementById('previewLogoOverlay');
  const activeModuleInfo = document.getElementById('activeModuleInfo');
  const activeItemInfo = document.getElementById('activeItemInfo');
  const workspaceContainer = document.getElementById('workspaceContainer');
  const previewMonitorScreen = document.getElementById('previewMonitorScreen');
  const previewTallyIndicator = document.getElementById('previewTallyIndicator');
  const clockTimeDisplay = document.getElementById('clockTimeDisplay');
  const displayModeLabel = document.getElementById('displayModeLabel');
  const btnTogglePublic = document.getElementById('btnTogglePublicWindow');

  // Botones de pánico
  const btnBlackout = document.getElementById('btnPanicBlackout');
  const btnLogo = document.getElementById('btnPanicLogo');
  const btnClear = document.getElementById('btnPanicClear');
  const btnFreeze = document.getElementById('btnPanicFreeze');

  // Navegación
  const navButtons = document.querySelectorAll('.nav-item');
  let currentActiveModule = 'bible'; // Inicia directamente en la Biblia para máxima agilidad

  /**
   * Reloj Maestro de Culto en tiempo real
   */
  function startMasterClock() {
    function tick() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formatted = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      if (clockTimeDisplay) {
        clockTimeDisplay.textContent = formatted;
      }
    }
    tick();
    setInterval(tick, 1000);
  }
  startMasterClock();

  /**
   * Detecta y muestra el estado de las pantallas
   */
  async function checkDisplays() {
    if (window.bibleAPI && window.bibleAPI.system && window.bibleAPI.system.getDisplays) {
      try {
        const { displays, secondaryDisplay } = await window.bibleAPI.system.getDisplays();
        if (displayModeLabel) {
          if (secondaryDisplay) {
            displayModeLabel.textContent = `Proyector HDMI (${secondaryDisplay.bounds.width}x${secondaryDisplay.bounds.height})`;
          } else {
            displayModeLabel.textContent = 'Modo 1 Pantalla (Ventana Flotante)';
          }
        }
      } catch (err) {
        console.warn('[Shell] No se pudo consultar pantallas:', err);
      }
    }
  }
  checkDisplays();

  if (btnTogglePublic) {
    btnTogglePublic.addEventListener('click', async () => {
      // Intentar alternar visibilidad de la ventana pública si existe método
      if (window.bibleAPI && window.bibleAPI.projection && window.bibleAPI.projection.toggleWindow) {
        window.bibleAPI.projection.toggleWindow();
      }
    });
  }

  /**
   * Sincroniza el monitor de previsualización con el estado de proyección
   */
  function updatePreviewMonitor(state) {
    if (!state) return;

    const isLive = Boolean(state.activeContent) && !state.isBlackout;

    if (previewMonitorScreen) {
      if (isLive) {
        previewMonitorScreen.classList.add('live');
      } else {
        previewMonitorScreen.classList.remove('live');
      }
    }

    // 1. Estado Tally / Badge
    if (state.isBlackout) {
      tallyBadge.className = 'badge-status badge-blackout';
      tallyBadge.textContent = 'En Negro';
      if (previewTallyIndicator) {
        previewTallyIndicator.textContent = 'BLACKOUT';
        previewTallyIndicator.style.backgroundColor = 'var(--status-blackout)';
        previewTallyIndicator.style.color = '#FFFFFF';
      }
      btnBlackout.classList.add('active-blackout');
      blackoutOverlay.classList.add('visible');
    } else {
      btnBlackout.classList.remove('active-blackout');
      blackoutOverlay.classList.remove('visible');

      if (state.isFrozen) {
        tallyBadge.className = 'badge-status badge-live';
        tallyBadge.textContent = 'Congelado';
        if (previewTallyIndicator) {
          previewTallyIndicator.textContent = 'CONGELADO';
          previewTallyIndicator.style.backgroundColor = 'var(--status-freeze)';
          previewTallyIndicator.style.color = '#FFFFFF';
        }
      } else if (state.isLogo) {
        tallyBadge.className = 'badge-status badge-live';
        tallyBadge.textContent = 'Logo Activo';
        if (previewTallyIndicator) {
          previewTallyIndicator.textContent = 'LOGO';
          previewTallyIndicator.style.backgroundColor = 'var(--accent-gold)';
          previewTallyIndicator.style.color = '#000000';
        }
      } else if (state.activeContent) {
        tallyBadge.className = 'badge-status badge-live';
        tallyBadge.textContent = 'En Vivo';
        if (previewTallyIndicator) {
          previewTallyIndicator.textContent = 'EN EL AIRE';
          previewTallyIndicator.style.backgroundColor = 'var(--status-live)';
          previewTallyIndicator.style.color = '#000000';
        }
      } else {
        tallyBadge.className = 'badge-status badge-standby';
        tallyBadge.textContent = 'Standby';
        if (previewTallyIndicator) {
          previewTallyIndicator.textContent = 'STANDBY';
          previewTallyIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
          previewTallyIndicator.style.color = 'var(--text-muted)';
        }
      }
    }

    // 2. Logo Overlay
    if (state.isLogo && !state.isBlackout) {
      logoOverlay.classList.add('visible');
      btnLogo.classList.add('active-toggle');
    } else {
      logoOverlay.classList.remove('visible');
      btnLogo.classList.remove('active-toggle');
    }

    // 3. Clear Text y Freeze
    if (state.isClearText) {
      btnClear.classList.add('active-toggle');
      previewText.style.opacity = '0';
    } else {
      btnClear.classList.remove('active-toggle');
      previewText.style.opacity = '1';
    }

    if (state.isFrozen) {
      btnFreeze.classList.add('active-freeze');
    } else {
      btnFreeze.classList.remove('active-freeze');
    }

    // 4. Contenido activo
    if (state.activeContent) {
      previewTitle.textContent = state.activeContent.title || 'Proyección Activa';
      previewText.textContent = state.activeContent.text || '';
      activeModuleInfo.textContent = (state.activeContent.module || '—').toUpperCase();
      activeItemInfo.textContent = state.activeContent.title || '—';

      if (state.activeContent.background) {
        previewBg.style.backgroundImage = `linear-gradient(135deg, #1E293B 0%, #0F172A 100%)`;
      }
    } else {
      previewTitle.textContent = 'Sin Emisión Activa';
      previewText.textContent = 'Selecciona un elemento para proyectar';
      activeModuleInfo.textContent = 'En espera';
      activeItemInfo.textContent = 'Ninguno';
      previewBg.style.backgroundImage = 'none';
    }
  }

  // Escuchar actualizaciones de previsualización
  if (window.bibleAPI && window.bibleAPI.projection) {
    window.bibleAPI.projection.onPreviewUpdate((state) => {
      updatePreviewMonitor(state);
    });

    try {
      const state = await window.bibleAPI.projection.getState();
      updatePreviewMonitor(state);
    } catch (err) {
      console.error('[Shell] Error al obtener estado de proyección:', err);
    }
  }

  // Asignar manejadores de botones de pánico
  btnBlackout.addEventListener('click', () => window.bibleAPI.projection.toggleBlackout());
  btnLogo.addEventListener('click', () => window.bibleAPI.projection.toggleLogo());
  btnClear.addEventListener('click', () => window.bibleAPI.projection.toggleClearText());
  btnFreeze.addEventListener('click', () => window.bibleAPI.projection.toggleFreeze());

  /**
   * Cambia de módulo en el espacio de trabajo
   */
  async function switchModule(moduleName) {
    currentActiveModule = moduleName;
    navButtons.forEach(btn => {
      if (btn.dataset.module === moduleName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Módulo 1: Identidad de la Iglesia
    if (moduleName === 'church-identity') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('church-identity');
        workspaceContainer.innerHTML = html;
        const { ChurchIdentityController } = await import('../../modules/church-identity/js/church-identity.js');
        new ChurchIdentityController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de identidad:', err);
      }
    }

    // Módulo 2: Biblia (RV1909)
    if (moduleName === 'bible') {
      try {
        console.log('[Shell] Cargando HTML del módulo bible...');
        const html = await window.bibleAPI.system.getModuleHtml('bible');
        workspaceContainer.innerHTML = html;
        console.log('[Shell] Importando BibleController...');
        const { BibleController } = await import('../../modules/bible/js/bible.js');
        console.log('[Shell] Instanciando BibleController...');
        new BibleController();
        console.log('[Shell] BibleController instanciado con éxito.');
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Biblia:', err);
      }
    }

    // Módulo 3: Coritos Pentecostales y de Adoración
    if (moduleName === 'choruses') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('choruses');
        workspaceContainer.innerHTML = html;
        const { ChorusesController } = await import('../../modules/choruses/js/choruses.js');
        new ChorusesController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Coritos:', err);
      }
    }

    // Módulo 4: Predicación (Presentaciones PDF y PowerPoint)
    if (moduleName === 'preaching') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('preaching');
        workspaceContainer.innerHTML = html;
        const { PreachingController } = await import('../../modules/preaching/js/preaching.js');
        new PreachingController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Predicación:', err);
      }
    }

    // Módulo 5: Spots Multimedia (Fotos y Videos)
    if (moduleName === 'spots') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('spots');
        workspaceContainer.innerHTML = html;
        const { SpotsController } = await import('../../modules/spots/js/spots.js');
        new SpotsController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Spots:', err);
      }
    }

    // Módulo 6: Ruleta Dinámica
    if (moduleName === 'roulette') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('roulette');
        workspaceContainer.innerHTML = html;
        const { RouletteController } = await import('../../modules/roulette/js/roulette.js');
        new RouletteController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Ruleta:', err);
      }
    }

    // Módulo 7: Cuenta Regresiva
    if (moduleName === 'countdown') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('countdown');
        workspaceContainer.innerHTML = html;
        const { CountdownController } = await import('../../modules/countdown/js/countdown.js');
        new CountdownController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Cuenta Regresiva:', err);
      }
    }

    window.dispatchEvent(new CustomEvent('module-switched', { detail: { module: moduleName } }));
  }

  // Navegación por clic
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchModule(btn.dataset.module);
    });
  });

  // Atajos de Teclado Globales
  window.addEventListener('keydown', (e) => {
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    const hasSelection = window.getSelection().toString().length > 0;

    // F1 - F4: Botones de pánico de consola
    if (e.key === 'F1') {
      e.preventDefault();
      window.bibleAPI.projection.toggleBlackout();
      return;
    }
    if (e.key === 'F2') {
      e.preventDefault();
      window.bibleAPI.projection.toggleLogo();
      return;
    }
    if (e.key === 'F3') {
      e.preventDefault();
      window.bibleAPI.projection.toggleClearText();
      return;
    }
    if (e.key === 'F4') {
      e.preventDefault();
      window.bibleAPI.projection.toggleFreeze();
      return;
    }

    // Ctrl + T: Abrir Biblia
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
      e.preventDefault();
      switchModule('bible');
      return;
    }

    // Ctrl + C: Abrir Coritos (solo si no se está copiando texto seleccionado)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      if (!hasSelection && !isInputFocused) {
        e.preventDefault();
        switchModule('choruses');
        return;
      }
    }

    // Ctrl + P: Predicación
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      switchModule('preaching');
      return;
    }

    // Ctrl + S: Spots
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      switchModule('spots');
      return;
    }

    // Ctrl + R: Ruleta
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      switchModule('roulette');
      return;
    }
  });

  // Carga inicial
  switchModule(currentActiveModule);
});
