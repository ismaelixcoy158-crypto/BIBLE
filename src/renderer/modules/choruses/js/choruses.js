import { ProjectionToolbarController } from '../../../shared/js/projection-toolbar.js';
import { BackgroundPickerController } from '../../../shared/js/background-picker.js';

/**
 * BIBLE — ChorusesController
 * Controlador para la búsqueda en Modo Espontáneo, administración de letras y partición de diapositivas.
 * Integra la barra inferior estandarizada con selector de fondo global, color de letra y mayúsculas.
 */
export class ChorusesController {
  constructor() {
    this.choruses = [];
    this.currentChorus = null;
    this.selectedSlideIndex = 0;
    this.isCurrentlyProjecting = false;
    this.editingChorusId = null;

    // Elementos DOM principales
    this.searchInput = document.getElementById('inputChorusFilter') || document.getElementById('spontaneousSearchInput');
    this.btnClearSearch = document.getElementById('btnClearChorusFilter');
    this.chorusCountHeader = document.getElementById('chorusCountHeader');
    this.chorusesList = document.getElementById('chorusesListContainer');
    this.detailTitle = document.getElementById('detailChorusTitle');
    this.detailCategory = document.getElementById('detailChorusCategory');
    this.slidesContainer = document.getElementById('slidesGridContainer');

    // HUD Flotante de Búsqueda Rápida (Idéntico a Cita Rápida de la Biblia)
    this.hudElement = document.getElementById('chorusFloatingQuickCite');
    this.hudRawBuffer = document.getElementById('chorusHudRawBuffer');
    this.hudMatchTitle = document.getElementById('chorusHudMatchTitle');
    this.quickBuffer = '';
    this.lastMatchChorus = null;

    this.btnProjectSlide = document.getElementById('btnProjectActiveSlide');
    this.btnOpenModal = document.getElementById('btnOpenNewChorusModal');
    this.btnEdit = document.getElementById('btnEditCurrentChorus');
    this.btnDelete = document.getElementById('btnDeleteCurrentChorus');

    // Elementos de la Barra Inferior Estandarizada
    this.liveStatusBadge = document.getElementById('liveStatusBadgeChoruses');
    this.liveStatusRef = document.getElementById('liveStatusChorusRef');
    this.checkUppercase = document.getElementById('checkChorusUppercase');
    this.selectChorusRefPosition = document.getElementById('selectChorusRefPosition');
    this.btnBottomPrev = document.getElementById('btnPrevChorusSlide');
    this.btnBottomNext = document.getElementById('btnNextChorusSlide');
    this.btnBottomProject = document.getElementById('btnProjectChorusSlideBottom');
    this.btnShortcuts = document.getElementById('btnOpenChorusShortcutsModal');
    this.shortcutsModal = document.getElementById('chorusShortcutsModal');

    // Modal de Creación / Edición
    this.modal = document.getElementById('chorusEditorModal');
    this.modalTitle = document.getElementById('modalChorusTitle');
    this.inputTitle = document.getElementById('editChorusTitleInput');
    this.selectCategory = document.getElementById('editChorusCategorySelect');
    this.textareaLyrics = document.getElementById('editChorusLyricsTextarea');
    this.btnSave = document.getElementById('btnSaveChorus');
    this.btnCloseModal = document.getElementById('btnCloseChorusModal');
    this.btnCancelModal = document.getElementById('btnCancelEditChorus');

    // Elementos de Repertorios / Listas de Culto del Día
    this.btnAddToRepertoire = document.getElementById('btnAddToRepertoire');
    this.repertoireControlBar = document.getElementById('repertoireControlBar');
    this.selectCurrentPlaylist = document.getElementById('selectCurrentPlaylist');
    this.btnOpenNewPlaylistModal = document.getElementById('btnOpenNewPlaylistModal');
    this.btnEditCurrentPlaylist = document.getElementById('btnEditCurrentPlaylist');
    this.btnDeleteCurrentPlaylist = document.getElementById('btnDeleteCurrentPlaylist');
    this.btnOpenPickChorusModal = document.getElementById('btnOpenPickChorusModal');

    // Modal Crear / Editar Repertorio / Día
    this.modalNewPlaylist = document.getElementById('newPlaylistModal');
    this.modalNewPlaylistTitle = document.getElementById('modalNewPlaylistTitle');
    this.inputNewPlaylistName = document.getElementById('inputNewPlaylistName');
    this.inputNewPlaylistDate = document.getElementById('inputNewPlaylistDate');
    this.btnSaveNewPlaylist = document.getElementById('btnSaveNewPlaylist');
    this.btnSaveNewPlaylistText = document.getElementById('btnSaveNewPlaylistText');
    this.btnCloseNewPlaylistModal = document.getElementById('btnCloseNewPlaylistModal');
    this.btnCancelNewPlaylist = document.getElementById('btnCancelNewPlaylist');
    this.editingPlaylistId = null;

    // Modal Agregar a Repertorio
    this.modalAddToPlaylist = document.getElementById('addToPlaylistModal');
    this.addToPlaylistChorusTitle = document.getElementById('addToPlaylistChorusTitle');
    this.selectTargetPlaylist = document.getElementById('selectTargetPlaylist');
    this.btnConfirmAddToPlaylist = document.getElementById('btnConfirmAddToPlaylist');
    this.btnCloseAddToPlaylistModal = document.getElementById('btnCloseAddToPlaylistModal');
    this.btnCancelAddToPlaylist = document.getElementById('btnCancelAddToPlaylist');

    // Modal Buscar y Añadir Cantos
    this.modalPickChorus = document.getElementById('pickChorusModal');
    this.inputPickChorusSearch = document.getElementById('inputPickChorusSearch');
    this.btnClearPickChorusSearch = document.getElementById('btnClearPickChorusSearch');
    this.pickChorusListContainer = document.getElementById('pickChorusListContainer');
    this.pickChorusSubtitle = document.getElementById('pickChorusSubtitle');
    this.pickChorusStatusText = document.getElementById('pickChorusStatusText');
    this.btnClosePickChorusModal = document.getElementById('btnClosePickChorusModal');
    this.btnClosePickChorusDone = document.getElementById('btnClosePickChorusDone');

    // Búsqueda en Internet (Opción 2)
    this.btnSearchInternetSidebar = document.getElementById('btnSearchInternetSidebar');
    this.cardSearchInternetPrompt = document.getElementById('cardSearchInternetPrompt');
    this.promptInternetQueryText = document.getElementById('promptInternetQueryText');
    this.btnTriggerInternetSearch = document.getElementById('btnTriggerInternetSearch');
    this.pickModalInternetPrompt = document.getElementById('pickModalInternetPrompt');
    this.pickPromptInternetText = document.getElementById('pickPromptInternetText');
    this.btnPickSearchInternet = document.getElementById('btnPickSearchInternet');
    this.hudEnterPill = document.getElementById('hudEnterPill');
    this.isOnlineSearching = false;

    // Estado de Repertorio
    this.playlists = [];
    this.activePlaylistId = null;
    this.playlistItems = [];

    // Contenedor de Pestañas Dinámicas
    this.categoryTabsContainer = document.getElementById('categoryFilterTabs');
    this.currentCategoryFilter = '';

    this.init();
  }

  async init() {
    this.bindEvents();

    // Inicializar componente reutilizable de Barra de Emisión y Fondo (POO estilo Java)
    this.toolbar = new ProjectionToolbarController({
      container: document.querySelector('.choruses-bottom-bar'),
      module: 'choruses',
      onPrev: () => this.selectPreviousSlide(),
      onNext: () => this.selectNextSlide(),
      onProject: () => this.projectSelectedSlide(),
      onRefPositionChange: async () => {
        if (this.isCurrentlyProjecting) {
          await this.projectSelectedSlide();
        }
      },
      onUppercaseChange: () => {
        if (this.isCurrentlyProjecting) {
          this.projectSelectedSlide();
        }
      },
      onBackgroundChange: async () => {
        if (this.isCurrentlyProjecting) {
          await this.projectSelectedSlide();
        }
      },
      onTextColorChange: async () => {
        if (this.isCurrentlyProjecting) {
          await this.projectSelectedSlide();
        }
      }
    });
    await this.toolbar.init();
    this.bgPicker = this.toolbar.bgPicker;

    await this.loadCategories();
    await this.loadChoruses();
    this.initSplitter();
  }

  initSplitter() {
    const colChoruses = document.getElementById('colChoruses');
    const splitter = document.getElementById('splitterChorusesDetail');
    if (!colChoruses || !splitter) return;

    try {
      const savedWidth = localStorage.getItem('choruses_col_width');
      if (savedWidth) {
        const w = parseInt(savedWidth, 10);
        if (w >= 240 && w <= 650) {
          colChoruses.style.width = `${w}px`;
        }
      }
    } catch {}

    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startWidth = colChoruses.getBoundingClientRect().width;
      splitter.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      let newWidth = startWidth + delta;
      if (newWidth < 250) newWidth = 250;
      if (newWidth > 650) newWidth = 650;
      colChoruses.style.width = `${newWidth}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        splitter.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        try {
          localStorage.setItem('choruses_col_width', Math.round(colChoruses.getBoundingClientRect().width));
        } catch {}
      }
    });

    splitter.addEventListener('dblclick', () => {
      colChoruses.style.width = '360px';
      try {
        localStorage.setItem('choruses_col_width', '360');
      } catch {}
    });
  }

  showHUD() {
    if (this.hudElement) this.hudElement.style.display = 'block';
  }

  hideHUD() {
    this.quickBuffer = '';
    this.lastMatchChorus = null;
    if (this.hudElement) this.hudElement.style.display = 'none';
    if (this.hudRawBuffer) this.hudRawBuffer.textContent = '—';
    if (this.hudMatchTitle) this.hudMatchTitle.textContent = '—';
  }

  async updateHUD() {
    const raw = (this.quickBuffer || '').trim();
    if (this.hudRawBuffer) {
      this.hudRawBuffer.textContent = raw || '—';
    }
    if (!raw) {
      this.hideHUD();
      return;
    }
    this.showHUD();

    // Sincronizar texto en el input visual
    if (this.searchInput) {
      this.searchInput.value = raw;
      if (this.btnClearSearch) this.btnClearSearch.style.display = 'flex';
    }

    const results = await window.bibleAPI.choruses.searchSpontaneous(raw);
    this.renderChorusesList(results);

    if (results && results.length > 0) {
      this.lastMatchChorus = results[0];
      if (this.hudMatchTitle) this.hudMatchTitle.textContent = results[0].title;
    } else {
      this.lastMatchChorus = null;
      if (this.hudMatchTitle) this.hudMatchTitle.textContent = 'Sin coincidencias';
    }
  }

  async loadCategories() {
    try {
      this.categories = await window.bibleAPI.choruses.getCategories();
      if (!this.categoryTabsContainer) return;

      this.categoryTabsContainer.innerHTML = '';

      // Pestaña "Todos"
      const btnAll = document.createElement('button');
      btnAll.id = 'tabCatAll';
      btnAll.className = 'category-tab-btn tab-btn active';
      btnAll.dataset.cat = '';
      btnAll.textContent = 'Todos';
      this.categoryTabsContainer.appendChild(btnAll);

      // Pestañas por categoría temática
      (this.categories || []).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-tab-btn tab-btn';
        btn.dataset.cat = String(cat.id);
        const dot = `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background-color:${cat.color || 'var(--accent-primary)'}; margin-right:5px;"></span>`;
        btn.innerHTML = `${dot}<span>${cat.name}</span>`;
        this.categoryTabsContainer.appendChild(btn);
      });

      // Pestaña "Repertorio"
      const btnPlaylist = document.createElement('button');
      btnPlaylist.id = 'tabCatPlaylists';
      btnPlaylist.className = 'category-tab-btn tab-btn';
      btnPlaylist.dataset.cat = 'playlist';
      btnPlaylist.innerHTML = `
        <svg class="icon icon-xs" viewBox="0 0 24 24" style="margin-right:4px;">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        </svg>
        <span>Repertorio</span>
      `;
      this.categoryTabsContainer.appendChild(btnPlaylist);

      // Enlazar eventos de clic en las pestañas generadas
      const tabBtns = this.categoryTabsContainer.querySelectorAll('.category-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          this.currentCategoryFilter = cat;
          if (cat === 'playlist') {
            await this.loadPlaylists();
          } else {
            await this.loadChoruses(cat ? parseInt(cat, 10) : null);
          }
        });
      });

      // Rellenar selector de categorías del modal de creación/edición
      if (this.selectCategory && this.categories) {
        this.selectCategory.innerHTML = '';
        this.categories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = String(cat.id);
          opt.textContent = cat.name;
          this.selectCategory.appendChild(opt);
        });
      }
    } catch (err) {
      console.error('[ChorusesController] Error al cargar categorías:', err);
    }
  }

  async loadChoruses(categoryId = null) {
    try {
      if (this.repertoireControlBar) {
        this.repertoireControlBar.style.display = 'none';
      }
      this.choruses = await window.bibleAPI.choruses.getAll(categoryId);
      this.renderChorusesList(this.choruses);
      if (this.chorusCountHeader) {
        this.chorusCountHeader.textContent = `Coritos (${this.choruses.length})`;
      }
      if (this.choruses.length > 0) {
        await this.selectChorus(this.choruses[0].id);
      }
    } catch (err) {
      console.error('[ChorusesController] Error al cargar coritos:', err);
    }
  }

  // ==========================================================================
  // REPERTORIO / LISTAS DE CULTO DEL DÍA
  // ==========================================================================

  async loadPlaylists() {
    try {
      if (this.repertoireControlBar) {
        this.repertoireControlBar.style.display = 'flex';
      }
      this.playlists = await window.bibleAPI.choruses.getPlaylists();
      this.populatePlaylistSelect();

      if (this.playlists.length > 0) {
        if (!this.activePlaylistId || !this.playlists.some(p => p.id === this.activePlaylistId)) {
          this.activePlaylistId = this.playlists[0].id;
        }
        if (this.selectCurrentPlaylist) {
          this.selectCurrentPlaylist.value = String(this.activePlaylistId);
        }
        await this.loadPlaylistItems(this.activePlaylistId);
      } else {
        this.activePlaylistId = null;
        if (this.chorusCountHeader) {
          this.chorusCountHeader.textContent = 'Repertorio (0)';
        }
        this.renderPlaylistItems([]);
      }
    } catch (err) {
      console.error('[ChorusesController] Error al cargar repertorios:', err);
    }
  }

  populatePlaylistSelect() {
    if (!this.selectCurrentPlaylist) return;
    this.selectCurrentPlaylist.innerHTML = '';
    if (!this.playlists || this.playlists.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Sin repertorios creados';
      this.selectCurrentPlaylist.appendChild(opt);
      return;
    }

    this.playlists.forEach(p => {
      const opt = document.createElement('option');
      opt.value = String(p.id);
      const dateStr = p.service_date ? ` (${p.service_date})` : '';
      opt.textContent = `${p.name}${dateStr} [${p.total_items || 0} cantos]`;
      this.selectCurrentPlaylist.appendChild(opt);
    });
  }

  async loadPlaylistItems(playlistId) {
    if (!playlistId) {
      this.renderPlaylistItems([]);
      return;
    }
    try {
      this.playlistItems = await window.bibleAPI.choruses.getPlaylistItems(playlistId);
      const activePl = this.playlists.find(p => p.id === playlistId);
      if (this.chorusCountHeader) {
        this.chorusCountHeader.textContent = `${activePl ? activePl.name : 'Repertorio'} (${this.playlistItems.length})`;
      }
      this.renderPlaylistItems(this.playlistItems);

      if (this.playlistItems.length > 0) {
        await this.selectChorus(this.playlistItems[0].id);
      }
    } catch (err) {
      console.error('[ChorusesController] Error al cargar cantos del repertorio:', err);
    }
  }

  renderPlaylistItems(items) {
    this.chorusesList.innerHTML = '';
    if (!items || !items.length) {
      this.chorusesList.innerHTML = `
        <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px; line-height: 1.6;">
          <svg class="icon" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 4px;">Este repertorio está vacío</div>
          <p style="margin: 0 0 12px 0;">Añade los cantos que se entonarán en este culto o día especial.</p>
          <button id="btnEmptyAddSongs" class="btn btn-sm btn-primary" style="margin: 0 auto;">
            + Añadir Cantos a este Día
          </button>
        </div>
      `;
      const btnEmpty = document.getElementById('btnEmptyAddSongs');
      btnEmpty?.addEventListener('click', () => this.openPickChorusModal());
      return;
    }

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `chorus-item-card ${this.currentChorus && this.currentChorus.id === item.id ? 'active' : ''}`;
      card.dataset.id = item.id;

      const previewText = (item.lyrics || '').split('\n')[0] || '';

      card.innerHTML = `
        <div class="chorus-card-header">
          <div style="display: flex; align-items: center; min-width: 0; gap: 4px;">
            <span class="repertoire-item-pos">#${index + 1}</span>
            <span class="chorus-card-title">${item.title}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 2px; margin-left: auto;">
            <button class="btn-reorder-repertoire btn-reorder-up" title="Mover hacia arriba" ${index === 0 ? 'disabled' : ''}>
              <svg class="icon icon-xs" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <button class="btn-reorder-repertoire btn-reorder-down" title="Mover hacia abajo" ${index === items.length - 1 ? 'disabled' : ''}>
              <svg class="icon icon-xs" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <button class="btn-remove-repertoire" title="Quitar este canto de este culto">
              <svg class="icon icon-xs" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="chorus-card-snippet">${previewText}</div>
      `;

      const btnUp = card.querySelector('.btn-reorder-up');
      btnUp?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (index > 0) {
          await window.bibleAPI.choruses.reorderPlaylistItem(this.activePlaylistId, item.id, 'up');
          await this.loadPlaylistItems(this.activePlaylistId);
        }
      });

      const btnDown = card.querySelector('.btn-reorder-down');
      btnDown?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (index < items.length - 1) {
          await window.bibleAPI.choruses.reorderPlaylistItem(this.activePlaylistId, item.id, 'down');
          await this.loadPlaylistItems(this.activePlaylistId);
        }
      });

      const btnRemove = card.querySelector('.btn-remove-repertoire');
      btnRemove?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(`¿Quitar "${item.title}" de este repertorio?`)) {
          await window.bibleAPI.choruses.removeFromPlaylist(this.activePlaylistId, item.id);
          this.playlists = await window.bibleAPI.choruses.getPlaylists();
          this.populatePlaylistSelect();
          if (this.selectCurrentPlaylist) this.selectCurrentPlaylist.value = String(this.activePlaylistId);
          await this.loadPlaylistItems(this.activePlaylistId);
        }
      });

      card.addEventListener('click', () => this.selectChorus(item.id));
      this.chorusesList.appendChild(card);
    });
  }

  getTodayDateStr() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getNextDayOfWeek(targetDayOfWeek) {
    const now = new Date();
    const currentDay = now.getDay();
    let diff = targetDayOfWeek - currentDay;
    if (diff < 0) {
      diff += 7;
    }
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getAutoDayName(dateString, presetSuffix = '') {
    if (!dateString) return 'Culto del Día';
    const parts = dateString.split('-');
    if (parts.length !== 3) return 'Culto del Día';
    const [year, month, day] = parts.map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const diaSemana = dias[dateObj.getDay()] || 'Culto';
    const mesNombre = meses[dateObj.getMonth()] || '';

    if (presetSuffix) {
      return `Culto ${diaSemana} ${presetSuffix} (${day} ${mesNombre})`;
    }
    return `Culto ${diaSemana} ${day} ${mesNombre}`;
  }

  applyDayPreset(presetKey) {
    let dateStr = this.getTodayDateStr();
    let suffix = '';

    if (presetKey === 'today') {
      dateStr = this.getTodayDateStr();
      suffix = '';
    } else if (presetKey === 'sunday-morning') {
      dateStr = this.getNextDayOfWeek(0);
      suffix = 'Mañana';
    } else if (presetKey === 'sunday-evening') {
      dateStr = this.getNextDayOfWeek(0);
      suffix = 'Noche';
    } else if (presetKey === 'tuesday') {
      dateStr = this.getNextDayOfWeek(2);
      suffix = 'de Oración';
    } else if (presetKey === 'thursday') {
      dateStr = this.getNextDayOfWeek(4);
      suffix = 'de Doctrina';
    } else if (presetKey === 'vigil') {
      dateStr = this.getTodayDateStr();
      const parts = dateStr.split('-').map(Number);
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      if (this.inputNewPlaylistDate) this.inputNewPlaylistDate.value = dateStr;
      if (this.inputNewPlaylistName) this.inputNewPlaylistName.value = `Vigilia de Poder (${parts[2]} ${meses[parts[1] - 1]})`;
      return;
    }

    if (this.inputNewPlaylistDate) {
      this.inputNewPlaylistDate.value = dateStr;
    }
    if (this.inputNewPlaylistName) {
      this.inputNewPlaylistName.value = this.getAutoDayName(dateStr, suffix);
    }
  }

  openNewPlaylistModal() {
    this.editingPlaylistId = null;
    if (this.modalNewPlaylistTitle) {
      this.modalNewPlaylistTitle.textContent = 'Crear Día de Culto';
    }
    if (this.btnSaveNewPlaylistText) {
      this.btnSaveNewPlaylistText.textContent = 'Crear Día y Elegir Cantos';
    }

    // Activar chip de Hoy por defecto
    const chips = document.querySelectorAll('.btn-day-chip');
    chips.forEach(c => c.classList.remove('active'));
    const todayChip = document.querySelector('.btn-day-chip[data-preset="today"]');
    if (todayChip) todayChip.classList.add('active');

    this.applyDayPreset('today');

    if (this.modalNewPlaylist) {
      this.modalNewPlaylist.style.display = 'flex';
      this.inputNewPlaylistDate?.focus();
    }
  }

  openEditPlaylistModal() {
    if (!this.activePlaylistId) {
      alert('Por favor selecciona primero un repertorio para editar');
      return;
    }
    const currentPl = this.playlists.find(p => p.id === this.activePlaylistId);
    if (!currentPl) return;

    this.editingPlaylistId = currentPl.id;
    if (this.modalNewPlaylistTitle) {
      this.modalNewPlaylistTitle.textContent = `Editar: ${currentPl.name}`;
    }
    if (this.btnSaveNewPlaylistText) {
      this.btnSaveNewPlaylistText.textContent = 'Guardar Cambios';
    }
    if (this.inputNewPlaylistName) {
      this.inputNewPlaylistName.value = currentPl.name || '';
    }
    if (this.inputNewPlaylistDate) {
      this.inputNewPlaylistDate.value = currentPl.service_date || '';
    }
    // Desactivar chips al editar manualmente
    const chips = document.querySelectorAll('.btn-day-chip');
    chips.forEach(c => c.classList.remove('active'));

    if (this.modalNewPlaylist) {
      this.modalNewPlaylist.style.display = 'flex';
      this.inputNewPlaylistName?.focus();
    }
  }

  closeNewPlaylistModal() {
    if (this.modalNewPlaylist) {
      this.modalNewPlaylist.style.display = 'none';
    }
    this.editingPlaylistId = null;
  }

  async saveNewPlaylistFromModal() {
    const serviceDate = this.inputNewPlaylistDate?.value.trim() || this.getTodayDateStr();
    let name = this.inputNewPlaylistName?.value.trim();

    if (!name) {
      name = this.getAutoDayName(serviceDate);
    }

    try {
      if (this.editingPlaylistId) {
        await window.bibleAPI.choruses.updatePlaylist(this.editingPlaylistId, { name, serviceDate });
        const savedId = this.editingPlaylistId;
        this.closeNewPlaylistModal();
        this.activePlaylistId = savedId;
        await this.loadPlaylists();
        if (this.selectCurrentPlaylist) {
          this.selectCurrentPlaylist.value = String(savedId);
        }
        await this.loadPlaylistItems(savedId);
      } else {
        const created = await window.bibleAPI.choruses.createPlaylist({ name, serviceDate });
        this.closeNewPlaylistModal();
        this.activePlaylistId = created.id;
        this.playlistItems = [];

        // Conmutar interfaz a la pestaña Repertorio
        this.currentCategoryFilter = 'playlist';
        const tabBtns = this.categoryTabsContainer?.querySelectorAll('.category-tab-btn');
        tabBtns?.forEach(b => b.classList.toggle('active', b.dataset.cat === 'playlist'));
        if (this.repertoireControlBar) {
          this.repertoireControlBar.style.display = 'flex';
        }

        await this.loadPlaylists();
        if (this.selectCurrentPlaylist) {
          this.selectCurrentPlaylist.value = String(this.activePlaylistId);
        }
        await this.loadPlaylistItems(this.activePlaylistId);

        // Abrir de inmediato el selector de cantos para este día creado
        this.openPickChorusModal();
      }
    } catch (err) {
      alert('Error al guardar repertorio: ' + err.message);
    }
  }

  async deleteCurrentPlaylist() {
    if (!this.activePlaylistId) {
      alert('No hay ningún repertorio seleccionado');
      return;
    }
    const currentPl = this.playlists.find(p => p.id === this.activePlaylistId);
    const plName = currentPl ? currentPl.name : 'este repertorio';
    if (!confirm(`¿Eliminar la lista de culto "${plName}"? Los coritos seguirán estando en la biblioteca general.`)) return;

    try {
      await window.bibleAPI.choruses.deletePlaylist(this.activePlaylistId);
      this.activePlaylistId = null;
      await this.loadPlaylists();
    } catch (err) {
      alert('Error al eliminar repertorio: ' + err.message);
    }
  }

  async openAddToPlaylistModal() {
    if (!this.currentChorus) {
      // Si no hay corito seleccionado, abrir directamente el buscador para encontrar cantos por nombre o letra
      this.openPickChorusModal();
      return;
    }

    // Si ya hay un repertorio activo, agregarlo directamente con 1 clic sin bloquear al usuario
    if (this.activePlaylistId) {
      try {
        await window.bibleAPI.choruses.addToPlaylist(this.activePlaylistId, this.currentChorus.id);
        this.playlists = await window.bibleAPI.choruses.getPlaylists();
        this.populatePlaylistSelect();
        if (this.selectCurrentPlaylist) {
          this.selectCurrentPlaylist.value = String(this.activePlaylistId);
        }
        if (this.currentCategoryFilter === 'playlist') {
          await this.loadPlaylistItems(this.activePlaylistId);
        }
        const activePl = this.playlists.find(p => p.id === this.activePlaylistId);
        alert(`"${this.currentChorus.title}" añadido al repertorio: ${activePl ? activePl.name : 'Culto'}`);
        return;
      } catch (err) {
        alert('Error al agregar al repertorio: ' + err.message);
        return;
      }
    }

    if (this.addToPlaylistChorusTitle) {
      this.addToPlaylistChorusTitle.textContent = this.currentChorus.title;
    }

    // Asegurarse de tener las listas cargadas
    this.playlists = await window.bibleAPI.choruses.getPlaylists();
    if (this.selectTargetPlaylist) {
      this.selectTargetPlaylist.innerHTML = '';
      if (!this.playlists || this.playlists.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Sin repertorios. Crea uno primero con "+ Día".';
        this.selectTargetPlaylist.appendChild(opt);
      } else {
        this.playlists.forEach(p => {
          const opt = document.createElement('option');
          opt.value = String(p.id);
          const dateStr = p.service_date ? ` (${p.service_date})` : '';
          opt.textContent = `${p.name}${dateStr} [${p.total_items || 0} cantos]`;
          if (p.id === this.activePlaylistId) opt.selected = true;
          this.selectTargetPlaylist.appendChild(opt);
        });
      }
    }

    if (this.modalAddToPlaylist) {
      this.modalAddToPlaylist.style.display = 'flex';
    }
  }

  closeAddToPlaylistModal() {
    if (this.modalAddToPlaylist) {
      this.modalAddToPlaylist.style.display = 'none';
    }
  }

  async confirmAddToPlaylist() {
    if (!this.currentChorus || !this.selectTargetPlaylist) return;
    const playlistId = parseInt(this.selectTargetPlaylist.value, 10);
    if (!playlistId) {
      alert('Por favor selecciona un repertorio válido');
      return;
    }

    try {
      await window.bibleAPI.choruses.addToPlaylist(playlistId, this.currentChorus.id);
      this.closeAddToPlaylistModal();

      this.playlists = await window.bibleAPI.choruses.getPlaylists();
      this.populatePlaylistSelect();

      if (this.currentCategoryFilter === 'playlist' && this.activePlaylistId === playlistId) {
        await this.loadPlaylistItems(this.activePlaylistId);
      }

      const targetPl = this.playlists.find(p => p.id === playlistId);
      alert(`"${this.currentChorus.title}" agregado a: ${targetPl ? targetPl.name : 'Repertorio'}`);
    } catch (err) {
      alert('Error al agregar al repertorio: ' + err.message);
    }
  }

  updatePickModalSubtitle() {
    const count = (this.playlistItems || []).length;
    const activePl = this.playlists?.find(p => p.id === this.activePlaylistId);
    const plName = activePl ? activePl.name : 'Culto';
    if (this.pickChorusSubtitle) {
      this.pickChorusSubtitle.textContent = `${plName} • ${count} ${count === 1 ? 'canto en lista' : 'cantos en lista'}`;
    }
    if (this.pickChorusStatusText) {
      this.pickChorusStatusText.textContent = count > 0 
        ? `${count} cantos agregados a este culto. Escribe para buscar más o pulsa "Listo".`
        : 'Haz clic en cualquier corito para agregarlo al culto';
    }
  }

  openPickChorusModal() {
    if (!this.activePlaylistId) {
      if (this.playlists && this.playlists.length > 0) {
        this.activePlaylistId = this.playlists[0].id;
        if (this.selectCurrentPlaylist) {
          this.selectCurrentPlaylist.value = String(this.activePlaylistId);
        }
      } else {
        this.openNewPlaylistModal();
        return;
      }
    }

    const activePl = this.playlists.find(p => p.id === this.activePlaylistId);
    const pickTitleEl = document.querySelector('#pickChorusModal .modal-title');
    if (pickTitleEl && activePl) {
      pickTitleEl.textContent = `Añadir Cantos a: ${activePl.name}`;
    }
    this.updatePickModalSubtitle();

    if (this.modalPickChorus) {
      this.modalPickChorus.style.display = 'flex';
      if (this.inputPickChorusSearch) {
        this.inputPickChorusSearch.value = '';
        if (this.btnClearPickChorusSearch) {
          this.btnClearPickChorusSearch.style.display = 'none';
        }
        setTimeout(() => {
          this.inputPickChorusSearch?.focus();
          this.inputPickChorusSearch?.select();
        }, 50);
      }
      this.searchAndRenderPickChoruses('');
    }
  }

  async closePickChorusModal() {
    if (this.modalPickChorus) {
      this.modalPickChorus.style.display = 'none';
    }
    // Asegurar que la vista principal siempre muestre el repertorio del culto
    this.currentCategoryFilter = 'playlist';
    const tabBtns = this.categoryTabsContainer?.querySelectorAll('.category-tab-btn');
    tabBtns?.forEach(b => b.classList.toggle('active', b.dataset.cat === 'playlist'));
    if (this.repertoireControlBar) {
      this.repertoireControlBar.style.display = 'flex';
    }

    this.playlists = await window.bibleAPI.choruses.getPlaylists();
    this.populatePlaylistSelect();
    if (this.selectCurrentPlaylist && this.activePlaylistId) {
      this.selectCurrentPlaylist.value = String(this.activePlaylistId);
    }
    if (this.activePlaylistId) {
      await this.loadPlaylistItems(this.activePlaylistId);
    }
  }

  async searchAndRenderPickChoruses(queryText) {
    if (!this.pickChorusListContainer) return;
    this.isPickOnlineSearching = false;
    try {
      const q = (queryText || '').trim();
      if (this.btnClearPickChorusSearch) {
        this.btnClearPickChorusSearch.style.display = q ? 'block' : 'none';
      }

      if (q.length >= 2) {
        if (this.pickModalInternetPrompt) {
          this.pickModalInternetPrompt.style.display = 'block';
          if (this.pickPromptInternetText) {
            this.pickPromptInternetText.textContent = `¿No está en la lista? Buscar "${q}" en Internet`;
          }
        }
      } else {
        if (this.pickModalInternetPrompt) {
          this.pickModalInternetPrompt.style.display = 'none';
        }
      }

      const results = await window.bibleAPI.choruses.searchSpontaneous(q, 50);
      if (this.isPickOnlineSearching) return;
      this.pickChorusListContainer.innerHTML = '';

      if (!results || results.length === 0) {
        this.pickChorusListContainer.innerHTML = `
          <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
            <div>No se encontraron coritos locales con "<strong>${q}</strong>".</div>
            <div style="margin-top: 12px;">
              <button id="btnEmptyModalSearchOnline" class="btn btn-sm btn-primary" style="margin: 0 auto; display: inline-flex; align-items: center; gap: 6px;">
                <svg class="icon icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>Buscar "${q}" en Internet</span>
              </button>
            </div>
          </div>
        `;
        document.getElementById('btnEmptyModalSearchOnline')?.addEventListener('click', () => {
          this.executePickModalOnlineSearch(q);
        });
        return;
      }

      const existingIds = new Set((this.playlistItems || []).map(item => item.id));

      results.forEach(c => {
        const itemEl = document.createElement('div');
        const isAlreadyAdded = existingIds.has(c.id);
        itemEl.className = `pick-chorus-item ${isAlreadyAdded ? 'picked' : ''}`;

        const previewText = (c.lyrics || '').split('\n')[0] || '';
        const existingIndex = isAlreadyAdded 
          ? this.playlistItems.findIndex(it => it.id === c.id) + 1 
          : null;

        itemEl.innerHTML = `
          <div class="pick-chorus-info" style="flex: 1; min-width: 0;">
            <span class="pick-chorus-title">${c.title}</span>
            <span class="pick-chorus-preview">${c.match_snippet || previewText}</span>
          </div>
          <button class="btn btn-sm ${isAlreadyAdded ? 'btn-secondary' : 'btn-primary'} btn-add-pick" style="flex-shrink: 0;" ${isAlreadyAdded ? 'disabled' : ''}>
            ${isAlreadyAdded ? `En lista (#${existingIndex})` : '+ Añadir'}
          </button>
        `;

        const btnAdd = itemEl.querySelector('.btn-add-pick');

        const doAddChorus = async () => {
          if (existingIds.has(c.id)) return;
          try {
            await window.bibleAPI.choruses.addToPlaylist(this.activePlaylistId, c.id);
            existingIds.add(c.id);
            this.playlistItems = await window.bibleAPI.choruses.getPlaylistItems(this.activePlaylistId);
            const pos = this.playlistItems.length;
            btnAdd.textContent = `Añadido (#${pos})`;
            btnAdd.classList.remove('btn-primary');
            btnAdd.classList.add('btn-secondary');
            btnAdd.disabled = true;
            itemEl.classList.add('picked');
            this.updatePickModalSubtitle();
          } catch (err) {
            console.error('[ChorusesController] Error al añadir canto:', err);
          }
        };

        if (!isAlreadyAdded) {
          btnAdd.addEventListener('click', (e) => {
            e.stopPropagation();
            doAddChorus();
          });
          itemEl.addEventListener('click', doAddChorus);
        }

        this.pickChorusListContainer.appendChild(itemEl);
      });
    } catch (err) {
      console.error('[ChorusesController] Error al buscar en selector de cantos:', err);
    }
  }

  async executePickModalOnlineSearch(queryText) {
    const q = (queryText || '').trim();
    if (!q || !this.pickChorusListContainer) return;

    this.isPickOnlineSearching = true;

    if (this.pickModalInternetPrompt) {
      this.pickModalInternetPrompt.style.display = 'none';
    }

    this.pickChorusListContainer.innerHTML = `
      <div style="padding: 30px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
        <svg class="icon" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 4px;">Buscando "${q}" en Internet...</div>
        <div style="font-size: 11px;">Consultando base de datos de alabanzas y letras cristianas...</div>
      </div>
    `;

    try {
      const onlineResults = await window.bibleAPI.choruses.searchOnline(q);
      this.pickChorusListContainer.innerHTML = '';

      if (!onlineResults || onlineResults.length === 0) {
        this.pickChorusListContainer.innerHTML = `
          <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
            <svg class="icon" style="width: 28px; height: 28px; margin-bottom: 6px; opacity: 0.5;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div style="font-weight: 600; color: var(--text-primary);">No se encontraron cantos en internet para "${q}".</div>
            <div style="margin-top: 4px; font-size: 11px;">Verifica la ortografía o intenta con otra palabra clave.</div>
          </div>
        `;
        return;
      }

      const infoHeader = document.createElement('div');
      infoHeader.style.cssText = 'padding: 6px 10px; font-size: 11px; color: var(--text-muted); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center; background: rgba(37,99,235,0.08); border-radius: 4px; margin-bottom: 6px;';
      infoHeader.innerHTML = `
        <span style="color: var(--accent-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
          <svg class="icon icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>Encontrados en Internet (Se guardarán en biblioteca):</span>
        </span>
        <span style="font-weight: 700; color: var(--text-primary);">${onlineResults.length} cantos</span>
      `;
      this.pickChorusListContainer.appendChild(infoHeader);

      onlineResults.forEach(c => {
        const itemEl = document.createElement('div');
        itemEl.className = 'pick-chorus-item';

        itemEl.innerHTML = `
          <div class="pick-chorus-info" style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="pick-chorus-title">${c.title}</span>
              <span class="search-internet-badge"><svg class="icon icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> ${c.artist || 'Internet'}</span>
            </div>
            <span class="pick-chorus-preview">${c.match_snippet}</span>
          </div>
          <button class="btn btn-sm btn-primary btn-add-pick" style="flex-shrink: 0;">
            + Añadir y Guardar
          </button>
        `;

        const btnAdd = itemEl.querySelector('.btn-add-pick');

        const doAddOnline = async () => {
          if (btnAdd.disabled) return;
          try {
            btnAdd.textContent = 'Guardando...';
            btnAdd.disabled = true;

            const saved = await window.bibleAPI.choruses.create({
              title: c.artist ? `${c.title} (${c.artist})` : c.title,
              lyrics: c.lyrics,
              category_id: 2
            });

            if (this.activePlaylistId) {
              await window.bibleAPI.choruses.addToPlaylist(this.activePlaylistId, saved.id);
              this.playlistItems = await window.bibleAPI.choruses.getPlaylistItems(this.activePlaylistId);
              btnAdd.textContent = `Guardado (#${this.playlistItems.length})`;
            } else {
              btnAdd.textContent = 'Guardado en Biblioteca';
            }

            btnAdd.classList.remove('btn-primary');
            btnAdd.classList.add('btn-secondary');
            itemEl.classList.add('picked');
            this.updatePickModalSubtitle();

            this.playlists = await window.bibleAPI.choruses.getPlaylists();
            this.populatePlaylistSelect();
          } catch (err) {
            btnAdd.disabled = false;
            btnAdd.textContent = '+ Añadir y Guardar';
            alert('Error al guardar canto de internet: ' + err.message);
          }
        };

        btnAdd.addEventListener('click', (e) => {
          e.stopPropagation();
          doAddOnline();
        });
        itemEl.addEventListener('click', doAddOnline);

        this.pickChorusListContainer.appendChild(itemEl);
      });
    } catch (err) {
      console.error('[ChorusesController] Error al buscar cantos en internet:', err);
      this.pickChorusListContainer.innerHTML = `
        <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
          Error al consultar internet: ${err.message}. Verifica tu conexión de red.
        </div>
      `;
    }
  }

  async executeInternetSearch(queryText) {
    const q = (queryText || '').trim();
    if (!q || !this.chorusesList) return;

    this.isOnlineSearching = true;

    if (this.cardSearchInternetPrompt) {
      this.cardSearchInternetPrompt.style.display = 'none';
    }

    this.chorusesList.innerHTML = `
      <div style="padding: 30px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
        <svg class="icon" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 4px;">Buscando "${q}" en Internet...</div>
        <div style="font-size: 11px;">Consultando base de datos de alabanzas y letras cristianas...</div>
      </div>
    `;

    try {
      const onlineResults = await window.bibleAPI.choruses.searchOnline(q);
      this.chorusesList.innerHTML = '';

      if (!onlineResults || onlineResults.length === 0) {
        this.chorusesList.innerHTML = `
          <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
            <svg class="icon" style="width: 28px; height: 28px; margin-bottom: 6px; opacity: 0.5;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div style="font-weight: 600; color: var(--text-primary);">No se encontraron cantos en internet para "${q}".</div>
            <div style="margin-top: 4px; font-size: 11px;">Intenta con otra palabra o revisa tu conexión a internet.</div>
          </div>
        `;
        return;
      }

      const infoHeader = document.createElement('div');
      infoHeader.style.cssText = 'padding: 6px 10px; font-size: 11px; color: var(--text-muted); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center; background: rgba(37,99,235,0.08);';
      infoHeader.innerHTML = `
        <span style="color: var(--accent-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
          <svg class="icon icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>Encontrados en Internet:</span>
        </span>
        <span style="font-weight: 700; color: var(--text-primary);">${onlineResults.length} cantos</span>
      `;
      this.chorusesList.appendChild(infoHeader);

      const isRepMode = this.currentCategoryFilter === 'playlist' && this.activePlaylistId;

      onlineResults.forEach(c => {
        const card = document.createElement('div');
        card.className = 'chorus-item-card';

        card.innerHTML = `
          <div class="chorus-card-header">
            <div style="display: flex; align-items: center; min-width: 0; gap: 6px; flex: 1;">
              <span class="chorus-card-title">${c.title}</span>
              <span class="search-internet-badge"><svg class="icon icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> ${c.artist || 'Internet'}</span>
            </div>
            <button class="btn btn-sm btn-primary btn-save-online" style="font-size: 10px; padding: 2px 7px; flex-shrink: 0;">
              ${isRepMode ? '+ Añadir y Guardar' : 'Guardar'}
            </button>
          </div>
          <div class="chorus-card-snippet">${c.match_snippet}</div>
        `;

        const btnSave = card.querySelector('.btn-save-online');
        const doSave = async () => {
          if (btnSave.disabled) return;
          try {
            btnSave.textContent = 'Guardando...';
            btnSave.disabled = true;

            const saved = await window.bibleAPI.choruses.create({
              title: c.artist ? `${c.title} (${c.artist})` : c.title,
              lyrics: c.lyrics,
              category_id: 2
            });

            if (isRepMode) {
              await window.bibleAPI.choruses.addToPlaylist(this.activePlaylistId, saved.id);
              this.playlistItems = await window.bibleAPI.choruses.getPlaylistItems(this.activePlaylistId);
              btnSave.textContent = `En culto (#${this.playlistItems.length})`;
            } else {
              btnSave.textContent = 'Guardado';
            }

            btnSave.classList.remove('btn-primary');
            btnSave.classList.add('btn-secondary');
            card.classList.add('picked');

            await this.selectChorus(saved.id);
          } catch (err) {
            btnSave.disabled = false;
            btnSave.textContent = isRepMode ? '+ Añadir y Guardar' : 'Guardar';
            alert('Error al guardar canto: ' + err.message);
          }
        };

        btnSave.addEventListener('click', (e) => {
          e.stopPropagation();
          doSave();
        });

        card.addEventListener('click', () => {
          this.selectOnlineChorus(c);
        });

        this.chorusesList.appendChild(card);
      });

      if (onlineResults.length > 0) {
        this.selectOnlineChorus(onlineResults[0]);
      }
    } catch (err) {
      console.error('[ChorusesController] Error al buscar en internet:', err);
      this.chorusesList.innerHTML = `
        <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
          Error al consultar internet: ${err.message}. Verifica tu conexión.
        </div>
      `;
    }
  }

  selectOnlineChorus(item) {
    this.currentChorus = {
      id: null,
      title: item.artist ? `${item.title} (${item.artist})` : item.title,
      lyrics: item.lyrics,
      slides: item.slides || [],
      isOnline: true,
      artist: item.artist
    };
    this.selectedSlideIndex = 0;

    const cards = this.chorusesList.querySelectorAll('.chorus-item-card');
    cards.forEach(card => card.classList.remove('active'));

    this.detailTitle.textContent = this.currentChorus.title;
    this.detailCategory.textContent = item.artist ? item.artist : 'Internet';

    this.renderSlides(item.slides || []);
  }

  renderPlaylistSearchResults(results) {
    this.chorusesList.innerHTML = '';
    if (!results || !results.length) {
      this.chorusesList.innerHTML = `
        <div style="padding: 24px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
          No se encontraron coritos por título o letra.
        </div>
      `;
      return;
    }

    const currentPl = this.playlists.find(p => p.id === this.activePlaylistId);
    const existingIds = new Set(this.playlistItems.map(item => item.id));

    const infoHeader = document.createElement('div');
    infoHeader.style.cssText = 'padding: 6px 10px; font-size: 11px; color: var(--text-muted); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center; background: rgba(37,99,235,0.06);';
    infoHeader.innerHTML = `
      <span>Resultados para añadir a: <strong style="color: var(--text-primary);">${currentPl ? currentPl.name : 'Culto'}</strong></span>
      <span style="font-weight: 700; color: var(--accent-primary);">${results.length} cantos</span>
    `;
    this.chorusesList.appendChild(infoHeader);

    results.forEach(c => {
      const card = document.createElement('div');
      card.className = `chorus-item-card ${this.currentChorus && this.currentChorus.id === c.id ? 'active' : ''}`;
      card.dataset.id = c.id;

      const previewText = (c.lyrics || '').split('\n')[0] || '';
      const isAlreadyAdded = existingIds.has(c.id);

      card.innerHTML = `
        <div class="chorus-card-header">
          <div style="display: flex; align-items: center; min-width: 0; gap: 6px; flex: 1;">
            <span class="chorus-card-title">${c.title}</span>
          </div>
          <button class="btn btn-sm ${isAlreadyAdded ? 'btn-secondary' : 'btn-primary'} btn-quick-add-rep" style="font-size: 10px; padding: 2px 7px; flex-shrink: 0;" ${isAlreadyAdded ? 'disabled' : ''}>
            ${isAlreadyAdded ? 'En culto' : '+ Añadir'}
          </button>
        </div>
        <div class="chorus-card-snippet">${c.match_snippet || previewText}</div>
      `;

      const btnAdd = card.querySelector('.btn-quick-add-rep');
      if (!isAlreadyAdded) {
        btnAdd?.addEventListener('click', async (e) => {
          e.stopPropagation();
          await window.bibleAPI.choruses.addToPlaylist(this.activePlaylistId, c.id);
          existingIds.add(c.id);
          this.playlistItems = await window.bibleAPI.choruses.getPlaylistItems(this.activePlaylistId);
          const pos = this.playlistItems.length;
          btnAdd.textContent = `En culto (#${pos})`;
          btnAdd.classList.remove('btn-primary');
          btnAdd.classList.add('btn-secondary');
          btnAdd.disabled = true;

          this.playlists = await window.bibleAPI.choruses.getPlaylists();
          this.populatePlaylistSelect();
          if (this.selectCurrentPlaylist) {
            this.selectCurrentPlaylist.value = String(this.activePlaylistId);
          }
          if (this.chorusCountHeader) {
            const activePl = this.playlists.find(p => p.id === this.activePlaylistId);
            this.chorusCountHeader.textContent = `${activePl ? activePl.name : 'Repertorio'} (${this.playlistItems.length})`;
          }
        });
      }

      card.addEventListener('click', () => this.selectChorus(c.id));
      this.chorusesList.appendChild(card);
    });
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
        card.scrollIntoView({ behavior: 'auto', block: 'nearest' });
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
    let slideText = this.currentChorus.slides[this.selectedSlideIndex];
    if (!slideText) return;

    if (this.checkUppercase && this.checkUppercase.checked) {
      slideText = slideText.toUpperCase();
    }

    const payload = {
      title: this.currentChorus.title,
      slideText,
      refPosition: this.selectChorusRefPosition ? this.selectChorusRefPosition.value : 'top',
      background: this.bgPicker ? this.bgPicker.currentBackground : null,
      textColor: this.bgPicker ? this.bgPicker.textColor : 'white'
    };

    await window.bibleAPI.choruses.projectSlide(payload);

    this.isCurrentlyProjecting = true;

    // Actualizar indicador EN AIRE en la barra inferior
    if (this.liveStatusRef) {
      this.liveStatusRef.textContent = `${this.currentChorus.title} (D${this.selectedSlideIndex + 1})`;
    }
    if (this.liveStatusBadge) {
      this.liveStatusBadge.classList.add('live');
    }

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
    this.inputTitle.focus();
  }

  openEditModal() {
    if (!this.currentChorus) return;
    this.editingChorusId = this.currentChorus.id;
    this.modalTitle.textContent = `Editar: ${this.currentChorus.title}`;
    this.inputTitle.value = this.currentChorus.title;
    this.textareaLyrics.value = this.currentChorus.lyrics;
    this.selectCategory.value = String(this.currentChorus.category_id || '1');
    this.modal.style.display = 'flex';
    this.inputTitle.focus();
  }

  closeModal() {
    this.modal.style.display = 'none';
    this.editingChorusId = null;
  }

  async saveChorusFromModal() {
    const title = this.inputTitle.value.trim();
    const lyrics = this.textareaLyrics.value.trim();
    const categoryId = parseInt(this.selectCategory.value, 10);

    if (!title || !lyrics) {
      alert('Por favor ingresa un título y la letra del corito.');
      return;
    }

    try {
      if (this.editingChorusId) {
        await window.bibleAPI.choruses.update(this.editingChorusId, {
          title,
          lyrics,
          category_id: categoryId
        });
      } else {
        await window.bibleAPI.choruses.create({
          title,
          lyrics,
          category_id: categoryId
        });
      }
      this.closeModal();
      await this.loadChoruses(this.currentCategoryFilter ? parseInt(this.currentCategoryFilter, 10) : null);
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
    // 1. Modo Espontáneo: Búsqueda reactiva mientras se escribe (TÍTULO O CUALQUIER FRASE DE LA LETRA)
    this.searchInput?.addEventListener('input', async () => {
      this.isOnlineSearching = false;
      const q = this.searchInput.value.trim();
      if (this.btnClearSearch) {
        this.btnClearSearch.style.display = q ? 'flex' : 'none';
      }

      if (q.length >= 2) {
        if (this.btnSearchInternetSidebar) this.btnSearchInternetSidebar.style.display = 'inline-flex';
        if (this.hudEnterPill) this.hudEnterPill.style.display = 'none';
        if (this.cardSearchInternetPrompt) {
          this.cardSearchInternetPrompt.style.display = 'block';
          if (this.promptInternetQueryText) {
            this.promptInternetQueryText.textContent = `Buscar "${q}" en Internet`;
          }
        }
      } else {
        if (this.btnSearchInternetSidebar) this.btnSearchInternetSidebar.style.display = 'none';
        if (this.hudEnterPill) this.hudEnterPill.style.display = 'inline-flex';
        if (this.cardSearchInternetPrompt) this.cardSearchInternetPrompt.style.display = 'none';
      }

      if (this.currentCategoryFilter === 'playlist') {
        if (!q) {
          await this.loadPlaylistItems(this.activePlaylistId);
          return;
        }
        // Buscar en la biblioteca completa de 940 cantos por título o letra para añadir a este día
        const results = await window.bibleAPI.choruses.searchSpontaneous(q, 40);
        if (!this.isOnlineSearching) {
          this.renderPlaylistSearchResults(results);
        }
      } else {
        const results = await window.bibleAPI.choruses.searchSpontaneous(q);
        if (!this.isOnlineSearching) {
          this.renderChorusesList(results);
          if (this.chorusCountHeader) {
            this.chorusCountHeader.textContent = `Coritos (${results.length})`;
          }
        }
      }
    });

    // Disparadores de búsqueda en internet (Opción 2)
    const triggerOnlineSearch = () => {
      const q = this.searchInput?.value.trim();
      if (q) this.executeInternetSearch(q);
    };
    this.btnSearchInternetSidebar?.addEventListener('click', triggerOnlineSearch);
    this.btnTriggerInternetSearch?.addEventListener('click', triggerOnlineSearch);

    this.btnPickSearchInternet?.addEventListener('click', () => {
      const q = this.inputPickChorusSearch?.value.trim();
      if (q) this.executePickModalOnlineSearch(q);
    });

    this.btnClearSearch?.addEventListener('click', async () => {
      if (this.searchInput) this.searchInput.value = '';
      if (this.btnClearSearch) this.btnClearSearch.style.display = 'none';
      if (this.btnSearchInternetSidebar) this.btnSearchInternetSidebar.style.display = 'none';
      if (this.hudEnterPill) this.hudEnterPill.style.display = 'inline-flex';
      if (this.cardSearchInternetPrompt) this.cardSearchInternetPrompt.style.display = 'none';
      if (this.currentCategoryFilter === 'playlist') {
        await this.loadPlaylistItems(this.activePlaylistId);
      } else {
        await this.loadChoruses(this.currentCategoryFilter ? parseInt(this.currentCategoryFilter, 10) : null);
      }
      this.searchInput?.focus();
    });

    // 2. Modo Espontáneo: Enter para proyectar de inmediato el primer resultado
    this.searchInput?.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstCard = this.chorusesList.querySelector('.chorus-item-card');
        if (firstCard) {
          const id = parseInt(firstCard.dataset.id, 10);
          await this.selectChorus(id);
          await this.projectSelectedSlide();
          this.searchInput.value = '';
          if (this.btnClearSearch) this.btnClearSearch.style.display = 'none';
          if (this.currentCategoryFilter === 'playlist') {
            await this.loadPlaylistItems(this.activePlaylistId);
          } else {
            await this.loadChoruses();
          }
        }
      }
    });

    // 3. Proyectar diapositiva activa
    this.btnProjectSlide?.addEventListener('click', () => this.projectSelectedSlide());
    this.btnBottomProject?.addEventListener('click', () => this.projectSelectedSlide());

    // 4. Navegación inferior
    this.btnBottomPrev?.addEventListener('click', () => this.prevSlide());
    this.btnBottomNext?.addEventListener('click', () => this.nextSlide());

    // 5. Cambio de mayúsculas
    this.checkUppercase?.addEventListener('change', async () => {
      if (this.isCurrentlyProjecting) {
        await this.projectSelectedSlide();
      }
    });

    // 6. Modal CRUD de Coritos
    this.btnOpenModal?.addEventListener('click', () => this.openCreateModal());
    this.btnEdit?.addEventListener('click', () => this.openEditModal());
    this.btnDelete?.addEventListener('click', () => this.deleteCurrentChorus());
    this.btnCloseModal?.addEventListener('click', () => this.closeModal());
    this.btnCancelModal?.addEventListener('click', () => this.closeModal());
    this.btnSave?.addEventListener('click', () => this.saveChorusFromModal());

    // 7. Repertorios / Listas de Culto del Día
    this.selectCurrentPlaylist?.addEventListener('change', async () => {
      const val = parseInt(this.selectCurrentPlaylist.value, 10);
      if (val) {
        this.activePlaylistId = val;
        await this.loadPlaylistItems(this.activePlaylistId);
      }
    });

    this.btnOpenNewPlaylistModal?.addEventListener('click', () => this.openNewPlaylistModal());
    this.btnEditCurrentPlaylist?.addEventListener('click', () => this.openEditPlaylistModal());
    this.btnCloseNewPlaylistModal?.addEventListener('click', () => this.closeNewPlaylistModal());
    this.btnCancelNewPlaylist?.addEventListener('click', () => this.closeNewPlaylistModal());
    this.btnSaveNewPlaylist?.addEventListener('click', () => this.saveNewPlaylistFromModal());
    this.btnDeleteCurrentPlaylist?.addEventListener('click', () => this.deleteCurrentPlaylist());

    // Actualización automática del nombre al cambiar la fecha del culto
    this.inputNewPlaylistDate?.addEventListener('change', () => {
      if (!this.editingPlaylistId && this.inputNewPlaylistDate?.value) {
        document.querySelectorAll('.btn-day-chip').forEach(c => c.classList.remove('active'));
        if (this.inputNewPlaylistName) {
          this.inputNewPlaylistName.value = this.getAutoDayName(this.inputNewPlaylistDate.value);
        }
      }
    });

    // Chips de selección rápida de día
    document.querySelectorAll('.btn-day-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.btn-day-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const preset = chip.dataset.preset;
        if (preset) this.applyDayPreset(preset);
      });
    });

    // Crear al pulsar Enter dentro de los inputs del modal
    const onEnterSubmitPlaylist = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.saveNewPlaylistFromModal();
      }
    };
    this.inputNewPlaylistDate?.addEventListener('keydown', onEnterSubmitPlaylist);
    this.inputNewPlaylistName?.addEventListener('keydown', onEnterSubmitPlaylist);

    this.btnAddToRepertoire?.addEventListener('click', () => this.openAddToPlaylistModal());
    this.btnCloseAddToPlaylistModal?.addEventListener('click', () => this.closeAddToPlaylistModal());
    this.btnCancelAddToPlaylist?.addEventListener('click', () => this.closeAddToPlaylistModal());
    this.btnConfirmAddToPlaylist?.addEventListener('click', () => this.confirmAddToPlaylist());

    this.btnOpenPickChorusModal?.addEventListener('click', () => this.openPickChorusModal());
    this.btnClosePickChorusModal?.addEventListener('click', () => this.closePickChorusModal());
    this.btnClosePickChorusDone?.addEventListener('click', () => this.closePickChorusModal());

    let pickDebounceTimer = null;
    this.inputPickChorusSearch?.addEventListener('input', () => {
      if (pickDebounceTimer) clearTimeout(pickDebounceTimer);
      pickDebounceTimer = setTimeout(() => {
        this.searchAndRenderPickChoruses(this.inputPickChorusSearch.value.trim());
      }, 40);
    });

    this.btnClearPickChorusSearch?.addEventListener('click', () => {
      if (this.inputPickChorusSearch) {
        this.inputPickChorusSearch.value = '';
        this.inputPickChorusSearch.focus();
        this.searchAndRenderPickChoruses('');
      }
    });

    this.inputPickChorusSearch?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstBtn = this.pickChorusListContainer?.querySelector('.btn-add-pick:not(:disabled)');
        if (firstBtn) {
          firstBtn.click();
        }
      } else if (e.key === 'Escape') {
        if (this.inputPickChorusSearch.value) {
          e.preventDefault();
          this.inputPickChorusSearch.value = '';
          this.searchAndRenderPickChoruses('');
        } else {
          this.closePickChorusModal();
        }
      }
    });

    // Mantener foco en el buscador del selector al hacer clic en el diálogo
    document.querySelector('#pickChorusModal .modal-card')?.addEventListener('click', (e) => {
      if (!['BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName) && !e.target.closest('.pick-chorus-item')) {
        this.inputPickChorusSearch?.focus();
      }
    });

    // 7. Modal de Atajos de Teclado
    const shortcutsModal = document.getElementById('chorusShortcutsModal');
    const btnOpenShortcuts = document.getElementById('btnOpenChorusShortcutsModal');
    const btnCloseShortcuts = document.getElementById('btnCloseChorusShortcutsModal');
    const btnGotItShortcuts = document.getElementById('btnGotItChorusShortcuts');
    const backdropShortcuts = document.getElementById('backdropChorusShortcuts');

    const openShortcuts = () => { if (shortcutsModal) shortcutsModal.style.display = 'flex'; };
    const closeShortcuts = () => { if (shortcutsModal) shortcutsModal.style.display = 'none'; };

    btnOpenShortcuts?.addEventListener('click', openShortcuts);
    btnCloseShortcuts?.addEventListener('click', closeShortcuts);
    btnGotItShortcuts?.addEventListener('click', closeShortcuts);
    backdropShortcuts?.addEventListener('click', closeShortcuts);

    // 8. Navegación por teclado y búsqueda libre estilo Biblia (HUD Flotante)
    window.addEventListener('keydown', async (e) => {
      // Verificar si el módulo activo en el Shell es 'choruses'.
      const activeNav = document.querySelector('.nav-item.active');
      if (activeNav && activeNav.dataset.module !== 'choruses') {
        return;
      }

      // Si algún modal está abierto, NO interceptar ninguna tecla para atajos globales
      const isAnyModalOpen = Array.from(document.querySelectorAll('.modal-overlay'))
        .some(m => m.style.display === 'flex' || m.style.display === 'block');
      if (isAnyModalOpen) {
        if (e.key === 'Escape') {
          if (this.modalPickChorus && this.modalPickChorus.style.display === 'flex') {
            this.closePickChorusModal();
          } else if (this.modalNewPlaylist && this.modalNewPlaylist.style.display === 'flex') {
            this.closeNewPlaylistModal();
          } else if (this.modal && this.modal.style.display === 'flex') {
            this.closeModal();
          } else if (this.modalAddToPlaylist && this.modalAddToPlaylist.style.display === 'flex') {
            this.closeAddToPlaylistModal();
          }
        }
        return;
      }

      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      // Teclado libre: Escribir para búsqueda rápida / HUD flotante (estilo Holyrics / Biblia)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'Backspace') {
          if (this.quickBuffer.length > 0) {
            e.preventDefault();
            this.quickBuffer = this.quickBuffer.slice(0, -1);
            await this.updateHUD();
            return;
          }
        } else if (e.key === 'Escape') {
          if (this.quickBuffer) {
            e.preventDefault();
            this.hideHUD();
            if (this.searchInput) this.searchInput.value = '';
            if (this.btnClearSearch) this.btnClearSearch.style.display = 'none';
            await this.loadChoruses(this.currentCategoryFilter ? parseInt(this.currentCategoryFilter, 10) : null);
            return;
          }
        } else if (e.key === 'Enter') {
          if (this.quickBuffer && this.lastMatchChorus) {
            e.preventDefault();
            await this.selectChorus(this.lastMatchChorus.id);
            await this.projectSelectedSlide();
            this.hideHUD();
            return;
          }
        } else if (e.key.length === 1 && !e.repeat) {
          if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]$/.test(e.key)) {
            e.preventDefault();
            this.quickBuffer += e.key;
            await this.updateHUD();
            return;
          }
        }
      }

      if (e.key === 'Escape') {
        if (shortcutsModal && shortcutsModal.style.display === 'flex') {
          closeShortcuts();
          return;
        }
        if (this.modal && this.modal.style.display === 'flex') {
          this.closeModal();
          return;
        }
      }

      if (e.key === '?') {
        e.preventDefault();
        openShortcuts();
        return;
      }

      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        if (this.checkUppercase) {
          this.checkUppercase.checked = !this.checkUppercase.checked;
          if (this.isCurrentlyProjecting) {
            this.projectSelectedSlide();
          }
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.projectSelectedSlide();
      }
    });

    // Control Remoto Móvil (Wi-Fi)
    window.addEventListener('remote-control:action', (e) => {
      if (e.detail?.action === 'next') {
        this.nextSlide();
      } else if (e.detail?.action === 'prev') {
        this.prevSlide();
      }
    });
  }
}
