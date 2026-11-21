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
        previewTitle.style.color = '#92400E';
      } else {
        previewText.style.color = '#FFFFFF';
        previewText.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.8)';
        previewTitle.style.color = 'var(--accent-gold)';
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

  // Carga inicial
  switchModule(currentActiveModule);
});
