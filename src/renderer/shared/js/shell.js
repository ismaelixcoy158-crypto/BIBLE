/**
 * BIBLE — Shell Maestro del Operador
 * Coordina la navegación entre módulos, reloj maestro, atajos globales y la sincronización del monitor de proyección.
 */

import { cloudRemoteRelay } from './cloud-remote-relay.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Elementos de la interfaz
  const tallyBadge = document.getElementById('tallyStatusBadge');
  const previewBg = document.getElementById('previewBg');
  const previewTitle = document.getElementById('previewTitle');
  const previewText = document.getElementById('previewText');
  const blackoutOverlay = document.getElementById('previewBlackoutOverlay');
  const logoOverlay = document.getElementById('previewLogoOverlay');
  const previewLogoImg = document.getElementById('previewLogoImg');
  const previewLogoSvgFallback = document.getElementById('previewLogoSvgFallback');
  const previewLogoText = document.getElementById('previewLogoText');
  const shellChurchNameTag = document.getElementById('shellChurchNameTag');
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

  // Gestor Central de Temas Dinámicos (Warm Pastel Minimalism)
  const DEFAULT_APP_THEME = 'warm-cream';
  const VALID_APP_THEMES = ['warm-cream', 'sage', 'lavender', 'peach', 'sky', 'rose', 'dark-elegant', 'dark-blue'];

  async function applyAppTheme(themeId, persist = true) {
    const target = VALID_APP_THEMES.includes(themeId) ? themeId : DEFAULT_APP_THEME;
    document.documentElement.setAttribute('data-theme', target);
    window.__currentAppTheme = target;

    if (persist && window.bibleAPI?.db?.setSetting) {
      try {
        await window.bibleAPI.db.setSetting('app_theme', target);
      } catch (err) {
        console.warn('[Shell] Error al guardar preferencia de tema:', err);
      }
    }

    window.dispatchEvent(new CustomEvent('app-theme-changed', { detail: { theme: target } }));
  }

  window.setAppTheme = applyAppTheme;
  window.getCurrentAppTheme = () => window.__currentAppTheme || DEFAULT_APP_THEME;

  async function initAppTheme() {
    let saved = DEFAULT_APP_THEME;
    if (window.bibleAPI?.db?.getSetting) {
      try {
        const pref = await window.bibleAPI.db.getSetting('app_theme');
        if (pref && VALID_APP_THEMES.includes(pref)) {
          saved = pref;
        }
      } catch (err) {
        console.warn('[Shell] Error al leer app_theme:', err);
      }
    }
    await applyAppTheme(saved, false);
  }
  await initAppTheme();

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
            displayModeLabel.style.color = 'var(--accent-green, #22c55e)';
          } else {
            displayModeLabel.textContent = '1 Pantalla (Presiona Win + P y elige "Extender")';
            displayModeLabel.style.color = 'var(--text-muted)';
          }
        }
      } catch (err) {
        console.warn('[Shell] No se pudo consultar pantallas:', err);
      }
    }
  }
  checkDisplays();
  setInterval(checkDisplays, 4000);

  if (btnTogglePublic) {
    btnTogglePublic.addEventListener('click', async () => {
      if (window.bibleAPI?.projection?.toggleWindow) {
        await window.bibleAPI.projection.toggleWindow();
        checkDisplays();
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
          previewTallyIndicator.style.backgroundColor = 'var(--accent-primary)';
          previewTallyIndicator.style.color = 'var(--text-inverse)';
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
      if (state.churchIdentity) {
        if (state.churchIdentity.logoUrl && previewLogoImg) {
          previewLogoImg.src = state.churchIdentity.logoUrl;
          previewLogoImg.style.display = 'block';
          if (previewLogoSvgFallback) previewLogoSvgFallback.style.display = 'none';
        } else if (previewLogoImg) {
          previewLogoImg.src = 'assets/bible-logo.png';
          previewLogoImg.style.display = 'block';
          if (previewLogoSvgFallback) previewLogoSvgFallback.style.display = 'none';
        }
        if (previewLogoText) {
          previewLogoText.textContent = state.churchIdentity.name || 'LOGOTIPO INSTITUCIONAL';
        }
      }
    } else {
      logoOverlay.classList.remove('visible');
      btnLogo.classList.remove('active-toggle');
    }

    // Actualizar nombre de la iglesia en el encabezado general del sistema
    if (state.churchIdentity?.name && shellChurchNameTag) {
      if (state.churchIdentity.name !== 'Mi Iglesia') {
        shellChurchNameTag.textContent = state.churchIdentity.name;
        shellChurchNameTag.title = state.churchIdentity.name;
      } else {
        shellChurchNameTag.textContent = 'CHURCH MEDIA SYSTEM';
      }
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
      if (state.activeContent.module === 'spots') {
        previewTitle.textContent = state.activeContent.fileType === 'video' ? 'VIDEO EN VIVO' : 'IMAGEN EN VIVO';
        previewText.textContent = state.activeContent.title || '';
        activeModuleInfo.textContent = 'SPOTS & VIDEOS';
        activeItemInfo.textContent = state.activeContent.title || '—';
        if (state.activeContent.fileType === 'image') {
          previewBg.style.backgroundImage = `url("${state.activeContent.mediaUrl}")`;
          previewBg.style.backgroundSize = 'contain';
          previewBg.style.backgroundPosition = 'center';
          previewBg.style.backgroundColor = '#000000';
        } else {
          previewBg.style.backgroundImage = 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)';
          previewBg.style.backgroundColor = '#000000';
        }
      } else if (state.activeContent.module === 'roulette') {
        previewTitle.textContent = 'RULETA DINÁMICA';
        previewText.textContent = state.activeContent.isSpinning 
          ? 'Girando ruleta en vivo...' 
          : (state.activeContent.winnerLabel ? `¡Ganador: ${state.activeContent.winnerLabel}!` : (state.activeContent.title || 'Ruleta Activa'));
        activeModuleInfo.textContent = 'RULETA';
        activeItemInfo.textContent = state.activeContent.winnerLabel || state.activeContent.title || 'Ruleta';
        previewBg.style.backgroundImage = 'radial-gradient(circle, #1e3a8a 0%, #0f172a 100%)';
        previewBg.style.backgroundColor = '#000000';
      } else if (state.activeContent.module === 'countdown') {
        previewTitle.textContent = 'CUENTA REGRESIVA';
        previewText.textContent = state.activeContent.text || '00:05:00';
        activeModuleInfo.textContent = 'TEMPORIZADOR';
        activeItemInfo.textContent = state.activeContent.title || 'Inicio de Culto';
      } else {
        previewTitle.textContent = state.activeContent.title || 'Proyección Activa';
        previewText.textContent = state.activeContent.text || '';
        activeModuleInfo.textContent = (state.activeContent.module || '—').toUpperCase();
        activeItemInfo.textContent = state.activeContent.title || '—';
      }

      if (state.activeContent.background && state.activeContent.module !== 'spots') {
        const bg = state.activeContent.background;
        let bgFit = 'cover';
        let bgScale = 100;
        let bgPosition = 'center';

        if (typeof bg === 'object') {
          if (bg.fit) bgFit = bg.fit;
          if (bg.scale !== undefined) bgScale = bg.scale;
          if (bg.position) bgPosition = bg.position;

          if (bg.type === 'image' && bg.url) {
            previewBg.style.backgroundImage = `url("${bg.url}")`;
            previewBg.style.backgroundColor = '#000000';
          } else if (bg.value || bg.gradient) {
            if ((bg.value && bg.value.startsWith('#')) || (bg.gradient && bg.gradient.startsWith('#'))) {
              previewBg.style.backgroundImage = 'none';
              previewBg.style.backgroundColor = bg.value || bg.gradient;
            } else {
              previewBg.style.backgroundImage = bg.value || bg.gradient;
              previewBg.style.backgroundColor = '#000000';
            }
          } else if (bg.type === 'video') {
            previewBg.style.backgroundImage = `linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)`;
          }
        } else if (typeof bg === 'string') {
          if (bg.startsWith('linear-gradient') || bg.startsWith('radial-gradient')) {
            previewBg.style.backgroundImage = bg;
          } else if (bg.startsWith('#') || bg.startsWith('rgb')) {
            previewBg.style.backgroundImage = 'none';
            previewBg.style.backgroundColor = bg;
          } else {
            previewBg.style.backgroundImage = `url("${bg}")`;
          }
        }

        const positionCss = bgPosition === 'top' ? 'center top' : (bgPosition === 'bottom' ? 'center bottom' : 'center center');
        previewBg.style.backgroundPosition = positionCss;
        previewBg.style.backgroundSize = bgFit === 'fill' ? '100% 100%' : (bgFit === 'ambient' ? 'contain' : bgFit);
        previewBg.style.transform = `scale(${bgScale / 100})`;
      } else {
        previewBg.style.backgroundImage = 'linear-gradient(145deg, #0a2e5c 0%, #124e8c 35%, #1a6cb8 65%, #0e3b6e 100%)';
        previewBg.style.backgroundColor = '#0a2e5c';
        previewBg.style.transform = 'scale(1)';
      }

      // Color de texto en el monitor del operador
      const isDarkText = Boolean(state.activeContent.textColor === 'black');
      if (isDarkText) {
        previewText.style.color = '#0F172A';
        previewText.style.textShadow = '0 1px 3px rgba(255, 255, 255, 0.9)';
        previewTitle.style.color = '#1E40AF';
      } else {
        previewText.style.color = '#FFFFFF';
        previewText.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.8)';
        previewTitle.style.color = '#38BDF8';
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

  // Escuchar acciones emitidas desde el Control Remoto (teléfono del predicador / multimedia)
  if (window.bibleAPI && window.bibleAPI.control) {
    window.bibleAPI.control.onRemoteAction((payload) => {
      const action = payload?.action || payload;
      console.log('[Shell] Acción de control remoto recibida:', action);
      window.dispatchEvent(new CustomEvent('remote-control:action', { detail: { action } }));
    });
  }

  // Inicializar Cloud Remote Relay para vincular la laptop con celulares en la nube
  try {
    cloudRemoteRelay.init();
    window.cloudRemoteRelay = cloudRemoteRelay;
  } catch (err) {
    console.warn('[Shell] Error al inicializar Cloud Remote Relay:', err);
  }

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

    // Módulo 8: Control Remoto (Púlpito y Multimedia por Wi-Fi)
    if (moduleName === 'control') {
      try {
        const html = await window.bibleAPI.system.getModuleHtml('control');
        workspaceContainer.innerHTML = html;
        const { ControlController } = await import('../../modules/control/js/control.js');
        new ControlController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Control Remoto:', err);
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
    if (e.key === 'F5') {
      e.preventDefault();
      if (window.bibleAPI?.projection?.toggleWindow) {
        window.bibleAPI.projection.toggleWindow();
        checkDisplays();
      }
      return;
    }

    // Si el usuario está escribiendo dentro de un campo de texto o área editable,
    // NO interceptar ninguna tecla para atajos de navegación de módulos
    if (isInputFocused) {
      return;
    }

    // Atajos directos: Alt+1 (Biblia), Alt+2 (Coritos), Alt+3 (Predicación)
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      switchModule('bible');
      return;
    }
    if (e.altKey && e.key === '2') {
      e.preventDefault();
      switchModule('choruses');
      return;
    }
    if (e.altKey && e.key === '3') {
      e.preventDefault();
      switchModule('preaching');
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

  /**
   * Separadores arrastrables para estirar las barras laterales (Menú y Monitor de al lado)
   */
  function initShellSplitters() {
    const appContainer = document.querySelector('.app-container');
    const splitterLeft = document.getElementById('shellSplitterLeft');
    const splitterRight = document.getElementById('shellSplitterRight');
    if (!appContainer || !splitterLeft || !splitterRight) return;

    // Cargar anchos guardados
    try {
      const saved = JSON.parse(localStorage.getItem('shell_sidebar_widths') || '{}');
      if (saved.left && saved.left >= 160 && saved.left <= 340) {
        appContainer.style.setProperty('--nav-sidebar-width', `${saved.left}px`);
      }
      if (saved.right && saved.right >= 260 && saved.right <= 650) {
        appContainer.style.setProperty('--output-sidebar-width', `${saved.right}px`);
      }
    } catch {}

    const saveWidths = () => {
      try {
        const leftWidth = parseInt(getComputedStyle(appContainer).getPropertyValue('--nav-sidebar-width')) || 210;
        const rightWidth = parseInt(getComputedStyle(appContainer).getPropertyValue('--output-sidebar-width')) || 340;
        localStorage.setItem('shell_sidebar_widths', JSON.stringify({ left: leftWidth, right: rightWidth }));
      } catch {}
    };

    // Separador Izquierdo: Redimensionar menú de navegación
    let isDraggingLeft = false;
    let startXLeft = 0;
    let startWidthLeft = 0;

    splitterLeft.addEventListener('pointerdown', (e) => {
      isDraggingLeft = true;
      startXLeft = e.clientX;
      startWidthLeft = document.getElementById('navSidebar')?.getBoundingClientRect().width || 210;
      splitterLeft.setPointerCapture(e.pointerId);
      splitterLeft.classList.add('dragging');
      document.body.classList.add('resizing-columns');
      e.preventDefault();
    });

    splitterLeft.addEventListener('pointermove', (e) => {
      if (!isDraggingLeft) return;
      const delta = e.clientX - startXLeft;
      const newWidth = Math.max(160, Math.min(340, startWidthLeft + delta));
      appContainer.style.setProperty('--nav-sidebar-width', `${newWidth}px`);
    });

    const stopDraggingLeft = (e) => {
      if (!isDraggingLeft) return;
      isDraggingLeft = false;
      splitterLeft.classList.remove('dragging');
      document.body.classList.remove('resizing-columns');
      try { splitterLeft.releasePointerCapture(e.pointerId); } catch {}
      saveWidths();
    };

    splitterLeft.addEventListener('pointerup', stopDraggingLeft);
    splitterLeft.addEventListener('pointercancel', stopDraggingLeft);

    splitterLeft.addEventListener('dblclick', () => {
      appContainer.style.setProperty('--nav-sidebar-width', '210px');
      saveWidths();
    });

    // Separador Derecho: Redimensionar panel de salida / monitor de al lado
    let isDraggingRight = false;
    let startXRight = 0;
    let startWidthRight = 0;

    splitterRight.addEventListener('pointerdown', (e) => {
      isDraggingRight = true;
      startXRight = e.clientX;
      startWidthRight = document.getElementById('outputSidebar')?.getBoundingClientRect().width || 340;
      splitterRight.setPointerCapture(e.pointerId);
      splitterRight.classList.add('dragging');
      document.body.classList.add('resizing-columns');
      e.preventDefault();
    });

    splitterRight.addEventListener('pointermove', (e) => {
      if (!isDraggingRight) return;
      // Arrastrar hacia la izquierda expande el panel derecho ("el de a la par")
      const delta = startXRight - e.clientX;
      const newWidth = Math.max(260, Math.min(650, startWidthRight + delta));
      appContainer.style.setProperty('--output-sidebar-width', `${newWidth}px`);
    });

    const stopDraggingRight = (e) => {
      if (!isDraggingRight) return;
      isDraggingRight = false;
      splitterRight.classList.remove('dragging');
      document.body.classList.remove('resizing-columns');
      try { splitterRight.releasePointerCapture(e.pointerId); } catch {}
      saveWidths();
    };

    splitterRight.addEventListener('pointerup', stopDraggingRight);
    splitterRight.addEventListener('pointercancel', stopDraggingRight);

    splitterRight.addEventListener('dblclick', () => {
      appContainer.style.setProperty('--output-sidebar-width', '340px');
      saveWidths();
    });
  }

  // Inicializar separadores del shell
  initShellSplitters();

  /**
   * Motor de Desplazamiento Ágil (Agile Scroll Engine)
   * Acelera y despesa el scroll con la rueda del ratón en todos los módulos de la aplicación,
   * permitiendo recorrer listas largas con agilidad, rapidez y sin fatiga.
   */
  function initAgileScroll() {
    window.addEventListener('wheel', (e) => {
      // Ignorar zoom con Ctrl o desplazamiento primariamente horizontal
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      let current = e.target;
      let scrollEl = null;

      // Localizar el contenedor desplazable más cercano bajo el puntero
      while (current && current !== document.body && current !== document.documentElement) {
        if (current.scrollHeight > current.clientHeight + 2) {
          const overflowY = window.getComputedStyle(current).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            scrollEl = current;
            break;
          }
        }
        current = current.parentElement;
      }

      if (!scrollEl) return;

      // Si ya está en los topes físicos, permitir el flujo natural
      if (e.deltaY < 0 && scrollEl.scrollTop <= 0) return;
      if (e.deltaY > 0 && scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1) return;

      e.preventDefault();

      // Normalizar unidades de delta (si el SO emite por líneas en vez de píxeles)
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        delta *= 40;
      }

      // Factor de aceleración ergonómico para convertir scroll pesado en ágil y fluido
      const multiplier = Math.abs(delta) >= 30 ? 2.5 : 1.4;

      scrollEl.scrollBy({
        top: delta * multiplier,
        behavior: 'auto'
      });
    }, { passive: false });
  }

  initAgileScroll();

  /**
   * Sistema de Aceptación de Términos, Reglas y Condiciones (Proyecto Ixcoydev)
   * Requiere aceptación previa al primer uso del sistema tras ser descargado/instalado.
   * Proporciona acceso posterior para consulta en cualquier momento.
   */
  function initTermsAndConditions() {
    const modal = document.getElementById('termsConditionsModal');
    const backdrop = document.getElementById('termsBackdrop');
    const chk = document.getElementById('chkAcceptTerms');
    const btnAccept = document.getElementById('btnAcceptTerms');
    const btnClose = document.getElementById('btnCloseTermsModal');
    const btnCloseRead = document.getElementById('btnCloseTermsRead');
    const agreementBox = document.getElementById('termsAgreementBox');

    if (!modal) return;

    const TERMS_KEY = 'bible_terms_accepted_v1';
    let isReviewMode = false;

    // Verificar si ya fue aceptado previamente
    const alreadyAccepted = localStorage.getItem(TERMS_KEY) === 'true';

    // Función global para abrir el modal (en modo obligatorio o en modo lectura)
    window.openTermsModal = function(reviewMode = false) {
      isReviewMode = reviewMode;
      modal.style.display = 'flex';

      if (isReviewMode) {
        if (btnClose) btnClose.style.display = 'flex';
        if (btnCloseRead) btnCloseRead.style.display = 'inline-flex';
        if (agreementBox) agreementBox.style.display = 'none';
        if (btnAccept) {
          btnAccept.disabled = false;
          const span = btnAccept.querySelector('span');
          if (span) span.textContent = 'Entendido / Reglas Aceptadas';
        }
      } else {
        if (btnClose) btnClose.style.display = 'none';
        if (btnCloseRead) btnCloseRead.style.display = 'none';
        if (agreementBox) agreementBox.style.display = 'block';
        if (chk) chk.checked = false;
        if (btnAccept) {
          btnAccept.disabled = true;
          const span = btnAccept.querySelector('span');
          if (span) span.textContent = 'Aceptar y Comenzar a Usar BIBLE';
        }
      }
    };

    function closeModal() {
      modal.style.display = 'none';
    }

    chk?.addEventListener('change', () => {
      if (btnAccept && !isReviewMode) {
        btnAccept.disabled = !chk.checked;
      }
    });

    btnAccept?.addEventListener('click', () => {
      localStorage.setItem(TERMS_KEY, 'true');
      try {
        window.electronAPI?.db?.setSetting({ key: 'terms_accepted', value: true });
      } catch (e) {
        // Silencioso si no está disponible
      }
      closeModal();
    });

    btnClose?.addEventListener('click', () => closeModal());
    btnCloseRead?.addEventListener('click', () => closeModal());
    backdrop?.addEventListener('click', () => {
      if (isReviewMode) closeModal();
    });

    // Si aún no ha sido aceptado por el usuario, abrir inmediatamente
    if (!alreadyAccepted) {
      window.openTermsModal(false);
    }
  }

  initTermsAndConditions();

  // Carga inicial
  switchModule(currentActiveModule);
});
