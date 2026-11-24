import { ProjectionToolbarController } from '../../../shared/js/projection-toolbar.js';

/**
 * BIBLE — PreachingController
 * Controlador para la proyección de sermones, navegación de diapositivas y alternancia con Biblia.
 * Soporta fidelidad gráfica al 100% de la presentación original y modo alternativo con fondo del culto.
 */
export class PreachingController {
  constructor() {
    this.presentations = [];
    this.currentPreaching = null;
    this.activeSlideIndex = 0;
    this.isProjecting = false;
    this.currentRenderMode = 'original'; // 'original' | 'church_bg'

    // Elementos DOM principales
    this.listContainer = document.getElementById('presentationsListContainer');
    this.slidesContainer = document.getElementById('deckSlidesContainer');
    this.titleHeading = document.getElementById('currentPreachingTitle');
    this.metaLabel = document.getElementById('currentPreachingMeta');
    this.slideIndicator = document.getElementById('slideIndicatorBadge');
    this.preachingCountHeader = document.getElementById('preachingCountHeader');

    // Buscador de sermones
    this.inputSearch = document.getElementById('inputPreachingSearch');
    this.btnClearSearch = document.getElementById('btnClearPreachingSearch');

    // Botones de navegación y acción
    this.btnPrev = document.getElementById('btnPrevSlide');
    this.btnNext = document.getElementById('btnNextSlide');
    this.btnProject = document.getElementById('btnProjectSlideDirect');
    this.btnResume = document.getElementById('btnResumePreaching');
    this.btnImport = document.getElementById('btnImportPresentation');
    this.btnDelete = document.getElementById('btnDeletePreaching');
    this.btnSwitchBible = document.getElementById('btnSwitchToBible');

    // Selector de modo de fondo (Original vs Fondo del Culto)
    this.btnModeOriginal = document.getElementById('btnModeOriginal');
    this.btnModeChurchBg = document.getElementById('btnModeChurchBg');

    // Elementos de la Barra Inferior Estandarizada
    this.liveStatusBadge = document.getElementById('liveStatusBadgePreaching');
    this.liveStatusRef = document.getElementById('liveStatusPreachingRef');
    this.btnBottomPrev = document.getElementById('btnBottomPrevPreaching');
    this.btnBottomNext = document.getElementById('btnBottomNextPreaching');
    this.btnBottomProject = document.getElementById('btnBottomProjectPreaching');

    this.init();
  }

  async init() {
    this.bindEvents();

    // Inicializar componente reutilizable de Barra de Emisión y Fondo (POO)
    this.toolbar = new ProjectionToolbarController({
      container: document.querySelector('.preaching-bottom-bar'),
      module: 'preaching',
      onPrev: () => this.prev(),
      onNext: () => this.next(),
      onProject: () => this.projectCurrentSlide(),
      onUppercaseChange: async () => {
        if (this.isProjecting) {
          await this.projectCurrentSlide();
        }
      },
      onBackgroundChange: async () => {
        if (this.isProjecting) {
          await this.projectCurrentSlide();
        }
      },
      onTextColorChange: async () => {
        if (this.isProjecting) {
          await this.projectCurrentSlide();
        }
      }
    });
    await this.toolbar.init();
    this.bgPicker = this.toolbar.bgPicker;

    await this.loadPresentations();
  }

  async loadPresentations() {
    try {
      this.presentations = await window.bibleAPI.preaching.getAll();
      this.renderList();
      if (this.presentations.length > 0) {
        // Seleccionar la primera presentación y restaurar su última diapositiva memorizada
        const defaultPres = this.presentations[0];
        await this.selectPresentation(defaultPres.id, defaultPres.last_slide_index || 0);
      }
    } catch (err) {
      console.error('[PreachingController] Error al cargar presentaciones:', err);
    }
  }

  renderList(filteredItems = null) {
    const items = filteredItems || this.presentations;
    this.listContainer.innerHTML = '';

    if (this.preachingCountHeader) {
      this.preachingCountHeader.textContent = `Biblioteca de Sermones (${this.presentations.length})`;
    }

    if (!items.length) {
      this.listContainer.innerHTML = `
        <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
          <svg class="icon" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M6 6h10M6 10h10"/></svg>
          <div style="font-weight: 600; color: var(--text-primary);">No hay sermones disponibles</div>
          <div style="margin-top: 6px; font-size: 11px;">Haz clic en <strong>"Importar Presentación"</strong> para cargar un archivo PDF o PowerPoint con todas sus diapositivas e imágenes.</div>
        </div>
      `;
      return;
    }

    items.forEach(p => {
      const card = document.createElement('div');
      card.className = `presentation-item-card ${this.currentPreaching && this.currentPreaching.id === p.id ? 'active' : ''}`;
      card.dataset.id = p.id;
      
      const speakerInfo = p.preacher ? `<span style="color: var(--text-secondary); font-size: 10.5px; font-weight: 600;">• ${p.preacher}</span>` : '';
      const bibleInfo = p.bible_passage ? `<span style="color: var(--accent-primary); font-size: 10.5px; font-weight: 700;">(${p.bible_passage})</span>` : '';

      card.innerHTML = `
        <div class="presentation-card-header">
          <span class="presentation-card-title">${p.title}</span>
          <span class="format-badge ${p.file_type}">${p.file_type.toUpperCase()}</span>
        </div>
        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span>${p.slide_count} diapositivas</span>
          ${speakerInfo}
          ${bibleInfo}
        </div>
      `;

      card.addEventListener('click', () => this.selectPresentation(p.id, p.last_slide_index || 0));
      this.listContainer.appendChild(card);
    });
  }

  filterPresentations(queryText) {
    const q = (queryText || '').toLowerCase().trim();
    if (this.btnClearSearch) {
      this.btnClearSearch.style.display = q ? 'block' : 'none';
    }

    if (!q) {
      this.renderList();
      return;
    }

    const filtered = this.presentations.filter(p => {
      const title = (p.title || '').toLowerCase();
      const preacher = (p.preacher || '').toLowerCase();
      const bible = (p.bible_passage || '').toLowerCase();
      return title.includes(q) || preacher.includes(q) || bible.includes(q);
    });

    this.renderList(filtered);
  }

  async selectPresentation(id, targetSlideIndex = 0) {
    try {
      const detailed = await window.bibleAPI.preaching.getById(id);
      if (!detailed) return;

      this.currentPreaching = detailed;
      this.activeSlideIndex = Math.min(targetSlideIndex, Math.max(detailed.slides.length - 1, 0));
      this.currentRenderMode = detailed.render_mode || 'original';
      this.updateRenderModeButtons();

      // Actualizar tarjeta activa en lista
      const cards = this.listContainer.querySelectorAll('.presentation-item-card');
      cards.forEach(c => {
        if (parseInt(c.dataset.id, 10) === id) c.classList.add('active');
        else c.classList.remove('active');
      });

      this.titleHeading.textContent = detailed.title;
      const speakerTxt = detailed.preacher ? ` • Predicador: ${detailed.preacher}` : '';
      const bibleTxt = detailed.bible_passage ? ` • Pasaje: ${detailed.bible_passage}` : '';
      this.metaLabel.textContent = `${detailed.slide_count} Diapositivas (${detailed.file_type.toUpperCase()})${speakerTxt}${bibleTxt}`;

      this.renderSlides(detailed.slides || []);
      this.updateIndicator();
    } catch (err) {
      console.error('[PreachingController] Error al seleccionar presentación:', err);
    }
  }

  updateRenderModeButtons() {
    if (this.btnModeOriginal && this.btnModeChurchBg) {
      const isOriginal = this.currentRenderMode === 'original';
      this.btnModeOriginal.classList.toggle('active', isOriginal);
      this.btnModeChurchBg.classList.toggle('active', !isOriginal);
    }
  }

  async switchRenderMode(newMode) {
    if (!this.currentPreaching) return;
    this.currentRenderMode = newMode;
    this.updateRenderModeButtons();

    await window.bibleAPI.preaching.updateRenderMode(this.currentPreaching.id, newMode);

    if (this.isProjecting) {
      await this.projectCurrentSlide();
    }
  }

  renderSlides(slides) {
    this.slidesContainer.innerHTML = '';
    if (!slides.length) {
      this.slidesContainer.innerHTML = `
        <div style="padding: 24px; color: var(--text-muted); text-align: center;">
          Esta presentación no contiene diapositivas procesables.
        </div>
      `;
      return;
    }

    slides.forEach((slide, index) => {
      const card = document.createElement('div');
      card.className = `deck-slide-card ${index === this.activeSlideIndex ? 'active' : ''}`;
      card.dataset.slideIndex = index;

      const slideTitle = slide.slide_title || slide.title || `Diapositiva ${index + 1}`;
      const slideSnippet = slide.slide_text || slide.text || slide.notes || '';

      if (slide.image_url) {
        // DIAPOSITIVA CON IMAGEN REAL FIEL AL PREDICADOR (PDF / PPTX / IMÁGENES)
        card.innerHTML = `
          <div class="slide-num-chip">#${index + 1}</div>
          <img class="deck-slide-img" src="${slide.image_url}" alt="${slideTitle}" loading="lazy">
        `;
      } else {
        // DIAPOSITIVA DE TEXTO / BOSQUEJO
        card.innerHTML = `
          <div class="slide-num-chip">#${index + 1}</div>
          <div class="slide-text-preview">
            <span class="slide-preview-title">${slideTitle}</span>
            <span class="slide-preview-snippet">${slideSnippet}</span>
          </div>
        `;
      }

      card.title = `${slideTitle}\n${slideSnippet}`;

      card.addEventListener('click', () => {
        this.selectSlide(index);
        this.projectCurrentSlide();
      });

      this.slidesContainer.appendChild(card);
    });
  }

  selectSlide(index) {
    if (!this.currentPreaching || !this.currentPreaching.slides) return;
    if (index < 0 || index >= this.currentPreaching.slides.length) return;

    this.activeSlideIndex = index;

    const cards = this.slidesContainer.querySelectorAll('.deck-slide-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });

    this.updateIndicator();

    if (this.isProjecting) {
      this.projectCurrentSlide();
    }
  }

  updateIndicator() {
    if (!this.currentPreaching || !this.currentPreaching.slides) {
      this.slideIndicator.textContent = '—';
      return;
    }
    this.slideIndicator.textContent = `Diapositiva ${this.activeSlideIndex + 1} de ${this.currentPreaching.slides.length}`;
  }

  next() {
    if (!this.currentPreaching || !this.currentPreaching.slides) return;
    if (this.activeSlideIndex < this.currentPreaching.slides.length - 1) {
      this.selectSlide(this.activeSlideIndex + 1);
    }
  }

  prev() {
    if (!this.currentPreaching || !this.currentPreaching.slides) return;
    if (this.activeSlideIndex > 0) {
      this.selectSlide(this.activeSlideIndex - 1);
    }
  }

  async projectCurrentSlide() {
    if (!this.currentPreaching) return;

    await window.bibleAPI.preaching.projectSlide(
      this.currentPreaching.id,
      this.activeSlideIndex,
      this.currentRenderMode
    );

    this.isProjecting = true;

    // Actualizar indicador EN AIRE en la barra inferior
    const modeLabel = this.currentRenderMode === 'original' ? 'Original' : 'Fondo Culto';
    if (this.liveStatusRef) {
      this.liveStatusRef.textContent = `${this.currentPreaching.title} [D${this.activeSlideIndex + 1}/${this.currentPreaching.slide_count}] (${modeLabel})`;
    }
    if (this.liveStatusBadge) {
      this.liveStatusBadge.classList.add('live');
    }

    // Resaltar diapositiva proyectada en vivo en la cuadrícula del operador
    const cards = this.slidesContainer.querySelectorAll('.deck-slide-card');
    cards.forEach((card, idx) => {
      if (idx === this.activeSlideIndex) card.classList.add('projected');
      else card.classList.remove('projected');
    });
  }

  async resume() {
    if (!this.currentPreaching) return;
    await window.bibleAPI.preaching.resume();
    this.isProjecting = true;
    this.selectSlide(this.activeSlideIndex);
  }

  async importFile() {
    try {
      if (this.btnImport) {
        this.btnImport.textContent = 'Procesando presentación...';
        this.btnImport.disabled = true;
      }

      const imported = await window.bibleAPI.preaching.importFile();
      if (imported) {
        await this.loadPresentations();
        await this.selectPresentation(imported.id, 0);
      }
    } catch (err) {
      alert(`Error al importar presentación: ${err.message}`);
    } finally {
      if (this.btnImport) {
        this.btnImport.innerHTML = `
          <svg class="icon icon-sm" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" x2="12" y1="3" y2="15"/>
          </svg>
          <span>Importar Presentación (Imágenes / PDF / PPTX)</span>
        `;
        this.btnImport.disabled = false;
      }
    }
  }

  async deleteCurrent() {
    if (!this.currentPreaching) return;
    if (!confirm(`¿Eliminar la presentación "${this.currentPreaching.title}"?`)) return;

    try {
      await window.bibleAPI.preaching.delete(this.currentPreaching.id);
      await this.loadPresentations();
    } catch (err) {
      alert(err.message);
    }
  }

  bindEvents() {
    this.btnPrev?.addEventListener('click', () => this.prev());
    this.btnNext?.addEventListener('click', () => this.next());
    this.btnProject?.addEventListener('click', () => this.projectCurrentSlide());
    this.btnResume?.addEventListener('click', () => this.resume());
    this.btnImport?.addEventListener('click', () => this.importFile());
    this.btnDelete?.addEventListener('click', () => this.deleteCurrent());

    // Barra inferior
    this.btnBottomPrev?.addEventListener('click', () => this.prev());
    this.btnBottomNext?.addEventListener('click', () => this.next());
    this.btnBottomProject?.addEventListener('click', () => this.projectCurrentSlide());

    // Buscador
    this.inputSearch?.addEventListener('input', () => {
      this.filterPresentations(this.inputSearch.value);
    });

    this.btnClearSearch?.addEventListener('click', () => {
      if (this.inputSearch) this.inputSearch.value = '';
      this.filterPresentations('');
      this.inputSearch?.focus();
    });

    // Alternancia de modo: Original vs Fondo del Culto
    this.btnModeOriginal?.addEventListener('click', () => this.switchRenderMode('original'));
    this.btnModeChurchBg?.addEventListener('click', () => this.switchRenderMode('church_bg'));

    // Botón de alternancia rápida a la Biblia
    this.btnSwitchBible?.addEventListener('click', () => {
      const bibleBtn = document.querySelector('.nav-item[data-module="bible"]');
      if (bibleBtn) bibleBtn.click();
    });

    // Navegación por teclado
    window.addEventListener('keydown', (e) => {
      const activeNav = document.querySelector('.nav-item.active');
      if (activeNav && activeNav.dataset.module !== 'preaching') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.projectCurrentSlide();
      }
    });

    // Control Remoto Móvil (Atril / Púlpito)
    window.addEventListener('remote-control:action', (e) => {
      if (e.detail?.action === 'next') {
        this.next();
      } else if (e.detail?.action === 'prev') {
        this.prev();
      }
    });
  }
}
