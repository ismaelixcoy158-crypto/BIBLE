import { ProjectionToolbarController } from '../../../shared/js/projection-toolbar.js';
import { BackgroundPickerController } from '../../../shared/js/background-picker.js';

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
    this.selectedRange = null; // { startIdx, endIdx, startVerse, endVerse }
    this.projectedReference = null; // { bookId, chapter, startVerse, endVerse, formatted }
    this.isCurrentlyProjecting = false;

    // HUD Flotante de Cita Rápida (Estilo Holyrics / EasyWorship)
    this.quickCiteBuffer = '';
    this.lastParsedCite = null;
    this.hudElement = document.getElementById('bibleFloatingQuickCite');
    this.hudRawBuffer = document.getElementById('hudRawBuffer');
    this.hudBookSegment = document.getElementById('hudBookSegment');
    this.hudChapterSegment = document.getElementById('hudChapterSegment');
    this.hudVerseSegment = document.getElementById('hudVerseSegment');
    this.hudConcordancePrompt = document.getElementById('hudConcordancePrompt');
    this.hudConcordanceQuery = document.getElementById('hudConcordanceQuery');

    // Dropdown FTS5 Flotante de Concordancia Bíblica
    this.ftsResultsBox = document.getElementById('ftsSearchResults');
    this.ftsDebounceTimer = null;

    // Pasajes frecuentes y leídos en el culto
    this.recentCites = [];

    this.booksContainer = document.getElementById('booksListContainer');
    this.chaptersContainer = document.getElementById('chaptersGridContainer');
    this.versesContainer = document.getElementById('versesListContainer');
    this.activeBookLabel = document.getElementById('activeBookLabel');
    this.activeRefHeading = document.getElementById('activeReferenceHeading');

    this.btnPrev = document.getElementById('btnPrevVerse');
    this.btnNext = document.getElementById('btnNextVerse');
    this.btnProjectSelection = document.getElementById('btnProjectActiveVerse');
    this.btnColProjectVerse = document.getElementById('btnColProjectVerse');
    this.btnBottomPrevVerse = document.getElementById('btnBottomPrevVerse');
    this.btnBottomNextVerse = document.getElementById('btnBottomNextVerse');

    // Buscador Rápido de Libros (Columna 1)
    this.inputBookFilter = document.getElementById('inputBookFilter');
    this.btnClearBookFilter = document.getElementById('btnClearBookFilter');
    this.booksCountHeader = document.getElementById('booksCountHeader');
    this.bookSearchQuery = '';

    // Insignia de capítulos (Columna 2)
    this.capsCountBadge = document.getElementById('activeBookChaptersCountBadge');

    // Zoom de fuente de operador (Columna 3)
    this.verseFontSize = parseInt(localStorage.getItem('bible_operator_font_size') || '14', 10);
    this.btnVerseFontDec = document.getElementById('btnVerseFontDec');
    this.btnVerseFontInc = document.getElementById('btnVerseFontInc');
    this.verseFontSizeLabel = document.getElementById('verseFontSizeLabel');

    // Indicador Tally de Emisión en Vivo en Barra Inferior
    this.liveStatusBadge = document.getElementById('liveStatusBadge');
    this.liveStatusRef = document.getElementById('liveStatusRef');

    // Modal de Atajos de Teclado
    this.shortcutsModal = document.getElementById('bibleShortcutsModal');
    this.btnOpenShortcutsModal = document.getElementById('btnOpenShortcutsModal');
    this.btnCloseShortcutsModal = document.getElementById('btnCloseShortcutsModal');
    this.btnGotItShortcuts = document.getElementById('btnGotItShortcuts');
    this.shortcutsBackdrop = document.getElementById('shortcutsBackdrop');

    this.selectRefPos = document.getElementById('selectRefPosition');
    this.checkTranslation = document.getElementById('checkShowTranslation');
    this.checkUppercase = document.getElementById('checkUppercase');

    // Elementos de personalización de Fondo de Proyección
    this.btnOpenBgPicker = document.getElementById('btnOpenBackgroundPicker');
    this.activeBgThumb = document.getElementById('activeBgThumb');
    this.activeBgName = document.getElementById('activeBgName');
    this.bgModal = document.getElementById('bibleBgModal');
    this.bgBackdrop = document.getElementById('bibleBgBackdrop');
    this.btnCloseBgModal = document.getElementById('btnCloseBgModal');
    this.btnApplyAndCloseBg = document.getElementById('btnApplyAndCloseBg');
    this.bgPresetsGrid = document.getElementById('bgPresetsGrid');
    this.btnBrowseLocalBg = document.getElementById('btnBrowseLocalBg');
    this.localFileStatus = document.getElementById('localFileStatus');
    this.inputBgUrl = document.getElementById('inputBgUrl');
    this.btnPasteBgUrl = document.getElementById('btnPasteBgUrl');
    this.btnApplyBgUrl = document.getElementById('btnApplyBgUrl');
    this.urlStatusMessage = document.getElementById('urlStatusMessage');
    this.sliderBgScrim = document.getElementById('sliderBgScrim');
    this.scrimValueLabel = document.getElementById('scrimValueLabel');
    this.sliderBgScale = document.getElementById('sliderBgScale');
    this.bgScaleValueLabel = document.getElementById('bgScaleValueLabel');
    this.currentBackground = null;

    // Selector de color de letra (Blanco / Negro)
    this.textColor = 'white';
    this.btnTextWhite = document.getElementById('btnTextWhite');
    this.btnTextBlack = document.getElementById('btnTextBlack');
    this.btnModalTextWhite = document.getElementById('btnModalTextWhite');
    this.btnModalTextBlack = document.getElementById('btnModalTextBlack');

    // Filtro testamento (Todos, A.T., N.T., Frecuentes)
    this.filterTestament = 'ALL';
    this.tabAll = document.getElementById('tabAllBooks');
    this.tabOT = document.getElementById('tabOTBooks');
    this.tabNT = document.getElementById('tabNTBooks');
    this.tabFav = document.getElementById('tabFavBooks');

    // Versión Bíblica Activa (RV1909 vs RVG)
    this.currentVersion = localStorage.getItem('bible_selected_version') || 'RV1909';
    this.selectBibleVersion = document.getElementById('selectBibleVersion');
    this.hudVersionPill = document.getElementById('hudVersionPill');
    this.labelShowTranslation = document.getElementById('labelShowTranslation');

    this.init();
  }

  async init() {
    console.log('[BibleController] Invocando bindEvents()...');
    if (this.selectBibleVersion) {
      this.selectBibleVersion.value = this.currentVersion;
    }
    if (this.hudVersionPill) {
      this.hudVersionPill.textContent = this.currentVersion;
    }
    if (this.labelShowTranslation) {
      this.labelShowTranslation.textContent = this.currentVersion;
    }
    this.bindEvents();
    this.initSplitters();
    this.initFontSizeControls();

    // Inicializar componente reutilizable de Barra de Emisión y Fondo (POO estilo Java)
    this.toolbar = new ProjectionToolbarController({
      container: document.querySelector('.bible-bottom-bar'),
      module: 'bible',
      onPrev: () => this.previousVerse(),
      onNext: () => this.nextVerse(),
      onUppercaseChange: () => {
        if (this.isCurrentlyProjecting) this.projectSelectedVerse();
      },
      onRefPositionChange: () => {
        if (this.isCurrentlyProjecting) this.projectSelectedVerse();
      },
      onVersionChange: (version) => {
        this.currentVersion = version;
        this.loadVerses(this.currentBook.id, this.currentChapter);
      },
      onShowTranslationChange: () => {
        if (this.isCurrentlyProjecting) this.projectSelectedVerse();
      },
      onBackgroundChange: async () => {
        if (this.isCurrentlyProjecting) {
          await this.projectSelectedVerse();
        }
      },
      onTextColorChange: async () => {
        if (this.isCurrentlyProjecting) {
          await this.projectSelectedVerse();
        }
      }
    });
    await this.toolbar.init();
    this.bgPicker = this.toolbar.bgPicker;

    console.log('[BibleController] Invocando loadBooks()...');
    await this.loadBooks();
    console.log('[BibleController] Libros cargados:', this.books ? this.books.length : 0);
    // Seleccionar por defecto Evangelio según San Juan (ID 43) y capítulo 3
    const defaultBook = this.books.find(b => b.id === 43) || this.books[0];
    if (defaultBook) {
      console.log('[BibleController] Seleccionando libro inicial:', defaultBook.name);
      await this.selectBook(defaultBook, 3, 16);
    }
  }

  initFontSizeControls() {
    this.applyVerseFontSize();
    if (this.btnVerseFontDec) {
      this.btnVerseFontDec.addEventListener('click', () => {
        if (this.verseFontSize > 11) {
          this.verseFontSize -= 1;
          this.saveVerseFontSize();
        }
      });
    }
    if (this.btnVerseFontInc) {
      this.btnVerseFontInc.addEventListener('click', () => {
        if (this.verseFontSize < 24) {
          this.verseFontSize += 1;
          this.saveVerseFontSize();
        }
      });
    }
  }

  saveVerseFontSize() {
    localStorage.setItem('bible_operator_font_size', String(this.verseFontSize));
    this.applyVerseFontSize();
  }

  applyVerseFontSize() {
    if (this.verseFontSizeLabel) {
      const pct = Math.round((this.verseFontSize / 14) * 100);
      this.verseFontSizeLabel.textContent = `${pct}%`;
    }
    if (this.versesContainer) {
      this.versesContainer.style.setProperty('--verse-font-size', `${this.verseFontSize}px`);
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

    if (this.filterTestament === 'FAV') {
      this.renderFavorites();
      return;
    }

    const query = (this.bookSearchQuery || '').trim().toLowerCase();

    const filtered = this.books.filter(b => {
      if (this.filterTestament !== 'ALL' && b.testament !== this.filterTestament) return false;
      if (!query) return true;
      return b.name.toLowerCase().includes(query) ||
        b.standard_abbrev.toLowerCase().includes(query);
    });

    if (this.booksCountHeader) {
      this.booksCountHeader.textContent = `Libros (${filtered.length})`;
    }

    if (filtered.length === 0) {
      this.booksContainer.innerHTML = `
        <div class="empty-books-notice">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>No hay libros que coincidan con "${this.bookSearchQuery}"</span>
        </div>
      `;
      return;
    }

    filtered.forEach(book => {
      const btn = document.createElement('button');
      btn.className = `book-item-btn ${this.currentBook && this.currentBook.id === book.id ? 'active' : ''}`;

      let displayName = book.name;
      if (query && displayName.toLowerCase().includes(query)) {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(${escaped})`, 'gi');
        displayName = displayName.replace(re, '<mark class="highlight-match">$1</mark>');
      }

      btn.innerHTML = `
        <span class="book-name-label">${displayName}</span>
        <span class="book-badge-num">${book.standard_abbrev}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectBook(book, 1);
      });
      this.booksContainer.appendChild(btn);
    });
  }

  renderFavorites() {
    this.booksContainer.innerHTML = '';
    if (this.booksCountHeader) {
      this.booksCountHeader.textContent = 'Frecuentes';
    }

    const container = document.createElement('div');
    container.className = 'frequent-cards-container';

    // 1. Recientes del culto
    if (this.recentCites && this.recentCites.length > 0) {
      const recHeader = document.createElement('div');
      recHeader.className = 'frequent-cat-header';
      recHeader.innerHTML = '<svg class="icon icon-xs" viewBox="0 0 24 24" style="color: var(--accent-primary); fill: none; stroke: currentColor; stroke-width: 2.2;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Leídos en este Culto</span>';
      container.appendChild(recHeader);

      this.recentCites.forEach(cite => {
        const card = document.createElement('div');
        card.className = 'frequent-item-card';
        card.innerHTML = `
          <span class="frequent-item-ref">${cite}</span>
          <span class="frequent-item-preview" style="color: #4ADE80;">● Proyectado recientemente</span>
        `;
        card.addEventListener('click', async () => {
          const val = cite.replace(/\s*\([A-Z0-9]+\)\s*/g, '');
          const res = await window.bibleAPI.bible.searchReference(val, this.currentVersion);
          if (res && res.success) {
            const book = this.books.find(b => b.id === res.parseInfo.bookId);
            if (book) {
              await this.selectBook(book, res.parseInfo.chapter || 1, res.parseInfo.startVerse || 1);
            }
          }
        });
        card.addEventListener('dblclick', async () => {
          await this.projectSelectedVerse();
        });
        container.appendChild(card);
      });
    }

    // 2. Frecuentes Canónicos de Estudio y Culto
    const presets = [
      {
        cat: 'Promesas y Salvación', items: [
          { ref: 'Juan 3:16', preview: 'De tal manera amó Dios al mundo...' },
          { ref: 'Romanos 8:28', preview: 'Todas las cosas ayudan a bien...' },
          { ref: 'Filipenses 4:13', preview: 'Todo lo puedo en Cristo que me fortalece...' },
          { ref: 'Efesios 2:8', preview: 'Por gracia sois salvos por medio de la fe...' },
          { ref: 'Jeremías 29:11', preview: 'Pensamientos de paz y no de mal...' }
        ]
      },
      {
        cat: 'Salmos y Adoración', items: [
          { ref: 'Salmos 23:1', preview: 'Jehová es mi pastor; nada me faltará...' },
          { ref: 'Salmos 91:1', preview: 'El que habita al abrigo del Altísimo...' },
          { ref: 'Salmos 121:1', preview: 'Alzaré mis ojos a los montes...' },
          { ref: 'Salmos 100:1', preview: 'Cantad alegres a Dios, habitantes...' },
          { ref: 'Salmos 119:105', preview: 'Lámpara es a mis pies tu palabra...' }
        ]
      },
      {
        cat: 'Poder y Fe', items: [
          { ref: 'Hechos 1:8', preview: 'Recibiréis poder cuando haya venido...' },
          { ref: 'Mateo 28:19', preview: 'Por tanto, id, y haced discípulos...' },
          { ref: 'Isaías 40:31', preview: 'Los que esperan en Jehová tendrán nuevas fuerzas...' },
          { ref: '1 Corintios 13:4', preview: 'El amor es sufrido, es benigno...' }
        ]
      }
    ];

    presets.forEach(group => {
      const catHeader = document.createElement('div');
      catHeader.className = 'frequent-cat-header';
      catHeader.textContent = group.cat;
      container.appendChild(catHeader);

      group.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'frequent-item-card';
        card.innerHTML = `
          <span class="frequent-item-ref">${item.ref}</span>
          <span class="frequent-item-preview">${item.preview}</span>
        `;
        card.addEventListener('click', async () => {
          const res = await window.bibleAPI.bible.searchReference(item.ref);
          if (res && res.success) {
            const book = this.books.find(b => b.id === res.parseInfo.bookId);
            if (book) {
              await this.selectBook(book, res.parseInfo.chapter || 1, res.parseInfo.startVerse || 1);
            }
          }
        });
        card.addEventListener('dblclick', async () => {
          await this.projectSelectedVerse();
        });
        container.appendChild(card);
      });
    });

    this.booksContainer.appendChild(container);
  }

  async selectBook(book, targetChapter = 1, targetVerse = 1) {
    this.currentBook = book;
    this.activeBookLabel.textContent = book.name;
    if (this.capsCountBadge) {
      this.capsCountBadge.textContent = `${book.chapters_count} caps`;
    }
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
    this.selectedRange = null;

    // Actualizar clase activa en cuadrícula de capítulos
    const chapterButtons = this.chaptersContainer.querySelectorAll('.chapter-btn');
    chapterButtons.forEach((btn, idx) => {
      if (idx + 1 === chapter) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    try {
      this.currentVerses = await window.bibleAPI.bible.getVersesByChapter(this.currentBook.id, chapter, this.currentVersion);
      this.renderVerses(targetVerse);
    } catch (err) {
      console.error('[BibleController] Error al cargar versículos:', err);
    }
  }

  async setBibleVersion(newVersion) {
    if (!newVersion || this.currentVersion === newVersion) return;
    this.currentVersion = newVersion;
    localStorage.setItem('bible_selected_version', newVersion);

    if (this.selectBibleVersion) this.selectBibleVersion.value = newVersion;
    if (this.hudVersionPill) this.hudVersionPill.textContent = newVersion;
    if (this.labelShowTranslation) this.labelShowTranslation.textContent = newVersion;

    if (this.currentBook && this.currentChapter) {
      const activeVerseNum = (this.currentVerses && this.currentVerses[this.selectedVerseIndex])
        ? this.currentVerses[this.selectedVerseIndex].verse
        : 1;

      try {
        this.currentVerses = await window.bibleAPI.bible.getVersesByChapter(
          this.currentBook.id,
          this.currentChapter,
          this.currentVersion
        );
        this.renderVerses(activeVerseNum);
        if (this.isCurrentlyProjecting) {
          await this.projectSelectedVerse();
        }
      } catch (err) {
        console.warn('[BibleController] Error al cambiar versión bíblica:', err);
      }
    }
  }

  renderVerses(targetVerse = 1) {
    this.versesContainer.innerHTML = '';
    this.applyVerseFontSize();

    const rangeHeader = this.selectedRange
      ? `${this.currentBook.name} ${this.currentChapter}:${this.selectedRange.startVerse}-${this.selectedRange.endVerse}`
      : `${this.currentBook.name} ${this.currentChapter}`;
    this.activeRefHeading.textContent = rangeHeader;

    if (!this.currentVerses || !this.currentVerses.length) {
      this.versesContainer.innerHTML = `
        <div style="padding: 20px; color: var(--text-muted); text-align: center;">
          No hay versículos disponibles en este capítulo de muestra.
        </div>
      `;
      return;
    }

    let foundTargetIndex = (targetVerse === -1) ? Math.max(0, this.currentVerses.length - 1) : 0;

    this.currentVerses.forEach((v, index) => {
      const isTarget = (targetVerse === -1) ? (index === this.currentVerses.length - 1) : (v.verse === targetVerse);
      if (isTarget) foundTargetIndex = index;

      const card = document.createElement('div');
      card.className = 'verse-card';
      card.dataset.index = index;
      card.dataset.verseNum = v.verse;
      card.innerHTML = `
        <div class="verse-num-col">
          <span class="verse-num">${v.verse}</span>
          <span class="live-tally-pill" style="display: none;">
            <span class="pulse-dot"></span> EN VIVO
          </span>
        </div>
        <div class="verse-text">${v.text}</div>
        <div class="verse-hover-actions">
          <button class="btn-quick-project-verse" title="Proyectar este versículo en vivo (Enter)">
            <svg class="icon icon-xs" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Proyectar</span>
          </button>
        </div>
      `;

      // Botón rápido en hover
      const quickBtn = card.querySelector('.btn-quick-project-verse');
      quickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedRange = null;
        this.selectVerseByIndex(index);
        this.projectSelectedVerse();
      });

      // Clic normal o Shift+Clic para rango múltiple
      card.addEventListener('click', (e) => {
        if (e.shiftKey && this.selectedVerseIndex !== -1) {
          const start = Math.min(this.selectedVerseIndex, index);
          const end = Math.max(this.selectedVerseIndex, index);
          this.selectRange(start, end);
        } else {
          this.selectedRange = null;
          this.selectVerseByIndex(index);
        }
      });

      card.addEventListener('dblclick', () => {
        this.selectedRange = null;
        this.selectVerseByIndex(index);
        this.projectSelectedVerse();
      });

      this.versesContainer.appendChild(card);
    });

    this.selectedVerseIndex = foundTargetIndex;
    this.updateVerseCardsUI();
    this.scrollToSelectedVerse();
  }

  selectRange(startIdx, endIdx) {
    if (startIdx < 0 || endIdx >= this.currentVerses.length) return;
    const startV = this.currentVerses[startIdx].verse;
    const endV = this.currentVerses[endIdx].verse;

    this.selectedRange = {
      startIdx,
      endIdx,
      startVerse: startV,
      endVerse: endV
    };
    this.selectedVerseIndex = startIdx;

    this.activeRefHeading.textContent = `${this.currentBook.name} ${this.currentChapter}:${startV}-${endV}`;
    this.updateVerseCardsUI();

    if (this.isCurrentlyProjecting) {
      this.projectSelectedVerse();
    }
  }

  selectVerseByIndex(index) {
    if (index < 0 || index >= this.currentVerses.length) return;
    this.selectedVerseIndex = index;
    this.selectedRange = null;

    this.activeRefHeading.textContent = `${this.currentBook.name} ${this.currentChapter}`;
    this.updateVerseCardsUI();
    this.scrollToSelectedVerse();

    // Si ya estamos emitiendo en vivo, actualizar proyección al cambiar versículo
    if (this.isCurrentlyProjecting) {
      this.projectSelectedVerse();
    }
  }

  updateVerseCardsUI() {
    const cards = this.versesContainer.querySelectorAll('.verse-card');
    cards.forEach((card, idx) => {
      const v = this.currentVerses[idx];
      const tallyPill = card.querySelector('.live-tally-pill');

      // 1. Selección o rango
      let isSelected = false;
      let isInRange = false;

      if (this.selectedRange) {
        isInRange = (idx >= this.selectedRange.startIdx && idx <= this.selectedRange.endIdx);
        isSelected = (idx === this.selectedVerseIndex);
      } else {
        isSelected = (idx === this.selectedVerseIndex);
      }

      if (isSelected) card.classList.add('selected');
      else card.classList.remove('selected');

      if (isInRange) card.classList.add('in-range');
      else card.classList.remove('in-range');

      // 2. Estado de emisión en vivo (Projected)
      let isProjected = false;
      if (this.isCurrentlyProjecting && this.projectedReference) {
        if (this.projectedReference.bookId === this.currentBook.id &&
          this.projectedReference.chapter === this.currentChapter) {
          if (this.projectedReference.endVerse) {
            isProjected = (v.verse >= this.projectedReference.startVerse && v.verse <= this.projectedReference.endVerse);
          } else {
            isProjected = (v.verse === this.projectedReference.startVerse);
          }
        }
      }

      if (isProjected) {
        card.classList.add('projected');
        if (tallyPill) tallyPill.style.display = 'inline-flex';
      } else {
        card.classList.remove('projected');
        if (tallyPill) tallyPill.style.display = 'none';
      }
    });

    this.updateLiveMonitorPill();
  }

  updateLiveMonitorPill() {
    if (!this.liveStatusBadge || !this.liveStatusRef) return;
    if (this.isCurrentlyProjecting && this.projectedReference) {
      this.liveStatusBadge.classList.add('live');
      this.liveStatusRef.textContent = this.projectedReference.formatted;
    } else {
      this.liveStatusBadge.classList.remove('live');
      this.liveStatusRef.textContent = 'En espera';
    }
  }

  scrollToSelectedVerse() {
    const selected = this.versesContainer.querySelector('.verse-card.selected');
    if (selected) {
      selected.scrollIntoView({ behavior: 'auto', block: 'nearest' });
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
      this.selectChapter(this.currentChapter - 1, -1);
    }
  }

  async projectSelectedVerse() {
    let title = '';
    let refString = '';
    let textToProject = '';

    if (this.selectedRange) {
      const startV = this.selectedRange.startVerse;
      const endV = this.selectedRange.endVerse;
      const verses = this.currentVerses.slice(this.selectedRange.startIdx, this.selectedRange.endIdx + 1);

      title = `${this.currentBook.name} ${this.currentChapter}:${startV}-${endV}`;
      refString = title;
      if (this.checkTranslation.checked) {
        refString += ` (${this.currentVersion})`;
      }

      textToProject = verses.map(v => `${v.verse} ${v.text}`).join('\n\n');
      if (this.checkUppercase.checked) {
        textToProject = textToProject.toUpperCase();
      }

      this.projectedReference = {
        bookId: this.currentBook.id,
        chapter: this.currentChapter,
        startVerse: startV,
        endVerse: endV,
        formatted: refString
      };
    } else {
      const verse = this.currentVerses[this.selectedVerseIndex];
      if (!verse) return;

      title = `${this.currentBook.name} ${this.currentChapter}:${verse.verse}`;
      refString = title;
      if (this.checkTranslation.checked) {
        refString += ` (${this.currentVersion})`;
      }

      textToProject = verse.text;
      if (this.checkUppercase.checked) {
        textToProject = textToProject.toUpperCase();
      }

      this.projectedReference = {
        bookId: this.currentBook.id,
        chapter: this.currentChapter,
        startVerse: verse.verse,
        endVerse: null,
        formatted: refString
      };
    }

    await window.bibleAPI.bible.projectVerse({
      title,
      text: textToProject,
      reference: refString,
      refPosition: this.selectRefPos.value,
      background: this.currentBackground,
      textColor: this.textColor,
      customStyles: {
        color: this.textColor === 'black' ? '#000000' : '#FFFFFF'
      }
    });

    this.isCurrentlyProjecting = true;
    this.updateVerseCardsUI();
    this.addRecentCite(refString);
  }

  addRecentCite(refString) {
    if (!refString) return;
    if (!this.recentCites) this.recentCites = [];
    this.recentCites = this.recentCites.filter(c => c !== refString);
    this.recentCites.unshift(refString);
    if (this.recentCites.length > 8) this.recentCites.pop();

    if (this.filterTestament === 'FAV') {
      this.renderFavorites();
    }
  }

  // ==========================================================================
  // HUD FLOTANTE DE CITA RÁPIDA (Estilo Holyrics / EasyWorship)
  // No cambia la proyección ni la pantalla hasta presionar Enter
  // ==========================================================================
  showQuickCiteHUD() {
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  }

  hideQuickCiteHUD() {
    this.quickCiteBuffer = '';
    this.lastParsedCite = null;
    if (this.hudElement) {
      this.hudElement.style.display = 'none';
    }
    if (this.hudRawBuffer) {
      this.hudRawBuffer.textContent = '—';
    }
    if (this.hudBookSegment) this.hudBookSegment.textContent = '—';
    if (this.hudChapterSegment) this.hudChapterSegment.textContent = '—';
    if (this.hudVerseSegment) this.hudVerseSegment.textContent = '—';
    if (this.hudConcordancePrompt) this.hudConcordancePrompt.style.display = 'none';
  }

  async updateQuickCiteHUD() {
    const raw = (this.quickCiteBuffer || '').trim();
    if (this.hudRawBuffer) {
      this.hudRawBuffer.textContent = raw || '—';
    }

    if (!raw) {
      this.hideQuickCiteHUD();
      return;
    }

    // 1. Caso A: Si solo escribió un número de versículo en el libro y capítulo actual (ej. "16" o ":16")
    const singleVerseMatch = raw.match(/^:?\s*(\d+)$/);
    if (singleVerseMatch && this.currentBook && this.currentVerses && this.currentVerses.length) {
      const targetVerse = parseInt(singleVerseMatch[1], 10);
      const exists = this.currentVerses.some(v => v.verse === targetVerse);
      if (exists) {
        this.lastParsedCite = {
          book: this.currentBook,
          chapter: this.currentChapter,
          startVerse: targetVerse,
          endVerse: null
        };
        if (this.hudBookSegment) this.hudBookSegment.textContent = this.currentBook.name;
        if (this.hudChapterSegment) this.hudChapterSegment.textContent = `Cap. ${this.currentChapter}`;
        if (this.hudVerseSegment) this.hudVerseSegment.textContent = `Vers. ${targetVerse}`;
        if (this.hudConcordancePrompt) this.hudConcordancePrompt.style.display = 'none';
        return;
      }
    }

    // 2. Caso B: Cita bíblica canónica (ej. "juan 3 16", "sal 23", "1cor 13:4-8")
    try {
      const res = await window.bibleAPI.bible.searchReference(raw, this.currentVersion);
      if (res && res.success && res.parseInfo) {
        const book = this.books.find(b => b.id === res.parseInfo.bookId);
        if (book) {
          const ch = res.parseInfo.chapter || 1;
          const startV = res.parseInfo.startVerse || 1;
          const endV = res.parseInfo.endVerse;

          this.lastParsedCite = {
            book,
            chapter: ch,
            startVerse: startV,
            endVerse: endV
          };

          if (this.hudBookSegment) this.hudBookSegment.textContent = book.name;
          if (this.hudChapterSegment) this.hudChapterSegment.textContent = `Cap. ${ch}`;
          if (this.hudVerseSegment) {
            this.hudVerseSegment.textContent = (endV && endV !== startV) ? `Vers. ${startV}-${endV}` : `Vers. ${startV}`;
          }
          if (this.hudConcordancePrompt) this.hudConcordancePrompt.style.display = 'none';
          return;
        }
      }
    } catch (err) {
      console.warn('[BibleController] Error al parsear cita rápida:', err);
    }

    // 3. Caso C: No coincide con cita canónica, pero tiene 3+ letras (búsqueda por concordancia de texto)
    this.lastParsedCite = null;
    if (raw.length >= 3 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(raw)) {
      if (this.hudBookSegment) this.hudBookSegment.textContent = '—';
      if (this.hudChapterSegment) this.hudChapterSegment.textContent = '—';
      if (this.hudVerseSegment) this.hudVerseSegment.textContent = '—';
      if (this.hudConcordancePrompt && this.hudConcordanceQuery) {
        this.hudConcordanceQuery.textContent = `Buscar "${raw}" en toda la Biblia (Enter)`;
        this.hudConcordancePrompt.style.display = 'flex';
      }
    } else {
      if (this.hudBookSegment) this.hudBookSegment.textContent = 'Buscando...';
      if (this.hudChapterSegment) this.hudChapterSegment.textContent = '—';
      if (this.hudVerseSegment) this.hudVerseSegment.textContent = '—';
      if (this.hudConcordancePrompt) this.hudConcordancePrompt.style.display = 'none';
    }
  }

  async executeParsedCite(citeInfo, autoProject = true) {
    if (!citeInfo || !citeInfo.book) return;

    await this.selectBook(citeInfo.book, citeInfo.chapter, citeInfo.startVerse);

    if (citeInfo.endVerse && citeInfo.endVerse > citeInfo.startVerse) {
      const startIdx = this.currentVerses.findIndex(v => v.verse === citeInfo.startVerse);
      const endIdx = this.currentVerses.findIndex(v => v.verse === citeInfo.endVerse);
      if (startIdx !== -1 && endIdx !== -1) {
        this.selectRange(startIdx, endIdx);
      }
    } else {
      this.selectedRange = null;
      const idx = this.currentVerses.findIndex(v => v.verse === citeInfo.startVerse);
      if (idx !== -1) {
        this.selectVerseByIndex(idx);
      }
    }

    if (autoProject) {
      await this.projectSelectedVerse();
    }
  }

  bindEvents() {
    // 1. Filtrado de testamentos (Todos, A.T., N.T., Frecuentes)
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
    if (this.tabFav) {
      this.tabFav.addEventListener('click', () => {
        this.filterTestament = 'FAV';
        this.updateTabs('tabFavBooks');
        this.renderBooks();
      });
    }

    // 1.1 Buscador Rápido de Libros (Columna 1)
    if (this.inputBookFilter) {
      this.inputBookFilter.addEventListener('input', (e) => {
        this.bookSearchQuery = e.target.value;
        if (this.btnClearBookFilter) {
          this.btnClearBookFilter.style.display = this.bookSearchQuery ? 'flex' : 'none';
        }
        this.renderBooks();
      });

      this.inputBookFilter.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.inputBookFilter.value = '';
          this.bookSearchQuery = '';
          if (this.btnClearBookFilter) this.btnClearBookFilter.style.display = 'none';
          this.renderBooks();
          this.inputBookFilter.blur();
        }
      });
    }

    if (this.btnClearBookFilter) {
      this.btnClearBookFilter.addEventListener('click', () => {
        this.inputBookFilter.value = '';
        this.bookSearchQuery = '';
        this.btnClearBookFilter.style.display = 'none';
        this.inputBookFilter.focus();
        this.renderBooks();
      });
    }

    // 2. Navegación anterior / siguiente y emisión
    this.btnPrev.addEventListener('click', () => this.prevVerse());
    this.btnNext.addEventListener('click', () => this.nextVerse());
    this.btnProjectSelection.addEventListener('click', () => this.projectSelectedVerse());

    if (this.btnColProjectVerse) {
      this.btnColProjectVerse.addEventListener('click', () => this.projectSelectedVerse());
    }
    if (this.btnBottomPrevVerse) {
      this.btnBottomPrevVerse.addEventListener('click', () => this.prevVerse());
    }
    if (this.btnBottomNextVerse) {
      this.btnBottomNextVerse.addEventListener('click', () => this.nextVerse());
    }

    // Modal de Atajos de Teclado
    const openShortcuts = () => {
      if (this.shortcutsModal) this.shortcutsModal.style.display = 'flex';
    };
    const closeShortcuts = () => {
      if (this.shortcutsModal) this.shortcutsModal.style.display = 'none';
    };
    if (this.btnOpenShortcutsModal) this.btnOpenShortcutsModal.addEventListener('click', openShortcuts);
    if (this.btnCloseShortcutsModal) this.btnCloseShortcutsModal.addEventListener('click', closeShortcuts);
    if (this.btnGotItShortcuts) this.btnGotItShortcuts.addEventListener('click', closeShortcuts);
    if (this.shortcutsBackdrop) this.shortcutsBackdrop.addEventListener('click', closeShortcuts);

    // Cerrar dropdown FTS al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (this.ftsResultsBox && !e.target.closest('#ftsSearchResults') && !e.target.closest('#bibleFloatingQuickCite')) {
        this.hideFtsResults();
      }
    });

    // 3. Ajustes de personalización en tiempo real
    if (this.selectBibleVersion) {
      this.selectBibleVersion.addEventListener('change', async (e) => {
        await this.setBibleVersion(e.target.value);
      });
    }
    this.selectRefPos.addEventListener('change', () => {
      if (this.isCurrentlyProjecting) this.projectSelectedVerse();
    });
    this.checkTranslation.addEventListener('change', () => {
      if (this.isCurrentlyProjecting) this.projectSelectedVerse();
    });
    this.checkUppercase.addEventListener('change', () => {
      if (this.isCurrentlyProjecting) this.projectSelectedVerse();
    });

    // 4. ATAJOS DE TECLADO Y CAPTURA GLOBAL DE ESCRITURA DIRECTA (Estilo Holyrics)
    window.addEventListener('keydown', async (e) => {
      // Verificar si el módulo activo en el Shell es 'bible'.
      // Si el usuario está en otro módulo (Ruleta, Coritos, Predicaciones, Spots), no interceptar ninguna tecla.
      const activeNav = document.querySelector('.nav-item.active');
      if (activeNav && activeNav.dataset.module !== 'bible') {
        return;
      }

      // Si el foco está en un elemento de texto editable (INPUT, TEXTAREA, SELECT), no interceptar
      const isInputFocusedAtStart = document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (isInputFocusedAtStart && e.key !== 'Escape') {
        return;
      }

      // Manejo prioritario de Escape
      if (e.key === 'Escape') {
        if (this.shortcutsModal && this.shortcutsModal.style.display !== 'none') {
          e.preventDefault();
          this.shortcutsModal.style.display = 'none';
          return;
        }
        if (this.bgPicker && this.bgPicker.modal && this.bgPicker.modal.style.display !== 'none') {
          e.preventDefault();
          this.bgPicker.close();
          return;
        }
        if (this.hudElement && this.hudElement.style.display !== 'none') {
          e.preventDefault();
          this.hideQuickCiteHUD();
          return;
        }
        if (this.ftsResultsBox && this.ftsResultsBox.style.display !== 'none') {
          e.preventDefault();
          this.hideFtsResults();
          return;
        }
      }

      // Atajos con combinación ALT
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const k = e.key.toLowerCase();
        // Alt + B: Fondo
        if (k === 'b') {
          e.preventDefault();
          this.bgPicker?.open();
          return;
        }
        // Alt + C: Alternar Color Blanco / Negro
        if (k === 'c') {
          e.preventDefault();
          this.setTextColor(this.textColor === 'white' ? 'black' : 'white');
          return;
        }
        // Alt + M: Alternar Mayúsculas
        if (k === 'm') {
          e.preventDefault();
          if (this.checkUppercase) {
            this.checkUppercase.checked = !this.checkUppercase.checked;
            this.checkUppercase.dispatchEvent(new Event('change'));
          }
          return;
        }
        // Alt + P: Alternar Posición de Referencia
        if (k === 'p') {
          e.preventDefault();
          if (this.selectRefPos) {
            this.selectRefPos.value = (this.selectRefPos.value === 'bottom' ? 'top' : 'bottom');
            this.selectRefPos.dispatchEvent(new Event('change'));
          }
          return;
        }
        // Alt + V: Alternar Versión Bíblica (RV1909 ⇋ RVG)
        if (k === 'v') {
          e.preventDefault();
          const nextVer = (this.currentVersion === 'RV1909' ? 'RVG' : 'RV1909');
          await this.setBibleVersion(nextVer);
          return;
        }
        // Alt + T: Alternar etiqueta de Versión
        if (k === 't') {
          e.preventDefault();
          if (this.checkTranslation) {
            this.checkTranslation.checked = !this.checkTranslation.checked;
            this.checkTranslation.dispatchEvent(new Event('change'));
          }
          return;
        }
        // Alt + 0: Todos los Libros
        if (e.key === '0') {
          e.preventDefault();
          this.tabAll?.click();
          return;
        }
        // Alt + 1: Antiguo Testamento
        if (e.key === '1') {
          e.preventDefault();
          this.tabOT?.click();
          return;
        }
        // Alt + 2: Nuevo Testamento
        if (e.key === '2') {
          e.preventDefault();
          this.tabNT?.click();
          return;
        }
        // Alt + 3: Pasajes Frecuentes
        if (e.key === '3') {
          e.preventDefault();
          this.tabFav?.click();
          return;
        }
        // Alt + ?: Ver Guía de Atajos
        if (e.key === '?' || e.key === '/') {
          e.preventDefault();
          this.btnOpenShortcutsModal?.click();
          return;
        }
      }

      // Ignorar teclas modificadoras restantes (Ctrl, Meta, F1-F12 reservadas para la consola global)
      if (e.ctrlKey || e.altKey || e.metaKey || /^F\d+$/.test(e.key)) {
        return;
      }

      const isInputFocused = document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (isInputFocused) {
        return;
      }

      const isHudVisible = this.hudElement && this.hudElement.style.display !== 'none';

      // 4.1 Tecla ENTER:
      // Si el HUD está abierto con una cita parsed, navegar y proyectar inmediatamente.
      // Si el HUD está cerrado, proyectar el versículo actualmente seleccionado.
      if (e.key === 'Enter') {
        e.preventDefault();
        if (isHudVisible) {
          if (this.lastParsedCite) {
            const citeToExecute = this.lastParsedCite;
            this.hideQuickCiteHUD();
            await this.executeParsedCite(citeToExecute, true);
            return;
          } else if (this.quickCiteBuffer && this.quickCiteBuffer.trim().length >= 3) {
            const q = this.quickCiteBuffer.trim();
            this.hideQuickCiteHUD();
            await this.performFtsSearch(q);
            return;
          } else {
            this.hideQuickCiteHUD();
            return;
          }
        } else {
          await this.projectSelectedVerse();
          return;
        }
      }

      // 4.2 Tecla BACKSPACE:
      // Si el HUD está abierto, borrar el último caracter sin tocar la pantalla.
      if (e.key === 'Backspace') {
        if (isHudVisible) {
          e.preventDefault();
          this.quickCiteBuffer = this.quickCiteBuffer.slice(0, -1);
          if (!this.quickCiteBuffer) {
            this.hideQuickCiteHUD();
          } else {
            await this.updateQuickCiteHUD();
          }
          return;
        }
      }

      // 4.3 Navegación entre versículos (Solo si el HUD NO está abierto):
      if (!isHudVisible) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          this.nextVerse();
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevVerse();
          return;
        }
        if (e.key === 'Home') {
          e.preventDefault();
          this.selectVerseByIndex(0);
          return;
        }
        if (e.key === 'End') {
          e.preventDefault();
          if (this.currentVerses.length) {
            this.selectVerseByIndex(this.currentVerses.length - 1);
          }
          return;
        }
        if (e.key === '?') {
          e.preventDefault();
          this.btnOpenShortcutsModal?.click();
          return;
        }
      }

      // 4.4 ESCRITURA DIRECTA POR TECLADO (Tipo Holyrics):
      // Captura cualquier letra, número, espacio, dos puntos, guión.
      // ¡IMPORTANTE! NUNCA cambia la pantalla ni el proyector mientras se escribe.
      const isPrintableChar = e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey;
      if (isPrintableChar) {
        // Ignorar espacio inicial si el buffer está vacío
        if (e.key === ' ' && !this.quickCiteBuffer) return;

        e.preventDefault();
        this.quickCiteBuffer += e.key;
        this.showQuickCiteHUD();
        await this.updateQuickCiteHUD();
      }
    });
  }

  updateTabs(activeTabId) {
    [this.tabAll, this.tabOT, this.tabNT, this.tabFav].filter(Boolean).forEach(tab => {
      if (tab.id === activeTabId) tab.classList.add('active');
      else tab.classList.remove('active');
    });
  }

  // ==========================================================================
  // SEPARADORES ARRASTRABLES PARA ESTIRAR COLUMNAS (Splitters)
  // ==========================================================================
  initSplitters() {
    const colBooks = document.getElementById('colBooks');
    const colChapters = document.getElementById('colChapters');
    const splitter1 = document.getElementById('splitterBooksChapters');
    const splitter2 = document.getElementById('splitterChaptersVerses');
    if (!colBooks || !colChapters || !splitter1 || !splitter2) return;

    // Cargar anchos guardados en el almacenamiento local
    try {
      const saved = JSON.parse(localStorage.getItem('bible_column_widths_v2') || '{}');
      if (saved.books && saved.books >= 140 && saved.books <= 450) {
        colBooks.style.width = `${saved.books}px`;
      }
      if (saved.chapters && saved.chapters >= 100 && saved.chapters <= 350) {
        colChapters.style.width = `${saved.chapters}px`;
      }
    } catch { }

    const saveWidths = () => {
      try {
        const widths = {
          books: Math.round(colBooks.getBoundingClientRect().width),
          chapters: Math.round(colChapters.getBoundingClientRect().width)
        };
        localStorage.setItem('bible_column_widths_v2', JSON.stringify(widths));
      } catch { }
    };

    // Separador 1: Arrastrar entre Libros y Capítulos
    let isDragging1 = false;
    let startX1 = 0;
    let startWidth1 = 0;

    splitter1.addEventListener('pointerdown', (e) => {
      isDragging1 = true;
      startX1 = e.clientX;
      startWidth1 = colBooks.getBoundingClientRect().width;
      splitter1.setPointerCapture(e.pointerId);
      splitter1.classList.add('dragging');
      document.body.classList.add('resizing-columns');
      e.preventDefault();
    });

    splitter1.addEventListener('pointermove', (e) => {
      if (!isDragging1) return;
      const delta = e.clientX - startX1;
      const newWidth = Math.max(140, Math.min(450, startWidth1 + delta));
      colBooks.style.width = `${newWidth}px`;
    });

    const stopDragging1 = (e) => {
      if (!isDragging1) return;
      isDragging1 = false;
      splitter1.classList.remove('dragging');
      document.body.classList.remove('resizing-columns');
      try { splitter1.releasePointerCapture(e.pointerId); } catch { }
      saveWidths();
    };

    splitter1.addEventListener('pointerup', stopDragging1);
    splitter1.addEventListener('pointercancel', stopDragging1);

    // Doble clic para restablecer ancho original
    splitter1.addEventListener('dblclick', () => {
      colBooks.style.width = '210px';
      saveWidths();
    });

    // Separador 2: Arrastrar entre Capítulos y Versículos
    let isDragging2 = false;
    let startX2 = 0;
    let startWidth2 = 0;

    splitter2.addEventListener('pointerdown', (e) => {
      isDragging2 = true;
      startX2 = e.clientX;
      startWidth2 = colChapters.getBoundingClientRect().width;
      splitter2.setPointerCapture(e.pointerId);
      splitter2.classList.add('dragging');
      document.body.classList.add('resizing-columns');
      e.preventDefault();
    });

    splitter2.addEventListener('pointermove', (e) => {
      if (!isDragging2) return;
      const delta = e.clientX - startX2;
      const newWidth = Math.max(100, Math.min(350, startWidth2 + delta));
      colChapters.style.width = `${newWidth}px`;
    });

    const stopDragging2 = (e) => {
      if (!isDragging2) return;
      isDragging2 = false;
      splitter2.classList.remove('dragging');
      document.body.classList.remove('resizing-columns');
      try { splitter2.releasePointerCapture(e.pointerId); } catch { }
      saveWidths();
    };

    splitter2.addEventListener('pointerup', stopDragging2);
    splitter2.addEventListener('pointercancel', stopDragging2);

    // Doble clic para restablecer ancho original
    splitter2.addEventListener('dblclick', () => {
      colChapters.style.width = '156px';
      saveWidths();
    });

    // Control Remoto Móvil (Wi-Fi)
    window.addEventListener('remote-control:action', (e) => {
      if (e.detail?.action === 'next') {
        this.nextVerse();
      } else if (e.detail?.action === 'prev') {
        this.prevVerse();
      }
    });
  }

  // ==========================================================================
  // GESTIÓN DE FONDOS DE PROYECCIÓN (Delegado a BackgroundPickerController - POO)
  // ==========================================================================

  get currentBackground() {
    return this.bgPicker ? this.bgPicker.currentBackground : null;
  }

  set currentBackground(val) {
    if (this.bgPicker && val) {
      this.bgPicker.currentBackground = val;
    }
  }

  get textColor() {
    return this.bgPicker ? this.bgPicker.textColor : 'white';
  }

  set textColor(val) {
    if (this.bgPicker && val) {
      this.bgPicker.textColor = val;
    }
  }

  async setBackground(bgObj) {
    if (this.bgPicker) {
      await this.bgPicker.setBackground(bgObj);
    }
  }

  async setTextColor(color) {
    if (this.bgPicker) {
      await this.bgPicker.setTextColor(color);
    }
  }

  updateBackgroundButtonUI() {
    this.bgPicker?.updateTriggerUI();
  }

  updateTextColorUI() {
    this.bgPicker?.updateTextColorUI();
  }

  // ==========================================================================
  // Concordancia Bíblica FTS5 (Búsqueda por palabras en el texto bíblico)
  // ==========================================================================
  async performFtsSearch(query) {
    if (!this.ftsResultsBox) return;
    const clean = (query || '').trim();
    if (clean.length < 3) {
      this.hideFtsResults();
      return;
    }

    try {
      const results = await window.bibleAPI.bible.searchText(clean, 10, this.currentVersion);
      if (results && results.length > 0) {
        this.renderFtsResults(results, clean);
      } else {
        this.renderFtsEmpty(clean);
      }
    } catch (err) {
      console.warn('[BibleController] Error en búsqueda de texto bíblico FTS:', err);
      this.hideFtsResults();
    }
  }

  renderFtsResults(results, query) {
    if (!this.ftsResultsBox) return;
    this.ftsResultsBox.innerHTML = '';
    this.ftsResultsBox.style.display = 'block';

    const header = document.createElement('div');
    header.className = 'fts-dropdown-header';
    header.innerHTML = `
      <span>Concordancia Bíblica — ${results.length} coincidencias encontradas</span>
      <span class="fts-hint">Clic para abrir y proyectar · Esc para cerrar</span>
    `;
    this.ftsResultsBox.appendChild(header);

    const list = document.createElement('div');
    list.className = 'fts-results-list';

    // Palabras para resaltar
    const words = query.split(/\s+/).filter(w => w.length > 1);
    const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const re = pattern ? new RegExp(`(${pattern})`, 'gi') : null;

    results.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'fts-result-row';
      row.dataset.idx = idx;

      let displayText = item.text;
      if (re) {
        displayText = displayText.replace(re, '<mark class="fts-highlight">$1</mark>');
      }

      row.innerHTML = `
        <div class="fts-cite-col">
          <span class="fts-book-name">${item.book_name}</span>
          <span class="fts-ch-verse">${item.chapter}:${item.verse}</span>
        </div>
        <div class="fts-text-col">${displayText}</div>
        <button class="btn-fts-project" title="Ir a este versículo y proyectar">▶</button>
      `;

      row.addEventListener('click', async () => {
        await this.jumpToFtsResult(item, true);
      });

      list.appendChild(row);
    });

    this.ftsResultsBox.appendChild(list);
  }

  renderFtsEmpty(query) {
    if (!this.ftsResultsBox) return;
    this.ftsResultsBox.innerHTML = `
      <div class="fts-dropdown-header">
        <span>Concordancia Bíblica</span>
        <span class="fts-hint">Esc para cerrar</span>
      </div>
      <div class="fts-empty-notice">
        No se encontraron versículos en la versión ${this.currentVersion} con el término: "<b>${query}</b>"
      </div>
    `;
    this.ftsResultsBox.style.display = 'block';
  }

  async jumpToFtsResult(item, autoProject = false) {
    const book = this.books.find(b => b.id === item.book_id || b.name.toLowerCase() === item.book_name.toLowerCase());
    if (book) {
      this.selectedRange = null;
      await this.selectBook(book, item.chapter, item.verse);
      this.hideFtsResults();
      this.hideQuickCiteHUD();
      if (autoProject) {
        await this.projectSelectedVerse();
      }
    }
  }

  hideFtsResults() {
    if (this.ftsResultsBox) {
      this.ftsResultsBox.style.display = 'none';
      this.ftsResultsBox.innerHTML = '';
    }
  }
}

