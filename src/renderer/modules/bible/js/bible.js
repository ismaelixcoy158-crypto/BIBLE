/**
 * BIBLE — BibleController
 * Controlador para la navegación de los 66 libros, búsqueda por teclado y emisión bíblica.
 */
export class BibleController {
  constructor() {
    this.books = [];
    this.currentBook = null;
    this.currentChapter = 1;
    this.currentVerses = [];
    this.selectedVerseIndex = 0;
    this.isCurrentlyProjecting = false;

    // Elementos DOM
    this.commandInput = document.getElementById('bibleCommandInput');
    this.feedbackPill = document.getElementById('parsedFeedbackPill');
    this.btnProjectCommand = document.getElementById('btnProjectFromCommand');
    this.booksContainer = document.getElementById('booksListContainer');
    this.chaptersContainer = document.getElementById('chaptersGridContainer');
    this.versesContainer = document.getElementById('versesListContainer');
    this.activeBookLabel = document.getElementById('activeBookLabel');
    this.activeRefHeading = document.getElementById('activeReferenceHeading');

    this.btnPrev = document.getElementById('btnPrevVerse');
    this.btnNext = document.getElementById('btnNextVerse');
    this.btnProjectSelection = document.getElementById('btnProjectActiveVerse');

    this.selectRefPos = document.getElementById('selectRefPosition');
    this.checkTranslation = document.getElementById('checkShowTranslation');
    this.checkUppercase = document.getElementById('checkUppercase');

    // Filtro testamento
    this.filterTestament = 'ALL';
    this.tabAll = document.getElementById('tabAllBooks');
    this.tabOT = document.getElementById('tabOTBooks');
    this.tabNT = document.getElementById('tabNTBooks');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadBooks();
    // Seleccionar por defecto Evangelio según San Juan (ID 43) y capítulo 3
    const defaultBook = this.books.find(b => b.id === 43) || this.books[0];
    if (defaultBook) {
      await this.selectBook(defaultBook, 3, 16);
    }
  }

  async loadBooks() {
    try {
      this.books = await window.bibleAPI.bible.getBooks();
      this.renderBooks();
    } catch (err) {
      console.error('[BibleController] Error al cargar libros:', err);
    }
  }

  renderBooks() {
    this.booksContainer.innerHTML = '';
    const filtered = this.books.filter(b => {
      if (this.filterTestament === 'ALL') return true;
      return b.testament === this.filterTestament;
    });

    filtered.forEach(book => {
      const btn = document.createElement('button');
      btn.className = `book-item-btn ${this.currentBook && this.currentBook.id === book.id ? 'active' : ''}`;
      btn.innerHTML = `
        <span>${book.name}</span>
        <span style="font-size: 11px; color: var(--text-muted);">${book.standard_abbrev}</span>
      `;
      btn.addEventListener('click', () => this.selectBook(book, 1));
      this.booksContainer.appendChild(btn);
    });
  }

  async selectBook(book, targetChapter = 1, targetVerse = 1) {
    this.currentBook = book;
    this.activeBookLabel.textContent = `${book.name} (${book.chapters_count})`;
    this.renderBooks();
    this.renderChapters(book.chapters_count, targetChapter);
    await this.selectChapter(targetChapter, targetVerse);
  }

  renderChapters(chaptersCount, activeChapter = 1) {
    this.chaptersContainer.innerHTML = '';
    for (let c = 1; c <= chaptersCount; c++) {
      const btn = document.createElement('button');
      btn.className = `chapter-btn ${c === activeChapter ? 'active' : ''}`;
      btn.textContent = c;
      btn.addEventListener('click', () => this.selectChapter(c));
      this.chaptersContainer.appendChild(btn);
    }
  }

  async selectChapter(chapter, targetVerse = 1) {
    this.currentChapter = chapter;

    // Actualizar clase activa en cuadrícula de capítulos
    const chapterButtons = this.chaptersContainer.querySelectorAll('.chapter-btn');
    chapterButtons.forEach((btn, idx) => {
      if (idx + 1 === chapter) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    try {
      this.currentVerses = await window.bibleAPI.bible.getVersesByChapter(this.currentBook.id, chapter);
      this.renderVerses(targetVerse);
    } catch (err) {
      console.error('[BibleController] Error al cargar versículos:', err);
    }
  }

  renderVerses(targetVerse = 1) {
    this.versesContainer.innerHTML = '';
    this.activeRefHeading.textContent = `${this.currentBook.name} ${this.currentChapter}`;

    if (!this.currentVerses || !this.currentVerses.length) {
      this.versesContainer.innerHTML = `
        <div style="padding: 20px; color: var(--text-muted); text-align: center;">
          No hay versículos disponibles en este capítulo de muestra.
        </div>
      `;
      return;
    }

    let foundTargetIndex = 0;

    this.currentVerses.forEach((v, index) => {
      const isTarget = v.verse === targetVerse;
      if (isTarget) foundTargetIndex = index;

      const card = document.createElement('div');
      card.className = `verse-card ${isTarget ? 'selected' : ''}`;
      card.dataset.index = index;
      card.innerHTML = `
        <span class="verse-num">${v.verse}</span>
        <span class="verse-text">${v.text}</span>
      `;

      card.addEventListener('click', () => {
        this.selectVerseByIndex(index);
      });

      card.addEventListener('dblclick', () => {
        this.selectVerseByIndex(index);
        this.projectSelectedVerse();
      });

      this.versesContainer.appendChild(card);
    });

    this.selectedVerseIndex = foundTargetIndex;
    this.scrollToSelectedVerse();
  }

  selectVerseByIndex(index) {
    if (index < 0 || index >= this.currentVerses.length) return;
    this.selectedVerseIndex = index;

    const cards = this.versesContainer.querySelectorAll('.verse-card');
    cards.forEach((card, idx) => {
      if (idx === index) card.classList.add('selected');
      else card.classList.remove('selected');
    });

    this.scrollToSelectedVerse();

    // Si ya estamos emitiendo en vivo, actualizar proyección al cambiar versículo
    if (this.isCurrentlyProjecting) {
      this.projectSelectedVerse();
    }
  }

  scrollToSelectedVerse() {
    const selected = this.versesContainer.querySelector('.verse-card.selected');
    if (selected) {
      selected.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  nextVerse() {
    if (this.selectedVerseIndex < this.currentVerses.length - 1) {
      this.selectVerseByIndex(this.selectedVerseIndex + 1);
    } else if (this.currentChapter < this.currentBook.chapters_count) {
      this.selectChapter(this.currentChapter + 1, 1);
    }
  }

  prevVerse() {
    if (this.selectedVerseIndex > 0) {
      this.selectVerseByIndex(this.selectedVerseIndex - 1);
    } else if (this.currentChapter > 1) {
      this.selectChapter(this.currentChapter - 1, 1);
    }
  }

  async projectSelectedVerse() {
    const verse = this.currentVerses[this.selectedVerseIndex];
    if (!verse) return;

    let refString = `${this.currentBook.name} ${this.currentChapter}:${verse.verse}`;
    if (this.checkTranslation.checked) {
      refString += ' (RV1909)';
    }

    let textToProject = verse.text;
    if (this.checkUppercase.checked) {
      textToProject = textToProject.toUpperCase();
    }

    await window.bibleAPI.bible.projectVerse({
      title: `${this.currentBook.name} ${this.currentChapter}:${verse.verse}`,
      text: textToProject,
      reference: refString,
      refPosition: this.selectRefPos.value
    });

    this.isCurrentlyProjecting = true;

    // Marcar visualmente la tarjeta proyectada
    const cards = this.versesContainer.querySelectorAll('.verse-card');
    cards.forEach((card, idx) => {
      if (idx === this.selectedVerseIndex) card.classList.add('projected');
      else card.classList.remove('projected');
    });
  }

  bindEvents() {
    // 1. Filtrado de testamentos
    this.tabAll.addEventListener('click', () => {
      this.filterTestament = 'ALL';
      this.updateTabs('tabAllBooks');
      this.renderBooks();
    });
    this.tabOT.addEventListener('click', () => {
      this.filterTestament = 'OT';
      this.updateTabs('tabOTBooks');
      this.renderBooks();
    });
    this.tabNT.addEventListener('click', () => {
      this.filterTestament = 'NT';
      this.updateTabs('tabNTBooks');
      this.renderBooks();
    });

    // 2. Navegación anterior / siguiente
    this.btnPrev.addEventListener('click', () => this.prevVerse());
    this.btnNext.addEventListener('click', () => this.nextVerse());
    this.btnProjectSelection.addEventListener('click', () => this.projectSelectedVerse());

    // Sugerencias de citas rápidas
    const quickChips = document.querySelectorAll('.quick-cite-chip');
    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.commandInput.value = chip.dataset.cite;
        this.commandInput.dispatchEvent(new Event('input'));
        this.btnProjectCommand.click();
      });
    });

    // 3. Parser de citas por teclado en tiempo real
    this.commandInput.addEventListener('input', async () => {
      const val = this.commandInput.value.trim();
      if (!val) {
        this.feedbackPill.style.display = 'none';
        return;
      }

      const res = await window.bibleAPI.bible.searchReference(val);
      if (res && res.success) {
        this.feedbackPill.style.display = 'inline-block';
        this.feedbackPill.textContent = `📖 ${res.parseInfo.formattedReference}`;
        this.feedbackPill.style.color = 'var(--status-live)';
      } else {
        this.feedbackPill.style.display = 'none';
      }
    });

    // 4. Confirmación con Enter en el campo de búsqueda
    this.commandInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = this.commandInput.value.trim();
        if (!val) return;

        const res = await window.bibleAPI.bible.searchReference(val);
        if (res && res.success) {
          const book = this.books.find(b => b.id === res.parseInfo.bookId);
          if (book) {
            await this.selectBook(book, res.parseInfo.chapter, res.parseInfo.startVerse);
            await this.projectSelectedVerse();
            this.commandInput.value = '';
            this.feedbackPill.style.display = 'none';
          }
        }
      }
    });

    this.btnProjectCommand.addEventListener('click', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      this.commandInput.dispatchEvent(event);
    });

    // 5. Atajos globales cuando el foco está en el módulo Biblia
    window.addEventListener('keydown', (e) => {
      // Si el usuario está escribiendo en el input de búsqueda, no interceptar flechas
      if (document.activeElement === this.commandInput) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextVerse();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevVerse();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.projectSelectedVerse();
      }
    });
  }

  updateTabs(activeTabId) {
    [this.tabAll, this.tabOT, this.tabNT].forEach(tab => {
      if (tab.id === activeTabId) tab.classList.add('active');
      else tab.classList.remove('active');
    });
  }
}

