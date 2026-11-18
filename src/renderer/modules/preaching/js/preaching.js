/**
 * BIBLE — PreachingController
 * Controlador para la proyección de sermones, navegación de diapositivas y alternancia con Biblia.
 */
export class PreachingController {
  constructor() {
    this.presentations = [];
    this.currentPreaching = null;
    this.activeSlideIndex = 0;
    this.isProjecting = false;

    // Elementos DOM
    this.listContainer = document.getElementById('presentationsListContainer');
    this.slidesContainer = document.getElementById('deckSlidesContainer');
    this.titleHeading = document.getElementById('currentPreachingTitle');
    this.metaLabel = document.getElementById('currentPreachingMeta');
    this.slideIndicator = document.getElementById('slideIndicatorBadge');

    this.btnPrev = document.getElementById('btnPrevSlide');
    this.btnNext = document.getElementById('btnNextSlide');
    this.btnProject = document.getElementById('btnProjectSlideDirect');
    this.btnResume = document.getElementById('btnResumePreaching');
    this.btnImport = document.getElementById('btnImportPresentation');
    this.btnDelete = document.getElementById('btnDeletePreaching');
    this.btnSwitchBible = document.getElementById('btnSwitchToBible');

    this.init();
  }

  async init() {
    this.bindEvents();
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

  renderList() {
    this.listContainer.innerHTML = '';
    if (!this.presentations.length) {
      this.listContainer.innerHTML = `
        <div style="padding: 20px; color: var(--text-muted); text-align: center; font-size: 13px;">
          No hay presentaciones importadas. Haz clic en "Importar" para agregar un archivo PDF o PowerPoint.
        </div>
      `;
      return;
    }

    this.presentations.forEach(p => {
      const card = document.createElement('div');
      card.className = `presentation-item-card ${this.currentPreaching && this.currentPreaching.id === p.id ? 'active' : ''}`;
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="presentation-card-header">
          <span class="presentation-card-title">${p.title}</span>
          <span class="format-badge ${p.file_type}">${p.file_type.toUpperCase()}</span>
        </div>
        <div style="font-size: 11px; color: var(--text-secondary);">
          ${p.slide_count} diapositivas • Última: #${(p.last_slide_index || 0) + 1}
        </div>
      `;

      card.addEventListener('click', () => this.selectPresentation(p.id, p.last_slide_index || 0));
      this.listContainer.appendChild(card);
    });
  }

  async selectPresentation(id, targetSlideIndex = 0) {
    try {
      const detailed = await window.bibleAPI.preaching.getById(id);
      if (!detailed) return;

      this.currentPreaching = detailed;
      this.activeSlideIndex = Math.min(targetSlideIndex, Math.max(detailed.slides.length - 1, 0));

      // Actualizar tarjeta activa en lista
      const cards = this.listContainer.querySelectorAll('.presentation-item-card');
      cards.forEach(c => {
        if (parseInt(c.dataset.id, 10) === id) c.classList.add('active');
        else c.classList.remove('active');
      });

      this.titleHeading.textContent = detailed.title;
      this.metaLabel.textContent = `Archivo: ${detailed.original_filename} (${detailed.file_type.toUpperCase()})`;

      this.renderSlides(detailed.slides || []);
      this.updateIndicator();
    } catch (err) {
      console.error('[PreachingController] Error al seleccionar presentación:', err);
    }
  }

  renderSlides(slides) {
    this.slidesContainer.innerHTML = '';
    if (!slides.length) {
      this.slidesContainer.innerHTML = `
        <div style="padding: 20px; color: var(--text-muted); text-align: center;">
          Esta presentación no contiene diapositivas válidas.
        </div>
      `;
      return;
    }

    slides.forEach((slide, index) => {
      const card = document.createElement('div');
      card.className = `deck-slide-card ${index === this.activeSlideIndex ? 'active' : ''}`;
      card.dataset.index = index;
      card.innerHTML = `
        <div class="deck-slide-header">
          <span class="deck-slide-num">#${index + 1}</span>
          <span style="font-size: 10px; color: var(--text-muted);">16:9</span>
        </div>
        <div class="deck-slide-body">
          ${slide.notes || `Diapositiva ${index + 1}`}
        </div>
        <div class="deck-slide-notes">
          ${this.currentPreaching.title}
        </div>
      `;

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
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      this.activeSlideIndex
    );

    this.isProjecting = true;

    // Resaltar diapositiva proyectada en vivo
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
      const imported = await window.bibleAPI.preaching.importFile();
      if (imported) {
        await this.loadPresentations();
        await this.selectPresentation(imported.id, 0);
      }
    } catch (err) {
      alert(`Error al importar presentación: ${err.message}`);
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
    this.btnPrev.addEventListener('click', () => this.prev());
    this.btnNext.addEventListener('click', () => this.next());
    this.btnProject.addEventListener('click', () => this.projectCurrentSlide());
    this.btnResume.addEventListener('click', () => this.resume());
    this.btnImport.addEventListener('click', () => this.importFile());
    this.btnDelete.addEventListener('click', () => this.deleteCurrent());

    // Botón de alternancia rápida a la Biblia
    this.btnSwitchBible.addEventListener('click', () => {
      // Disparar evento para que el Shell cambie a la pestaña Biblia
      const bibleBtn = document.querySelector('.nav-item[data-module="bible"]');
      if (bibleBtn) bibleBtn.click();
    });

    // Navegación por teclado
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.projectCurrentSlide();
      }
    });
  }
}

