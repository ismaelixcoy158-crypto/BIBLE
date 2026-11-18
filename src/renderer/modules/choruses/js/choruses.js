/**
 * BIBLE — ChorusesController
 * Controlador para la búsqueda en Modo Espontáneo, administración de letras y partición de diapositivas.
 */
export class ChorusesController {
  constructor() {
    this.choruses = [];
    this.currentChorus = null;
    this.selectedSlideIndex = 0;
    this.isCurrentlyProjecting = false;
    this.editingChorusId = null;

    // Elementos DOM
    this.searchInput = document.getElementById('spontaneousSearchInput');
    this.chorusesList = document.getElementById('chorusesListContainer');
    this.detailTitle = document.getElementById('detailChorusTitle');
    this.detailCategory = document.getElementById('detailChorusCategory');
    this.slidesContainer = document.getElementById('slidesGridContainer');

    this.btnProjectSlide = document.getElementById('btnProjectActiveSlide');
    this.btnOpenModal = document.getElementById('btnOpenNewChorusModal');
    this.btnEdit = document.getElementById('btnEditCurrentChorus');
    this.btnDelete = document.getElementById('btnDeleteCurrentChorus');

    // Modal
    this.modal = document.getElementById('chorusEditorModal');
    this.modalTitle = document.getElementById('modalChorusTitle');
    this.inputTitle = document.getElementById('editChorusTitleInput');
    this.selectCategory = document.getElementById('editChorusCategorySelect');
    this.textareaLyrics = document.getElementById('editChorusLyricsTextarea');
    this.btnSave = document.getElementById('btnSaveChorus');
    this.btnCloseModal = document.getElementById('btnCloseChorusModal');
    this.btnCancelModal = document.getElementById('btnCancelEditChorus');

    // Pestañas
    this.tabs = [
      document.getElementById('tabCatAll'),
      document.getElementById('tabCatPentecostal'),
      document.getElementById('tabCatWorship'),
      document.getElementById('tabCatPlaylists')
    ];
    this.currentCategoryFilter = '';

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadChoruses();
  }

  async loadChoruses(categoryId = null) {
    try {
      this.choruses = await window.bibleAPI.choruses.getAll(categoryId);
      this.renderChorusesList(this.choruses);
      if (this.choruses.length > 0) {
        await this.selectChorus(this.choruses[0].id);
      }
    } catch (err) {
      console.error('[ChorusesController] Error al cargar coritos:', err);
    }
  }

  renderChorusesList(list) {
    this.chorusesList.innerHTML = '';
    if (!list || !list.length) {
      this.chorusesList.innerHTML = `
        <div style="padding: 20px; color: var(--text-muted); text-align: center; font-size: 13px;">
          No se encontraron coritos coincidentes.
        </div>
      `;
      return;
    }

    list.forEach(c => {
      const card = document.createElement('div');
      card.className = `chorus-item-card ${this.currentChorus && this.currentChorus.id === c.id ? 'active' : ''}`;
      card.dataset.id = c.id;

      let snippetHtml = '';
      if (c.match_snippet) {
        snippetHtml = `<div class="chorus-card-snippet">${c.match_snippet}</div>`;
      } else {
        const previewText = c.lyrics.split('\n')[0] || '';
        snippetHtml = `<div class="chorus-card-snippet">${previewText}</div>`;
      }

      card.innerHTML = `
        <div class="chorus-card-header">
          <span class="chorus-card-title">${c.title}</span>
          <span class="chorus-card-tag" style="color: ${c.category_color || 'var(--accent-primary)'};">
            ${c.category_name || 'Corito'}
          </span>
        </div>
        ${snippetHtml}
      `;

      card.addEventListener('click', () => this.selectChorus(c.id));
      this.chorusesList.appendChild(card);
    });
  }

  async selectChorus(chorusId) {
    try {
      const detailed = await window.bibleAPI.choruses.getById(chorusId);
      if (!detailed) return;

      this.currentChorus = detailed;
      this.selectedSlideIndex = 0;

      // Actualizar tarjeta activa en lista
      const cards = this.chorusesList.querySelectorAll('.chorus-item-card');
      cards.forEach(card => {
        if (parseInt(card.dataset.id, 10) === chorusId) card.classList.add('active');
        else card.classList.remove('active');
      });

      this.detailTitle.textContent = detailed.title;
      this.detailCategory.textContent = detailed.category_name || 'Alabanza';

      this.renderSlides(detailed.slides || []);
    } catch (err) {
      console.error('[ChorusesController] Error al seleccionar corito:', err);
    }
  }

  renderSlides(slides) {
    this.slidesContainer.innerHTML = '';
    if (!slides.length) {
      this.slidesContainer.innerHTML = `
        <div style="padding: 20px; color: var(--text-muted); text-align: center;">
          Este corito no contiene diapositivas válidas.
        </div>
      `;
      return;
    }

    slides.forEach((slideText, index) => {
      const slideCard = document.createElement('div');
      slideCard.className = `slide-card ${index === this.selectedSlideIndex ? 'active' : ''}`;
      slideCard.dataset.slideIndex = index;
      slideCard.innerHTML = `
        <div class="slide-num-badge">Diapositiva ${index + 1} de ${slides.length}</div>
        <div class="slide-body-text">${slideText}</div>
        <div style="font-size: 10px; color: var(--text-muted); text-align: right;">${slideText.split('\n').length} líneas</div>
      `;

      slideCard.addEventListener('click', () => {
        this.selectSlideByIndex(index);
        this.projectSelectedSlide();
      });

      this.slidesContainer.appendChild(slideCard);
    });
  }

  selectSlideByIndex(index) {
    if (!this.currentChorus || !this.currentChorus.slides) return;
    if (index < 0 || index >= this.currentChorus.slides.length) return;

    this.selectedSlideIndex = index;

    const cards = this.slidesContainer.querySelectorAll('.slide-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });

    if (this.isCurrentlyProjecting) {
      this.projectSelectedSlide();
    }
  }

  nextSlide() {
    if (!this.currentChorus || !this.currentChorus.slides) return;
    if (this.selectedSlideIndex < this.currentChorus.slides.length - 1) {
      this.selectSlideByIndex(this.selectedSlideIndex + 1);
    }
  }

  prevSlide() {
    if (!this.currentChorus || !this.currentChorus.slides) return;
    if (this.selectedSlideIndex > 0) {
      this.selectSlideByIndex(this.selectedSlideIndex - 1);
    }
  }

  async projectSelectedSlide() {
    if (!this.currentChorus || !this.currentChorus.slides) return;
    const slideText = this.currentChorus.slides[this.selectedSlideIndex];
    if (!slideText) return;

    await window.bibleAPI.choruses.projectSlide({
      title: this.currentChorus.title,
      slideText,
      background: this.currentChorus.background
    });

    this.isCurrentlyProjecting = true;

    // Resaltar diapositiva en emisión
    const cards = this.slidesContainer.querySelectorAll('.slide-card');
    cards.forEach((card, idx) => {
      if (idx === this.selectedSlideIndex) card.classList.add('projected');
      else card.classList.remove('projected');
    });
  }

  // --- MODAL DE GESTIÓN (CREAR / EDITAR) ---

  openCreateModal() {
    this.editingChorusId = null;
    this.modalTitle.textContent = 'Registrar Nuevo Corito';
    this.inputTitle.value = '';
    this.textareaLyrics.value = '';
    this.selectCategory.value = '1';
    this.modal.style.display = 'flex';
  }

  openEditModal() {
    if (!this.currentChorus) return;
    this.editingChorusId = this.currentChorus.id;
    this.modalTitle.textContent = 'Editar Corito';
    this.inputTitle.value = this.currentChorus.title;
    this.textareaLyrics.value = this.currentChorus.lyrics;
    this.selectCategory.value = String(this.currentChorus.category_id || 1);
    this.modal.style.display = 'flex';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  async saveChorusFromModal() {
    const title = this.inputTitle.value.trim();
    const lyrics = this.textareaLyrics.value.trim();
    const category_id = parseInt(this.selectCategory.value, 10);

    if (!title || !lyrics) {
      alert('Por favor completa el título y la letra del corito.');
      return;
    }

    try {
      if (this.editingChorusId) {
        await window.bibleAPI.choruses.update(this.editingChorusId, { title, lyrics, category_id });
      } else {
        const created = await window.bibleAPI.choruses.create({ title, lyrics, category_id });
        this.editingChorusId = created.id;
      }

      this.closeModal();
      await this.loadChoruses(this.currentCategoryFilter ? parseInt(this.currentCategoryFilter, 10) : null);
      if (this.editingChorusId) {
        await this.selectChorus(this.editingChorusId);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async deleteCurrentChorus() {
    if (!this.currentChorus) return;
    if (!confirm(`¿Eliminar definitivamente el corito "${this.currentChorus.title}"?`)) return;

    try {
      await window.bibleAPI.choruses.delete(this.currentChorus.id);
      await this.loadChoruses();
    } catch (err) {
      alert(err.message);
    }
  }

  bindEvents() {
    // 1. Modo Espontáneo: Búsqueda reactiva mientras se escribe
    this.searchInput.addEventListener('input', async () => {
      const q = this.searchInput.value.trim();
      const results = await window.bibleAPI.choruses.searchSpontaneous(q);
      this.renderChorusesList(results);
    });

    // 2. Modo Espontáneo: Enter para proyectar de inmediato el primer resultado
    this.searchInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstCard = this.chorusesList.querySelector('.chorus-item-card');
        if (firstCard) {
          const id = parseInt(firstCard.dataset.id, 10);
          await this.selectChorus(id);
          await this.projectSelectedSlide();
          this.searchInput.value = '';
          await this.loadChoruses();
        }
      }
    });

    // 3. Proyectar diapositiva activa
    this.btnProjectSlide.addEventListener('click', () => this.projectSelectedSlide());

    // 4. Modal CRUD
    this.btnOpenModal.addEventListener('click', () => this.openCreateModal());
    this.btnEdit.addEventListener('click', () => this.openEditModal());
    this.btnDelete.addEventListener('click', () => this.deleteCurrentChorus());
    this.btnCloseModal.addEventListener('click', () => this.closeModal());
    this.btnCancelModal.addEventListener('click', () => this.closeModal());
    this.btnSave.addEventListener('click', () => this.saveChorusFromModal());

    // 5. Pestañas de categoría
    this.tabs.forEach(tab => {
      if (!tab) return;
      tab.addEventListener('click', async () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategoryFilter = tab.dataset.cat || '';
        await this.loadChoruses(this.currentCategoryFilter ? parseInt(this.currentCategoryFilter, 10) : null);
      });
    });

    // 6. Navegación por teclado (Flechas arriba / abajo para diapositivas)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.projectSelectedSlide();
      }
    });
  }
}

