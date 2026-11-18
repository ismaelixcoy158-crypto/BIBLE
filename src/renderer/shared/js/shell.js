/**
 * BIBLE — Shell Maestro del Operador
 * Coordina la navegación entre módulos, atajos globales y la sincronización del monitor de proyección.
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

  // Botones de pánico
  const btnBlackout = document.getElementById('btnPanicBlackout');
  const btnLogo = document.getElementById('btnPanicLogo');
  const btnClear = document.getElementById('btnPanicClear');
  const btnFreeze = document.getElementById('btnPanicFreeze');

  // Navegación
  const navButtons = document.querySelectorAll('.nav-item');
  let currentActiveModule = 'church-identity';

  /**
   * Sincroniza el monitor de previsualización con el estado de proyección
   */
  function updatePreviewMonitor(state) {
    if (!state) return;

    // 1. Estado Tally / Badge
    if (state.isBlackout) {
      tallyBadge.className = 'badge-status badge-blackout';
      tallyBadge.textContent = 'En Negro';
      btnBlackout.classList.add('active-blackout');
      blackoutOverlay.classList.add('visible');
    } else {
      btnBlackout.classList.remove('active-blackout');
      blackoutOverlay.classList.remove('visible');

      if (state.isFrozen) {
        tallyBadge.className = 'badge-status badge-live';
        tallyBadge.textContent = 'Congelado';
      } else if (state.isLogo) {
        tallyBadge.className = 'badge-status badge-live';
        tallyBadge.textContent = 'Logo Activo';
      } else if (state.activeContent) {
        tallyBadge.className = 'badge-status badge-live';
        tallyBadge.textContent = 'En Vivo';
      } else {
        tallyBadge.className = 'badge-status badge-standby';
        tallyBadge.textContent = 'Standby';
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
      activeModuleInfo.textContent = '—';
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
        const response = await fetch('../modules/church-identity/church-identity.html');
        const html = await response.text();
        workspaceContainer.innerHTML = html;
        const { ChurchIdentityController } = await import('../modules/church-identity/js/church-identity.js');
        new ChurchIdentityController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de identidad:', err);
      }
    }

    // Módulo 2: Biblia (RV1909)
    if (moduleName === 'bible') {
      try {
        const response = await fetch('../modules/bible/bible.html');
        const html = await response.text();
        workspaceContainer.innerHTML = html;
        const { BibleController } = await import('../modules/bible/js/bible.js');
        new BibleController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Biblia:', err);
      }
    }

    // Módulo 3: Coritos Pentecostales y de Adoración
    if (moduleName === 'choruses') {
      try {
        const response = await fetch('../modules/choruses/choruses.html');
        const html = await response.text();
        workspaceContainer.innerHTML = html;
        const { ChorusesController } = await import('../modules/choruses/js/choruses.js');
        new ChorusesController();
        return;
      } catch (err) {
        console.error('[Shell] Error al cargar módulo de Coritos:', err);
      }
    }

    // Espacio de trabajo provisional para módulos siguientes
    workspaceContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="border-bottom: 1px solid var(--border-default); padding-bottom: 12px;">
          <h2 style="font-size: 18px; font-weight: 600; color: var(--text-primary);">
            Módulo: ${moduleName.replace('-', ' ').toUpperCase()}
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
            Espacio de trabajo modular e independiente.
          </p>
        </div>
        <div id="moduleViewPlaceholder">
          <!-- Vista del módulo en construcción -->
        </div>
      </div>
    `;

    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('module-switched', { detail: { module: moduleName } }));
  }

  // Navegación por clic
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchModule(btn.dataset.module);
    });
  });

  // Atajos de Teclado Globales (Reglas de no colisión con el SO)
  window.addEventListener('keydown', (e) => {
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    const hasSelection = window.getSelection().toString().length > 0;

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

    // F12: Pánico a Negro
    if (e.key === 'F12') {
      e.preventDefault();
      window.bibleAPI.projection.toggleBlackout();
    }
  });

  // Carga inicial
  switchModule(currentActiveModule);
});
