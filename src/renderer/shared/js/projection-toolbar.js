/**
 * BIBLE — ProjectionToolbarController
 * Arquitectura Orientada a Objetos (POO / Estilo Java) para la Barra Inferior de Control de Emisión.
 *
 * Principios de Diseño:
 * 1. Componente Reutilizable y Modular:
 *    - Modela la barra inferior como una clase autocontenida que cualquier módulo (Biblia, Coritos, Predicación, etc.)
 *      puede instanciar y usar con una única línea de código.
 * 2. Persistencia y Estado Global del Culto:
 *    - El fondo de proyección (ej: "Océano Profundo", videos o fotos) pertenece a la sesión de culto de la iglesia,
 *      no a un módulo aislado. Al cambiar de Biblia a Coritos, el fondo NO desaparece ni se resetea.
 *    - La miniatura, el nombre del fondo y el color de letra (Blanco / Negro) se sincronizan en tiempo real
 *      a través de ProjectionService.
 * 3. Indicador Tally "EN AIRE":
 *    - Escucha los eventos de proyección (`projection:preview-update`) para reflejar si la emisión está activa
 *      y qué cita o corito está en pantalla, o si está "En espera".
 * 4. Navegación Universal:
 *    - Controla los botones `< Anterior`, `Siguiente >`, selector de posición de cita, mayúsculas y atajos.
 */
import { BackgroundPickerController } from './background-picker.js';

export class ProjectionToolbarController {
  /**
   * @param {Object} options Opciones de inicialización
   * @param {HTMLElement|string} options.container Contenedor de la barra inferior o selector CSS
   * @param {string} options.module Nombre del módulo ('bible', 'choruses', 'preaching', etc.)
   * @param {Function} [options.onPrev] Callback al presionar "Anterior"
   * @param {Function} [options.onNext] Callback al presionar "Siguiente"
   * @param {Function} [options.onProject] Callback al presionar "Proyectar"
   * @param {Function} [options.onUppercaseChange] Callback al alternar MAYÚS
   * @param {Function} [options.onRefPositionChange] Callback al cambiar ubicación de cita (top/bottom)
   * @param {Function} [options.onVersionChange] Callback al cambiar versión de biblia
   * @param {Function} [options.onShowTranslationChange] Callback al alternar visualización de versión
   * @param {Function} [options.onBackgroundChange] Callback al cambiar fondo
   * @param {Function} [options.onTextColorChange] Callback al cambiar color de letra
   * @param {Function} [options.onOpenShortcuts] Callback al abrir atajos de teclado
   */
  constructor(options = {}) {
    this.options = options;
    this.module = options.module || 'bible';
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    // Callbacks
    this.onPrev = options.onPrev || (() => {});
    this.onNext = options.onNext || (() => {});
    this.onProject = options.onProject || (() => {});
    this.onUppercaseChange = options.onUppercaseChange || (() => {});
    this.onRefPositionChange = options.onRefPositionChange || (() => {});
    this.onVersionChange = options.onVersionChange || (() => {});
    this.onShowTranslationChange = options.onShowTranslationChange || (() => {});
    this.onBackgroundChange = options.onBackgroundChange || (() => {});
    this.onTextColorChange = options.onTextColorChange || (() => {});
    this.onOpenShortcuts = options.onOpenShortcuts || null;

    // Estado interno
    this.bgPicker = null;
    this.currentRefText = 'En espera';
    this.isLive = false;
    this._unsubscribePreview = null;
  }

  /**
   * Inicializa la barra de control, vincula los elementos del DOM y sincroniza el estado
   */
  async init() {
    if (!this.container) {
      console.warn(`[ProjectionToolbarController] No se encontró contenedor para el módulo ${this.module}`);
      return this;
    }

    this.cacheElements();
    this.initBackgroundPicker();
    await this.bgPicker.init();
    this.bindEvents();
    await this.syncWithProjectionService();

    return this;
  }

  /**
   * Localiza y cachea los elementos visuales dentro del contenedor de la barra
   */
  cacheElements() {
    const c = this.container;

    // Indicador Tally EN AIRE
    this.liveBadge = c.querySelector('.live-status-chip, #liveStatusBadge, #liveStatusBadgeChoruses, #liveStatusBadgePreaching');
    this.liveRef = c.querySelector('.live-status-cite, #liveStatusRef, #liveStatusChorusRef, #liveStatusPreachingRef');

    // Selector de Fondo
    this.btnBg = c.querySelector('.btn-bg-selector, #btnOpenBackgroundPicker, #btnOpenChorusBgPicker, #btnOpenPreachingBgPicker');
    this.thumbBg = c.querySelector('.bg-thumb-preview, #activeBgThumb, #activeChorusBgThumb, #activePreachingBgThumb');
    this.nameBg = c.querySelector('.bg-selector-name, #activeBgName, #activeChorusBgName, #activePreachingBgName');

    // Color de Letra
    this.btnWhite = c.querySelector('#btnTextWhite, #btnChorusTextWhite, #btnPreachingTextWhite, .btn-color-choice[data-color="white"]');
    this.btnBlack = c.querySelector('#btnTextBlack, #btnChorusTextBlack, #btnPreachingTextBlack, .btn-color-choice[data-color="black"]');

    // Selector de Posición de Cita (arriba / abajo)
    this.selectRefPos = c.querySelector('#selectRefPosition, .customizer-select');

    // Selector de Versión Bíblica (si aplica)
    this.selectVersion = c.querySelector('#selectBibleVersion, .version-picker');

    // Selector de Tipografía / Tipo de Letra
    this.selectFontFamily = c.querySelector('.config-select-font, #selectFontFamily, #selectChorusFontFamily, #selectPreachingFontFamily');

    // Controles de Tamaño de Letra
    this.btnFontDec = c.querySelector('.btn-font-dec, #btnFontDec, #btnChorusFontDec, #btnPreachingFontDec');
    this.btnFontInc = c.querySelector('.btn-font-inc, #btnFontInc, #btnChorusFontInc, #btnPreachingFontInc');
    this.fontSizeBadge = c.querySelector('.font-size-badge, #fontSizeBadge, #chorusFontSizeBadge, #preachingFontSizeBadge');

    // Mayúsculas
    this.checkUppercase = c.querySelector('#checkUppercase, #checkChorusUppercase, input[id*="Uppercase"]');

    // Mostrar sigla de versión (si aplica)
    this.checkShowTranslation = c.querySelector('#checkShowTranslation');
    this.labelShowTranslation = c.querySelector('#labelShowTranslation');

    // Atajos de Teclado
    this.btnShortcuts = c.querySelector('#btnOpenShortcutsModal, #btnOpenChorusShortcutsModal, .btn-icon-square');

    // Navegación
    this.btnPrev = c.querySelector('#btnPrevVerse, #btnPrevChorusSlide, #btnBottomPrevPreaching, .btn-nav:first-of-type');
    this.btnNext = c.querySelector('#btnNextVerse, #btnNextChorusSlide, #btnBottomNextPreaching, .btn-nav:last-of-type');

    // Botón Proyectar (si existe en la barra inferior)
    this.btnProject = c.querySelector('.btn-project-main, #btnProjectChorusSlideBottom, #btnBottomProjectPreaching');
  }

  /**
   * Inicializa la clase BackgroundPickerController (POO reutilizable)
   */
  initBackgroundPicker() {
    this.bgPicker = new BackgroundPickerController({
      settingKey: 'projection_custom_background',
      textColorKey: 'projection_text_color',
      modalId: 'projectionBgModal',
      triggerBtnId: this.btnBg ? this.btnBg.id : 'btnOpenBackgroundPicker',
      thumbElementId: this.thumbBg ? this.thumbBg.id : 'activeBgThumb',
      nameElementId: this.nameBg ? this.nameBg.id : 'activeBgName',
      btnWhiteId: this.btnWhite ? this.btnWhite.id : 'btnTextWhite',
      btnBlackId: this.btnBlack ? this.btnBlack.id : 'btnTextBlack',
      onBackgroundChange: async (bg) => {
        await this.onBackgroundChange(bg);
      },
      onTextColorChange: async (color) => {
        await this.onTextColorChange(color);
      }
    });
  }

  /**
   * Enlaza eventos de usuario a los controles de la barra
   */
  bindEvents() {
    // 1. Navegación Anterior / Siguiente
    this.btnPrev?.addEventListener('click', () => this.onPrev());
    this.btnNext?.addEventListener('click', () => this.onNext());
    this.btnProject?.addEventListener('click', () => this.onProject());

    // 2. Mayúsculas
    this.checkUppercase?.addEventListener('change', () => {
      this.onUppercaseChange(this.checkUppercase.checked);
    });

    // 3. Posición de la cita
    this.selectRefPos?.addEventListener('change', () => {
      this.onRefPositionChange(this.selectRefPos.value);
    });

    // 4. Versión Bíblica
    this.selectVersion?.addEventListener('change', () => {
      this.onVersionChange(this.selectVersion.value);
    });

    // 5. Mostrar versión
    this.checkShowTranslation?.addEventListener('change', () => {
      this.onShowTranslationChange(this.checkShowTranslation.checked);
    });

    // 6. Modal de atajos
    this.btnShortcuts?.addEventListener('click', () => {
      if (this.onOpenShortcuts) {
        this.onOpenShortcuts();
      } else {
        const modal = document.getElementById('shortcutsModal') || document.getElementById('chorusShortcutsModal');
        if (modal) modal.style.display = 'flex';
      }
    });

    // 7. Tamaño de Letra (A- / A+)
    this.btnFontDec?.addEventListener('click', () => this.decreaseFontSize());
    this.btnFontInc?.addEventListener('click', () => this.increaseFontSize());

    // 8. Tipo de Letra (Tipografía)
    this.selectFontFamily?.addEventListener('change', () => {
      this.setFontFamily(this.selectFontFamily.value);
    });

    // 9. Escuchar actualizaciones de emisión en tiempo real desde el Main Process
    if (window.bibleAPI?.projection?.onPreviewUpdate) {
      this._unsubscribePreview = window.bibleAPI.projection.onPreviewUpdate((state) => {
        this.applyStateUpdate(state);
      });
    }
  }

  /**
   * Sincroniza el estado de la barra con el servicio central de proyección
   */
  async syncWithProjectionService() {
    try {
      if (!window.bibleAPI?.projection?.getState) return;
      const state = await window.bibleAPI.projection.getState();
      this.applyStateUpdate(state);
    } catch (err) {
      console.warn('[ProjectionToolbarController] Error al sincronizar con ProjectionService:', err);
    }
  }

  /**
   * Aplica un estado de proyección a la interfaz de la barra
   */
  applyStateUpdate(state) {
    if (!state) return;

    // 1. Tally EN AIRE
    if (state.activeContent && !state.isBlackout) {
      const cite = state.activeContent.reference || state.activeContent.title || 'En Vivo';
      this.setLiveStatus(cite, true);
    } else {
      this.setLiveStatus('En espera', false);
    }

    // 2. Fondo Global Activo (Preservación entre módulos)
    if (state.currentBackground && this.bgPicker) {
      this.bgPicker.currentBackground = {
        fit: 'cover',
        scale: 100,
        position: 'center',
        opacity: 0.45,
        ...state.currentBackground
      };
      this.bgPicker.updateTriggerUI();
    }

    // 3. Color de Letra Global Activo
    if (state.currentTextColor && this.bgPicker) {
      this.bgPicker.textColor = state.currentTextColor;
      this.bgPicker.updateTextColorUI();
    }

    // 4. Tamaño de Letra Global Activo
    if (state.currentFontSize !== undefined) {
      this.updateFontSizeUI(state.currentFontSize);
    }

    // 5. Tipo de Letra Global Activo
    if (state.currentFontFamily) {
      this.updateFontFamilyUI(state.currentFontFamily);
    }
  }

  getCurrentFontSize() {
    try {
      const saved = localStorage.getItem('projection_font_size');
      if (saved) return parseInt(saved, 10) || 100;
    } catch {}
    return 100;
  }

  getCurrentFontFamily() {
    try {
      const saved = localStorage.getItem('projection_font_family');
      if (saved) return saved;
    } catch {}
    return 'sans-serif';
  }

  updateFontSizeUI(size) {
    if (this.fontSizeBadge) {
      this.fontSizeBadge.textContent = `${size}%`;
    }
  }

  updateFontFamilyUI(family) {
    if (this.selectFontFamily) {
      this.selectFontFamily.value = family;
    }
  }

  async setFontSize(newSize) {
    const clamped = Math.max(70, Math.min(180, newSize));
    this.updateFontSizeUI(clamped);
    try {
      localStorage.setItem('projection_font_size', String(clamped));
    } catch {}
    if (window.bibleAPI?.projection?.updateFontSize) {
      await window.bibleAPI.projection.updateFontSize(clamped);
    }
  }

  async increaseFontSize() {
    const current = parseInt(this.fontSizeBadge?.textContent, 10) || this.getCurrentFontSize();
    await this.setFontSize(current + 10);
  }

  async decreaseFontSize() {
    const current = parseInt(this.fontSizeBadge?.textContent, 10) || this.getCurrentFontSize();
    await this.setFontSize(current - 10);
  }

  async setFontFamily(newFamily) {
    const family = newFamily || 'sans-serif';
    this.updateFontFamilyUI(family);
    try {
      localStorage.setItem('projection_font_family', family);
    } catch {}
    if (window.bibleAPI?.projection?.updateFontFamily) {
      await window.bibleAPI.projection.updateFontFamily(family);
    }
  }

  /**
   * Actualiza el badge visual de "EN AIRE"
   */
  setLiveStatus(referenceText, isLive = true) {
    this.currentRefText = referenceText || 'En espera';
    this.isLive = Boolean(isLive && referenceText !== 'En espera');

    if (this.liveRef) {
      this.liveRef.textContent = this.currentRefText;
    }

    if (this.liveBadge) {
      if (this.isLive) {
        this.liveBadge.classList.add('live');
      } else {
        this.liveBadge.classList.remove('live');
      }
    }
  }

  // Getters para acceso limpio desde los controladores de módulos
  get currentBackground() {
    return this.bgPicker?.currentBackground || null;
  }

  get textColor() {
    return this.bgPicker?.textColor || 'white';
  }

  get isUppercase() {
    return Boolean(this.checkUppercase?.checked);
  }

  get refPosition() {
    return this.selectRefPos ? this.selectRefPos.value : 'bottom';
  }

  get selectedVersion() {
    return this.selectVersion ? this.selectVersion.value : 'RV1909';
  }

  get showTranslation() {
    return this.checkShowTranslation ? this.checkShowTranslation.checked : true;
  }

  /**
   * Libera recursos y desuscribe listeners
   */
  destroy() {
    if (typeof this._unsubscribePreview === 'function') {
      this._unsubscribePreview();
    }
    if (this.bgPicker?.destroy) {
      this.bgPicker.destroy();
    }
  }
}

