/**
 * BIBLE — RouletteController
 * Motor de física de giro, renderizado en Canvas, gestión de valores y sincronización de ruleta.
 */
export class RouletteController {
  constructor() {
    this.lists = [];
    this.currentList = null;
    this.items = [];
    this.currentRotation = 0; // en radianes
    this.isSpinning = false;
    this.isProjected = false;
    this.lastWinningItem = null;

    // Web Audio para efectos de sonido (100% offline)
    this.audioCtx = null;

    // Elementos DOM Principales
    this.canvas = document.getElementById('rouletteCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.selectList = document.getElementById('selectRouletteList');
    this.itemsListContainer = document.getElementById('rouletteItemsList');
    this.inputNewItem = document.getElementById('inputNewItemLabel');
    this.btnAddItem = document.getElementById('btnAddItem');
    this.btnProject = document.getElementById('btnProjectRoulette');
    this.txtBtnProject = document.getElementById('txtBtnProject');
    this.rouletteTallyChip = document.getElementById('rouletteTallyChip');
    this.txtTallyStatus = document.getElementById('txtTallyStatus');

    // Botones de Listas y Elementos
    this.btnCreateList = document.getElementById('btnCreateNewList');
    this.btnRenameList = document.getElementById('btnRenameCurrentList');
    this.btnDeleteList = document.getElementById('btnDeleteCurrentList');
    this.btnOpenBatchAdd = document.getElementById('btnOpenBatchAdd');
    this.btnShuffleItems = document.getElementById('btnShuffleItems');
    this.btnClearAllItems = document.getElementById('btnClearAllItems');
    this.counterLabel = document.getElementById('itemsCounterLabel');

    // Opciones
    this.chkAutoRemoveWinner = document.getElementById('chkAutoRemoveWinner');
    this.chkSoundEffects = document.getElementById('chkSoundEffects');

    // Botones de Giro
    this.btnSpinMaster = document.getElementById('btnSpinRouletteMaster');
    this.btnCenterHub = document.getElementById('btnCenterHub');

    // Banner de Ganador
    this.winnerBanner = document.getElementById('winnerBanner');
    this.winnerLabelText = document.getElementById('winnerLabelText');
    this.btnSpinAgain = document.getElementById('btnSpinAgain');
    this.btnRemoveWinnerFromList = document.getElementById('btnRemoveWinnerFromList');
    this.btnCloseWinnerBanner = document.getElementById('btnCloseWinnerBanner');

    // Modales
    this.modalNewList = document.getElementById('modalNewList');
    this.inputNewListName = document.getElementById('inputNewListName');
    this.inputNewListInitialItems = document.getElementById('inputNewListInitialItems');
    this.btnCloseModalNewList = document.getElementById('btnCloseModalNewList');
    this.btnCancelModalNewList = document.getElementById('btnCancelModalNewList');
    this.btnConfirmCreateList = document.getElementById('btnConfirmCreateList');

    this.modalBatchAdd = document.getElementById('modalBatchAdd');
    this.textareaBatchItems = document.getElementById('textareaBatchItems');
    this.btnCloseModalBatch = document.getElementById('btnCloseModalBatch');
    this.btnCancelModalBatch = document.getElementById('btnCancelModalBatch');
    this.btnConfirmBatchAdd = document.getElementById('btnConfirmBatchAdd');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadLists();
    await this.checkProjectionStatus();
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playTickSound() {
    if (!this.chkSoundEffects || !this.chkSoundEffects.checked) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (_) {}
  }

  playFanfareSound() {
    if (!this.chkSoundEffects || !this.chkSoundEffects.checked) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + (idx * 0.12);
        const duration = (idx === notes.length - 1) ? 0.9 : 0.22;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (_) {}
  }

  async checkProjectionStatus() {
    try {
      const state = await window.bibleAPI.projection.getState();
      if (state && state.activeContent && state.activeContent.module === 'roulette') {
        this.setProjectedState(true);
      } else {
        this.setProjectedState(false);
      }
    } catch (_) {
      this.setProjectedState(false);
    }
  }

  setProjectedState(projected) {
    this.isProjected = projected;
    if (this.rouletteTallyChip) {
      if (projected) {
        this.rouletteTallyChip.className = 'roulette-tally-chip projected';
        this.txtTallyStatus.textContent = 'En Pantalla (Transmitiendo)';
        this.txtBtnProject.textContent = 'Actualizar Pantalla';
      } else {
        this.rouletteTallyChip.className = 'roulette-tally-chip not-projected';
        this.txtTallyStatus.textContent = 'Ruleta en Espera (No proyectada)';
        this.txtBtnProject.textContent = 'Proyectar en Pantalla';
      }
    }
  }

  async loadLists() {
    try {
      this.lists = await window.bibleAPI.roulette.getLists();
      this.renderListOptions();
      if (this.lists.length > 0) {
        const targetId = this.currentList ? this.currentList.id : this.lists[0].id;
        const exists = this.lists.some(l => l.id === targetId);
        await this.selectListById(exists ? targetId : this.lists[0].id);
      } else {
        this.currentList = null;
        this.items = [];
        this.renderItemsList();
        this.drawWheel();
      }
    } catch (err) {
      console.error('[RouletteController] Error al cargar listas:', err);
    }
  }

  renderListOptions() {
    this.selectList.innerHTML = '';
    this.lists.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `${l.name} (${l.item_count} valores)`;
      this.selectList.appendChild(opt);
    });
  }

  async selectListById(id) {
    try {
      const detailed = await window.bibleAPI.roulette.getListById(id);
      if (!detailed) return;

      this.currentList = detailed;
      this.items = detailed.items || [];
      this.selectList.value = id;

      this.renderItemsList();
      this.drawWheel();
      this.winnerBanner.style.display = 'none';

      // Si ya está proyectada, sincronizar con la pantalla pública
      if (this.isProjected) {
        this.projectWheel();
      }
    } catch (err) {
      console.error('[RouletteController] Error al seleccionar lista:', err);
    }
  }

  renderItemsList() {
    this.itemsListContainer.innerHTML = '';
    this.counterLabel.textContent = `${this.items.length} ${this.items.length === 1 ? 'valor' : 'valores'}`;

    if (!this.items.length) {
      this.itemsListContainer.innerHTML = `
        <div style="padding: 16px 8px; color: var(--text-muted); text-align: center; font-size: 12px;">
          Esta lista no tiene valores todavía.<br>Agrega uno arriba o pega varios de golpe.
        </div>
      `;
      return;
    }

    this.items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'roulette-item-row';
      row.innerHTML = `
        <div style="display: flex; align-items: center; min-width: 0; flex: 1;">
          <span class="item-color-dot" style="background-color: ${item.color || '#3B82F6'};"></span>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.label}">
            <strong style="color: var(--text-muted); font-size: 10px; margin-right: 4px;">#${index + 1}</strong>
            ${item.label}
          </span>
        </div>
        <button class="btn btn-icon-sm btn-danger-hover" style="padding: 2px 6px; font-size: 11px; margin-left: 6px; display: inline-flex; align-items: center; justify-content: center;" data-id="${item.id}" title="Eliminar este valor">
          <svg class="icon icon-xs" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      `;

      row.querySelector('button').addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.bibleAPI.roulette.removeItem(item.id);
        await this.selectListById(this.currentList.id);
      });

      this.itemsListContainer.appendChild(row);
    });
  }

  drawWheel() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 20;

    this.ctx.clearRect(0, 0, width, height);

    if (!this.items.length) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fill();
      this.ctx.strokeStyle = '#334155';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();

      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.font = 'bold 20px -apple-system, sans-serif';
      this.ctx.fillText('Agrega valores para activar la ruleta', centerX, centerY);
      return;
    }

    const numSlices = this.items.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.currentRotation);

    for (let i = 0; i < numSlices; i++) {
      const angle = i * sliceAngle;
      const item = this.items[i];

      // Sector
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = item.color || '#3B82F6';
      this.ctx.fill();
      this.ctx.strokeStyle = '#0D1117';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Texto de la etiqueta
      this.ctx.save();
      this.ctx.rotate(angle + sliceAngle / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 24px -apple-system, sans-serif';
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      this.ctx.shadowBlur = 4;

      let displayLabel = item.label;
      if (displayLabel.length > 16) displayLabel = displayLabel.slice(0, 14) + '...';

      this.ctx.fillText(displayLabel, radius - 24, 8);
      this.ctx.restore();
    }

    this.ctx.restore();

    // Borde exterior metálico
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 6;
    this.ctx.stroke();
  }

  async projectWheel() {
    if (!this.currentList) return;
    try {
      await window.bibleAPI.roulette.projectWheel({
        listName: this.currentList.name,
        items: this.items
      });
      this.setProjectedState(true);
    } catch (err) {
      console.error('[RouletteController] Error al proyectar ruleta:', err);
    }
  }

  spin() {
    if (this.isSpinning) return;
    if (this.items.length < 2) {
      alert('Debes agregar al menos 2 valores a la lista para poder girar la ruleta.');
      return;
    }

    this.isSpinning = true;
    this.winnerBanner.style.display = 'none';
    this.setProjectedState(true);

    const numSlices = this.items.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    // Selección aleatoria del elemento ganador
    const winningIndex = Math.floor(Math.random() * numSlices);
    const winningItem = this.items[winningIndex];
    this.lastWinningItem = winningItem;

    // Vueltas completas y ángulo final
    const fullSpins = 6;
    const targetSectorCenter = winningIndex * sliceAngle + sliceAngle / 2;
    const targetAngle = (Math.PI * 1.5) - targetSectorCenter + (fullSpins * Math.PI * 2);

    const startRotation = this.currentRotation % (Math.PI * 2);
    const totalRotationToCover = targetAngle - startRotation;
    const duration = 4800; // 4.8 segundos
    const startTime = performance.now();
    let lastTickSector = -1;

    // Notificar al servicio de proyección para que la pantalla pública gire en sincronía exacta
    window.bibleAPI.roulette.projectSpin({
      items: this.items,
      winningIndex,
      winnerLabel: winningItem.label,
      listName: this.currentList ? this.currentList.name : 'Ruleta Dinámica',
      durationMs: duration
    });

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Desaceleración suave (Cubic Ease Out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.currentRotation = startRotation + totalRotationToCover * easeOut;

      // Sonido de clic según el sector
      const currentAngleUnderPointer = (Math.PI * 1.5 - (this.currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const currentSector = Math.floor(currentAngleUnderPointer / sliceAngle);
      if (currentSector !== lastTickSector) {
        lastTickSector = currentSector;
        this.playTickSound();
      }

      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.currentRotation = this.currentRotation % (Math.PI * 2);
        this.drawWheel();
        this.announceWinner(winningItem, winningIndex);
      }
    };

    requestAnimationFrame(animate);
  }

  announceWinner(item, winningIndex) {
    this.winnerBanner.style.display = 'flex';
    this.winnerLabelText.textContent = item.label;
    this.winnerBanner.style.borderColor = item.color || 'var(--accent-gold)';

    this.playFanfareSound();

    window.bibleAPI.roulette.projectWinner({
      winnerLabel: item.label,
      color: item.color,
      items: this.items,
      winningIndex
    });

    // Auto-remover ganador si está marcado
    if (this.chkAutoRemoveWinner && this.chkAutoRemoveWinner.checked) {
      setTimeout(async () => {
        if (this.lastWinningItem && this.lastWinningItem.id === item.id) {
          await this.removeWinnerFromList();
        }
      }, 2500);
    }
  }

  async removeWinnerFromList() {
    if (!this.lastWinningItem) return;
    const target = this.lastWinningItem;
    this.lastWinningItem = null;
    this.winnerBanner.style.display = 'none';

    try {
      await window.bibleAPI.roulette.removeItem(target.id);
      await this.selectListById(this.currentList.id);
    } catch (err) {
      console.error('[RouletteController] Error al eliminar ganador:', err);
    }
  }

  async addItem() {
    const label = this.inputNewItem.value.trim();
    if (!label || !this.currentList) return;

    try {
      await window.bibleAPI.roulette.addItem(this.currentList.id, label);
      this.inputNewItem.value = '';
      await this.selectListById(this.currentList.id);
    } catch (err) {
      alert(err.message);
    }
  }

  async batchAddItems() {
    const raw = this.textareaBatchItems.value;
    if (!raw || !raw.trim() || !this.currentList) return;

    const tokens = raw
      .split(/[\n,;]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (!tokens.length) return;

    try {
      await window.bibleAPI.roulette.addItemsBatch(this.currentList.id, tokens);
      this.closeModalBatch();
      await this.selectListById(this.currentList.id);
    } catch (err) {
      alert('Error al agregar valores: ' + err.message);
    }
  }

  async clearAllItems() {
    if (!this.currentList || !this.items.length) return;
    if (!confirm(`¿Vaciar todos los ${this.items.length} valores de la lista "${this.currentList.name}"?`)) return;

    try {
      await window.bibleAPI.roulette.clearItems(this.currentList.id);
      await this.selectListById(this.currentList.id);
    } catch (err) {
      alert(err.message);
    }
  }

  shuffleItems() {
    if (!this.items || this.items.length < 2) return;
    // Fisher-Yates shuffle en memoria
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
    }
    this.renderItemsList();
    this.drawWheel();
    if (this.isProjected) {
      this.projectWheel();
    }
  }

  async renameCurrentList() {
    if (!this.currentList) return;
    const currentName = this.currentList.name;
    const newName = prompt('Nuevo nombre para esta lista de ruleta:', currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    try {
      await window.bibleAPI.roulette.renameList(this.currentList.id, newName.trim());
      await this.loadLists();
    } catch (err) {
      alert(err.message);
    }
  }

  async deleteCurrentList() {
    if (!this.currentList) return;
    if (!confirm(`¿Eliminar la lista "${this.currentList.name}" y todos sus valores?`)) return;

    try {
      await window.bibleAPI.roulette.deleteList(this.currentList.id);
      this.currentList = null;
      await this.loadLists();
    } catch (err) {
      alert(err.message);
    }
  }

  openModalNewList() {
    this.inputNewListName.value = '';
    this.inputNewListInitialItems.value = '';
    this.modalNewList.style.display = 'flex';
    setTimeout(() => {
      this.inputNewListName.focus();
    }, 50);
  }

  closeModalNewList() {
    this.modalNewList.style.display = 'none';
  }

  async confirmCreateList() {
    const name = this.inputNewListName.value.trim();
    if (!name) {
      alert('Ingresa un nombre para la nueva lista.');
      this.inputNewListName.focus();
      return;
    }

    const rawItems = this.inputNewListInitialItems.value;
    const items = rawItems
      .split(/[\n,;]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const created = await window.bibleAPI.roulette.createList(name, items);
      this.closeModalNewList();
      await this.loadLists();
      await this.selectListById(created.id);
    } catch (err) {
      alert('Error al crear la lista: ' + err.message);
    }
  }

  openModalBatch() {
    if (!this.currentList) return;
    this.textareaBatchItems.value = '';
    this.modalBatchAdd.style.display = 'flex';
    setTimeout(() => {
      this.textareaBatchItems.focus();
    }, 50);
  }

  closeModalBatch() {
    this.modalBatchAdd.style.display = 'none';
  }

  bindEvents() {
    // Proyección y Giro
    this.btnProject.addEventListener('click', () => this.projectWheel());
    this.btnSpinMaster.addEventListener('click', () => this.spin());
    this.btnCenterHub.addEventListener('click', () => this.spin());

    // Agregar elemento
    this.btnAddItem.addEventListener('click', () => this.addItem());
    this.inputNewItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addItem();
      }
    });

    // Enter en input de nueva lista
    this.inputNewListName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.confirmCreateList();
      }
    });

    // Selector de Lista
    this.selectList.addEventListener('change', () => {
      this.selectListById(parseInt(this.selectList.value, 10));
    });

    // Herramientas de lista
    this.btnRenameList.addEventListener('click', () => this.renameCurrentList());
    this.btnDeleteList.addEventListener('click', () => this.deleteCurrentList());
    this.btnShuffleItems.addEventListener('click', () => this.shuffleItems());
    this.btnClearAllItems.addEventListener('click', () => this.clearAllItems());

    // Banner de ganador
    this.btnSpinAgain.addEventListener('click', () => this.spin());
    this.btnRemoveWinnerFromList.addEventListener('click', () => this.removeWinnerFromList());
    this.btnCloseWinnerBanner.addEventListener('click', () => {
      this.winnerBanner.style.display = 'none';
    });

    // Modal Nueva Lista
    this.btnCreateList.addEventListener('click', () => this.openModalNewList());
    this.btnCloseModalNewList.addEventListener('click', () => this.closeModalNewList());
    this.btnCancelModalNewList.addEventListener('click', () => this.closeModalNewList());
    this.btnConfirmCreateList.addEventListener('click', () => this.confirmCreateList());

    // Modal Batch Add
    this.btnOpenBatchAdd.addEventListener('click', () => this.openModalBatch());
    this.btnCloseModalBatch.addEventListener('click', () => this.closeModalBatch());
    this.btnCancelModalBatch.addEventListener('click', () => this.closeModalBatch());
    this.btnConfirmBatchAdd.addEventListener('click', () => this.batchAddItems());

    // Barra espaciadora para girar
    window.addEventListener('keydown', (e) => {
      const activeNav = document.querySelector('.nav-item.active');
      if (activeNav && activeNav.dataset.module !== 'roulette') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      
      if (this.modalNewList?.style.display === 'flex' || this.modalBatchAdd?.style.display === 'flex') {
        if (e.key === 'Escape') {
          this.closeModalNewList();
          this.closeModalBatch();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.spin();
      }
    });
  }
}
