/**
 * BIBLE — Componente Reutilizable de Selección de Fondos de Proyección
 * Diseñado con arquitectura de clases orientada a objetos (POO / estilo Java).
 * Puede ser instanciado y reutilizado por cualquier módulo (Biblia, Coritos, Predicación).
 * Garantiza que el fondo permanezca activo y compartido durante todo el servicio eclesial.
 */
export class BackgroundPickerController {
  constructor(options = {}) {
    this.settingKey = options.settingKey || 'projection_custom_background';
    this.textColorKey = options.textColorKey || 'projection_text_color';
    this.modalId = options.modalId || 'projectionBgModal';
    this.triggerBtnId = options.triggerBtnId || 'btnOpenBackgroundPicker';
    this.thumbElementId = options.thumbElementId || 'activeBgThumb';
    this.nameElementId = options.nameElementId || 'activeBgName';
    this.btnWhiteId = options.btnWhiteId || 'btnTextWhite';
    this.btnBlackId = options.btnBlackId || 'btnTextBlack';

    this.onBackgroundChange = options.onBackgroundChange || (() => {});
    this.onTextColorChange = options.onTextColorChange || (() => {});

    // Estado interno
    this.currentBackground = {
      id: 'black',
      name: 'Negro Clásico',
      type: 'color',
      value: '#000000',
      fit: 'cover',
      scale: 100,
      position: 'center',
      opacity: 0.45
    };
    this.textColor = 'white';
    this.presetsLoaded = false;
    this._previewUnsubscribe = null;
    this._keydownHandler = null;
  }

  /**
   * Inicializa el componente: carga preferencias y enlaza eventos del DOM
   */
  async init() {
    this.cacheElements();
    await this.loadSettings();
    this.bindEvents();
    return this;
  }

  cacheElements() {
    this.modal = document.getElementById(this.modalId) ||
                 document.getElementById('projectionBgModal') ||
                 document.getElementById('bibleBgModal');

    this.triggerBtn = document.getElementById(this.triggerBtnId);
    this.thumbElement = document.getElementById(this.thumbElementId);
    this.nameElement = document.getElementById(this.nameElementId);
    this.btnTextWhite = document.getElementById(this.btnWhiteId);
    this.btnTextBlack = document.getElementById(this.btnBlackId);

    // Controles dentro del modal
    if (this.modal) {
      this.backdrop = this.modal.querySelector('.modal-backdrop, .bible-bg-modal-backdrop');
      this.btnClose = this.modal.querySelector('.btn-icon-close, #btnCloseBgModal');
      this.btnApply = this.modal.querySelector('#btnApplyAndCloseBg');
      this.presetsGrid = this.modal.querySelector('#bgPresetsGrid');
      this.btnBrowseLocal = this.modal.querySelector('#btnBrowseLocalBg');
      this.localFileStatus = this.modal.querySelector('#localFileStatus');
      this.inputUrl = this.modal.querySelector('#inputBgUrl');
      this.btnPasteUrl = this.modal.querySelector('#btnPasteBgUrl');
      this.btnApplyUrl = this.modal.querySelector('#btnApplyBgUrl');
      this.urlStatus = this.modal.querySelector('#urlStatusMessage');
      this.sliderScale = this.modal.querySelector('#sliderBgScale');
      this.labelScale = this.modal.querySelector('#bgScaleValueLabel');
      this.sliderScrim = this.modal.querySelector('#sliderBgScrim');
      this.labelScrim = this.modal.querySelector('#scrimValueLabel');
      this.btnModalTextWhite = this.modal.querySelector('#btnModalTextWhite');
      this.btnModalTextBlack = this.modal.querySelector('#btnModalTextBlack');
    }
  }

  async loadSettings() {
    try {
      // 1. Cargar fondo persistido (con fallback a la clave previa de biblia)
      let saved = await window.bibleAPI.db.getSetting(this.settingKey);
      if (!saved && this.settingKey !== 'bible_custom_background') {
        saved = await window.bibleAPI.db.getSetting('bible_custom_background');
      }

      if (saved) {
        this.currentBackground = {
          fit: 'cover',
          scale: 100,
          position: 'center',
          opacity: 0.45,
          ...saved
        };
      } else {
        // Consultar el estado activo de proyección si ya hay uno en el servicio
        const projState = await window.bibleAPI.projection.getState().catch(() => null);
        if (projState?.currentBackground) {
          this.currentBackground = {
            fit: 'cover',
            scale: 100,
            position: 'center',
            opacity: 0.45,
            ...projState.currentBackground
          };
        } else if (projState?.activeContent?.background) {
          const bg = projState.activeContent.background;
          this.currentBackground = {
            fit: 'cover',
            scale: 100,
            position: 'center',
            opacity: 0.45,
            ...(typeof bg === 'object' ? bg : { value: bg, type: 'gradient', name: 'Personalizado' })
          };
        }
      }
      this.updateTriggerUI();

      // 2. Cargar color de texto (con fallback a clave previa)
      let savedColor = await window.bibleAPI.db.getSetting(this.textColorKey);
      if (!savedColor && this.textColorKey !== 'bible_text_color') {
        savedColor = await window.bibleAPI.db.getSetting('bible_text_color');
      }
      if (savedColor === 'black' || savedColor === 'white') {
        this.textColor = savedColor;
      }
      this.updateTextColorUI();
    } catch (err) {
      console.warn('[BackgroundPickerController] Error al cargar configuración:', err);
    }
  }

  updateTriggerUI() {
    if (!this.nameElement || !this.currentBackground) return;
    this.nameElement.textContent = this.currentBackground.name || 'Personalizado';

    if (!this.thumbElement) return;
    if (this.currentBackground.type === 'color') {
      this.thumbElement.style.backgroundImage = 'none';
      this.thumbElement.style.backgroundColor = this.currentBackground.value || '#000000';
    } else if (this.currentBackground.type === 'gradient') {
      this.thumbElement.style.backgroundImage = this.currentBackground.value;
      this.thumbElement.style.backgroundColor = '#000000';
    } else if (this.currentBackground.type === 'image' && this.currentBackground.url) {
      this.thumbElement.style.backgroundImage = `url("${this.currentBackground.url}")`;
      this.thumbElement.style.backgroundColor = '#000000';
    } else if (this.currentBackground.type === 'video') {
      this.thumbElement.style.backgroundImage = 'linear-gradient(135deg, #1e1b4b, #0f172a)';
      this.thumbElement.style.backgroundColor = '#000000';
    }
  }

  updateTextColorUI() {
    const isWhite = this.textColor === 'white';
    if (this.btnTextWhite) this.btnTextWhite.classList.toggle('active', isWhite);
    if (this.btnTextBlack) this.btnTextBlack.classList.toggle('active', !isWhite);
    if (this.btnModalTextWhite) this.btnModalTextWhite.classList.toggle('active', isWhite);
    if (this.btnModalTextBlack) this.btnModalTextBlack.classList.toggle('active', !isWhite);
  }

  updateFitButtonsUI() {
    const activeFit = this.currentBackground?.fit || 'cover';
    const fitButtons = this.modal ? this.modal.querySelectorAll('.bg-fit-btn') : [];
    fitButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.fit === activeFit);
    });
  }

  async setBackground(bgObj) {
    const currentOpacity = this.currentBackground?.opacity !== undefined ? this.currentBackground.opacity : 0.45;
    const currentFit = this.currentBackground?.fit || 'cover';
    const currentScale = this.currentBackground?.scale !== undefined ? this.currentBackground.scale : 100;
    const currentPosition = this.currentBackground?.position || 'center';

    this.currentBackground = {
      ...bgObj,
      fit: currentFit,
      scale: currentScale,
      position: currentPosition,
      opacity: currentOpacity
    };
    this.updateTriggerUI();

    // Detección automática de fotos verticales (ej. volantes o capturas de celular)
    if (bgObj.type === 'image' && bgObj.url) {
      const img = new Image();
      img.onload = () => {
        const isVertical = img.naturalHeight > img.naturalWidth;
        if (isVertical && (!this.currentBackground.fit || this.currentBackground.fit === 'cover')) {
          this.currentBackground.fit = 'ambient';
          this.updateFitButtonsUI();
          window.bibleAPI.projection.updateBackground(this.currentBackground);
        }
      };
      img.src = bgObj.url;
    }

    try {
      await window.bibleAPI.db.setSetting('projection_custom_background', this.currentBackground);
      await window.bibleAPI.db.setSetting('bible_custom_background', this.currentBackground);
    } catch (err) {
      console.warn('[BackgroundPickerController] Error guardando fondo en BD:', err);
    }

    // Actualizar proyección en vivo
    try {
      await window.bibleAPI.projection.updateBackground(this.currentBackground);
    } catch {}

    // Notificar al controlador padre (ej. BibleController o ChorusesController)
    if (typeof this.onBackgroundChange === 'function') {
      await this.onBackgroundChange(this.currentBackground);
    }
  }

  async setTextColor(color) {
    this.textColor = color;
    this.updateTextColorUI();
    try {
      await window.bibleAPI.db.setSetting('projection_text_color', color);
      await window.bibleAPI.db.setSetting('bible_text_color', color);
    } catch (err) {
      console.warn('[BackgroundPickerController] Error guardando preferencia de color:', err);
    }

    try {
      if (window.bibleAPI.projection.updateTextColor) {
        await window.bibleAPI.projection.updateTextColor(color);
      }
    } catch {}

    if (typeof this.onTextColorChange === 'function') {
      await this.onTextColorChange(this.textColor);
    }
  }

  open() {
    if (!this.modal) {
      this.cacheElements();
    }
    if (!this.modal) return;
    this.modal.style.display = 'flex';
    this.syncModalControls();
    if (!this.presetsLoaded) {
      this.renderPresets();
      this.presetsLoaded = true;
    }
  }

  close() {
    if (!this.modal) return;
    this.modal.style.display = 'none';
  }

  syncModalControls() {
    this.updateFitButtonsUI();

    if (this.sliderScale && this.labelScale) {
      const scaleVal = this.currentBackground?.scale || 100;
      this.sliderScale.value = scaleVal;
      this.labelScale.textContent = `${scaleVal}%`;
    }

    if (this.sliderScrim && this.labelScrim) {
      const scrimVal = Math.round((this.currentBackground?.opacity !== undefined ? this.currentBackground.opacity : 0.45) * 100);
      this.sliderScrim.value = scrimVal;
      this.labelScrim.textContent = `${scrimVal}%`;
    }

    if (this.modal) {
      const posButtons = this.modal.querySelectorAll('.bg-pos-btn');
      const curPos = this.currentBackground?.position || 'center';
      posButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.pos === curPos));
    }

    if (this.inputUrl && this.currentBackground?.originalUrl) {
      this.inputUrl.value = this.currentBackground.originalUrl;
    }
  }

  async renderPresets() {
    if (!this.presetsGrid) return;
    this.presetsGrid.innerHTML = '';

    try {
      const presets = await window.bibleAPI.bible.getBackgroundPresets();
      presets.forEach(p => {
        const card = document.createElement('div');
        const isActive = this.currentBackground && (this.currentBackground.id === p.id || this.currentBackground.value === p.value);
        card.className = `bg-preset-card ${isActive ? 'active' : ''}`;
        if (p.type === 'color') {
          card.style.backgroundColor = p.value;
        } else {
          card.style.backgroundImage = p.value;
        }
        card.innerHTML = `<span class="bg-preset-name">${p.name}</span>`;

        card.addEventListener('click', async () => {
          await this.setBackground(p);
          const allCards = this.presetsGrid.querySelectorAll('.bg-preset-card');
          allCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
        this.presetsGrid.appendChild(card);
      });
    } catch (err) {
      console.warn('[BackgroundPickerController] Error al renderizar preajustes:', err);
    }
  }

  bindEvents() {
    // Abrir modal desde el botón pill de la barra inferior
    if (this.triggerBtn) {
      this.triggerBtn.addEventListener('click', () => this.open());
    }

    // Cerrar modal
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.btnApply) this.btnApply.addEventListener('click', () => this.close());
    if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());

    // Pestañas (Presets / Local / URL)
    if (this.modal) {
      const tabs = this.modal.querySelectorAll('.bg-source-tab, .modal-tab-btn');
      const tabPresets = this.modal.querySelector('#tabContentPresets');
      const tabLocal = this.modal.querySelector('#tabContentLocal');
      const tabUrl = this.modal.querySelector('#tabContentUrl');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const target = tab.dataset.tab;
          if (tabPresets) tabPresets.style.display = target === 'presets' ? 'block' : 'none';
          if (tabLocal) tabLocal.style.display = target === 'local' ? 'block' : 'none';
          if (tabUrl) tabUrl.style.display = target === 'url' ? 'block' : 'none';
        });
      });
    }

    // Archivo Local
    if (this.btnBrowseLocal) {
      this.btnBrowseLocal.addEventListener('click', async () => {
        try {
          const res = await window.bibleAPI.bible.selectBackgroundFile();
          if (res && res.success) {
            await this.setBackground(res);
            if (this.localFileStatus) {
              this.localFileStatus.style.display = 'block';
              this.localFileStatus.textContent = `✓ Fondo cargado: ${res.name} (${res.type.toUpperCase()})`;
            }
          }
        } catch (err) {
          console.error('[BackgroundPickerController] Error seleccionando archivo local:', err);
        }
      });
    }

    // Pegar URL desde portapapeles
    if (this.btnPasteUrl) {
      this.btnPasteUrl.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text && this.inputUrl) {
            this.inputUrl.value = text.trim();
            this.inputUrl.focus();
            this.btnApplyUrl?.click();
          }
        } catch (err) {
          console.warn('[BackgroundPickerController] No se pudo leer del portapapeles:', err);
          this.inputUrl?.focus();
        }
      });
    }

    // Enlace Web
    if (this.inputUrl) {
      this.inputUrl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.btnApplyUrl?.click();
        }
      });
    }

    if (this.btnApplyUrl) {
      this.btnApplyUrl.addEventListener('click', async () => {
        const url = this.inputUrl?.value?.trim();
        if (!url) return;

        try {
          if (this.urlStatus) {
            this.urlStatus.style.display = 'block';
            this.urlStatus.textContent = 'Descargando y verificando fondo web...';
            this.urlStatus.style.color = 'var(--text-muted)';
            this.urlStatus.style.borderColor = 'var(--border-subtle)';
          }

          const res = await window.bibleAPI.bible.processUrlBackground(url);
          if (res && res.success) {
            await this.setBackground(res);
            if (this.urlStatus) {
              this.urlStatus.textContent = `✓ Fondo web listo: ${res.name}`;
              this.urlStatus.style.color = 'var(--status-live)';
              this.urlStatus.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            }
          } else {
            if (this.urlStatus) {
              this.urlStatus.textContent = res?.error || 'No se pudo procesar la URL proporcionada.';
              this.urlStatus.style.color = 'var(--status-blackout)';
              this.urlStatus.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }
          }
        } catch (err) {
          console.error('[BackgroundPickerController] Error procesando URL:', err);
          if (this.urlStatus) {
            this.urlStatus.textContent = 'Error de conexión al descargar la imagen/video web.';
            this.urlStatus.style.color = 'var(--status-blackout)';
          }
        }
      });
    }

    // Botones de Modo de Ajuste (Cover / Ambient / Contain / Fill)
    if (this.modal) {
      const fitButtons = this.modal.querySelectorAll('.bg-fit-btn');
      fitButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
          fitButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const fitMode = btn.dataset.fit;
          if (this.currentBackground) {
            this.currentBackground.fit = fitMode;
            try {
              await window.bibleAPI.db.setSetting('projection_custom_background', this.currentBackground);
              await window.bibleAPI.db.setSetting('bible_custom_background', this.currentBackground);
            } catch {}
            await window.bibleAPI.projection.updateBackground(this.currentBackground);
            if (typeof this.onBackgroundChange === 'function') {
              await this.onBackgroundChange(this.currentBackground);
            }
          }
        });
      });

      // Deslizador de Escala / Zoom (70% a 150%)
      if (this.sliderScale) {
        this.sliderScale.addEventListener('input', async (e) => {
          const scaleVal = parseInt(e.target.value, 10);
          if (this.labelScale) this.labelScale.textContent = `${scaleVal}%`;
          if (this.currentBackground) {
            this.currentBackground.scale = scaleVal;
            try {
              await window.bibleAPI.db.setSetting('projection_custom_background', this.currentBackground);
              await window.bibleAPI.db.setSetting('bible_custom_background', this.currentBackground);
            } catch {}
            await window.bibleAPI.projection.updateBackground(this.currentBackground);
          }
        });
      }

      // Botones de Posición Vertical
      const posButtons = this.modal.querySelectorAll('.bg-pos-btn');
      posButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
          posButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const pos = btn.dataset.pos;
          if (this.currentBackground) {
            this.currentBackground.position = pos;
            try {
              await window.bibleAPI.db.setSetting('projection_custom_background', this.currentBackground);
              await window.bibleAPI.db.setSetting('bible_custom_background', this.currentBackground);
            } catch {}
            await window.bibleAPI.projection.updateBackground(this.currentBackground);
          }
        });
      });

      // Deslizador Scrim (Oscurecimiento)
      if (this.sliderScrim) {
        this.sliderScrim.addEventListener('input', async (e) => {
          const val = parseInt(e.target.value, 10);
          const opacity = val / 100;
          if (this.labelScrim) this.labelScrim.textContent = `${val}%`;
          if (this.currentBackground) {
            this.currentBackground.opacity = opacity;
            try {
              await window.bibleAPI.db.setSetting('projection_custom_background', this.currentBackground);
              await window.bibleAPI.db.setSetting('bible_custom_background', this.currentBackground);
            } catch {}
            await window.bibleAPI.projection.updateBackground(this.currentBackground);
          }
        });
      }
    }

    // Toggle de Color de Letra
    const setupColorBtn = (btn, color) => {
      if (btn) btn.addEventListener('click', async () => await this.setTextColor(color));
    };
    setupColorBtn(this.btnTextWhite, 'white');
    setupColorBtn(this.btnTextBlack, 'black');
    setupColorBtn(this.btnModalTextWhite, 'white');
    setupColorBtn(this.btnModalTextBlack, 'black');

    // Sincronización en tiempo real con emisión de fondo si cambia externamente
    if (window.bibleAPI?.projection?.onPreviewUpdate) {
      this._previewUnsubscribe = window.bibleAPI.projection.onPreviewUpdate((state) => {
        if (state?.currentBackground) {
          const updated = state.currentBackground;
          if (JSON.stringify(updated) !== JSON.stringify(this.currentBackground)) {
            this.currentBackground = updated;
            this.updateTriggerUI();
            this.syncModalControls();
          }
        }
        if (state?.currentTextColor && state.currentTextColor !== this.textColor) {
          this.textColor = state.currentTextColor;
          this.updateTextColorUI();
        }
      });
    }

    // Atajos de teclado del selector de fondo
    this._keydownHandler = (e) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape' && this.modal && this.modal.style.display !== 'none') {
          this.close();
        }
        return;
      }

      if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        if (this.modal && this.modal.style.display !== 'none') {
          this.close();
        } else {
          this.open();
        }
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        const nextColor = this.textColor === 'white' ? 'black' : 'white';
        this.setTextColor(nextColor);
      } else if (e.key === 'Escape' && this.modal && this.modal.style.display !== 'none') {
        e.preventDefault();
        this.close();
      }
    };
    window.addEventListener('keydown', this._keydownHandler);
  }

  destroy() {
    if (this._previewUnsubscribe) {
      try { this._previewUnsubscribe(); } catch {}
    }
    if (this._keydownHandler) {
      window.removeEventListener('keydown', this._keydownHandler);
    }
  }
}
