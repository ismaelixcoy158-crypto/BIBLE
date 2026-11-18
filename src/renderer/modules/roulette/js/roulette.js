/**
 * BIBLE — RouletteController
 * Motor de física de giro, renderizado en Canvas y sincronización de ruleta.
 */
export class RouletteController {
  constructor() {
    this.lists = [];
    this.currentList = null;
    this.items = [];
    this.currentRotation = 0; // en radianes
    this.isSpinning = false;

    // Elementos DOM
    this.canvas = document.getElementById('rouletteCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.selectList = document.getElementById('selectRouletteList');
    this.itemsListContainer = document.getElementById('rouletteItemsList');
    this.inputNewItem = document.getElementById('inputNewItemLabel');
    this.btnAddItem = document.getElementById('btnAddItem');
    this.btnCreateList = document.getElementById('btnCreateNewList');
    this.btnDeleteList = document.getElementById('btnDeleteCurrentList');
    this.btnSpinMaster = document.getElementById('btnSpinRouletteMaster');
    this.btnCenterHub = document.getElementById('btnCenterHub');
    this.counterLabel = document.getElementById('itemsCounterLabel');
    this.winnerBanner = document.getElementById('winnerBanner');
    this.winnerLabelText = document.getElementById('winnerLabelText');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadLists();
  }

  async loadLists() {
    try {
      this.lists = await window.bibleAPI.roulette.getLists();
      this.renderListOptions();
      if (this.lists.length > 0) {
        await this.selectListById(this.lists[0].id);
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
      opt.textContent = `${l.name} (${l.item_count} elementos)`;
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
    } catch (err) {
      console.error('[RouletteController] Error al seleccionar lista:', err);
    }
  }

  renderItemsList() {
    this.itemsListContainer.innerHTML = '';
    this.counterLabel.textContent = `${this.items.length} elementos`;

    if (!this.items.length) {
      this.itemsListContainer.innerHTML = `
        <div style="padding: 10px; color: var(--text-muted); text-align: center; font-size: 12px;">
          Esta lista no tiene elementos. Agrega uno arriba.
        </div>
      `;
      return;
    }

    this.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'roulette-item-row';
      row.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span class="item-color-dot" style="background-color: ${item.color || '#3B82F6'};"></span>
          <span>${item.label}</span>
        </div>
        <button class="btn btn-remove-item" style="padding: 2px 6px; font-size: 11px; color: var(--text-muted);" data-id="${item.id}">
          ✕
        </button>
      `;

      row.querySelector('.btn-remove-item').addEventListener('click', async () => {
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
      // Dibujar rueda vacía
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#21262D';
      this.ctx.fill();
      this.ctx.strokeStyle = '#30363D';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
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

      // Truncar texto largo
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

  spin() {
    if (this.isSpinning || this.items.length < 2) return;

    this.isSpinning = true;
    this.winnerBanner.style.display = 'none';

    const numSlices = this.items.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    // Selección aleatoria del elemento ganador
    const winningIndex = Math.floor(Math.random() * numSlices);
    const winningItem = this.items[winningIndex];

    // Número de vueltas completas (entre 5 y 8) + rotación necesaria para que el puntero apunte al sector
    const fullSpins = 6;
    // El puntero está en la parte superior (-PI/2 o 3*PI/2)
    const targetSectorCenter = winningIndex * sliceAngle + sliceAngle / 2;
    const targetAngle = (Math.PI * 1.5) - targetSectorCenter + (fullSpins * Math.PI * 2);

    const startRotation = this.currentRotation % (Math.PI * 2);
    const totalRotationToCover = targetAngle - startRotation;
    const duration = 4500; // 4.5 segundos
    const startTime = performance.now();

    // Notificar al servicio de proyección para sincronizar la pantalla pública
    window.bibleAPI.roulette.projectSpin({
      items: this.items,
      winningIndex,
      winnerLabel: winningItem.label,
      durationMs: duration
    });

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Función de desaceleración suave (Cubic Ease Out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.currentRotation = startRotation + totalRotationToCover * easeOut;
      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.currentRotation = this.currentRotation % (Math.PI * 2);
        this.drawWheel();
        this.announceWinner(winningItem);
      }
    };

    requestAnimationFrame(animate);
  }

  announceWinner(item) {
    this.winnerBanner.style.display = 'flex';
    this.winnerLabelText.textContent = item.label;
    this.winnerBanner.style.borderColor = item.color || 'var(--status-live)';

    window.bibleAPI.roulette.projectWinner({
      winnerLabel: item.label,
      color: item.color
    });
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

  async createNewList() {
    const name = prompt('Ingresa el nombre de la nueva lista de ruleta:');
    if (!name || !name.trim()) return;

    try {
      const created = await window.bibleAPI.roulette.createList(name.trim(), ['Opción 1', 'Opción 2', 'Opción 3']);
      await this.loadLists();
      await this.selectListById(created.id);
    } catch (err) {
      alert(err.message);
    }
  }

  async deleteCurrentList() {
    if (!this.currentList) return;
    if (!confirm(`¿Eliminar la lista "${this.currentList.name}"?`)) return;

    try {
      await window.bibleAPI.roulette.deleteList(this.currentList.id);
      await this.loadLists();
    } catch (err) {
      alert(err.message);
    }
  }

  bindEvents() {
    this.btnSpinMaster.addEventListener('click', () => this.spin());
    this.btnCenterHub.addEventListener('click', () => this.spin());
    this.btnAddItem.addEventListener('click', () => this.addItem());

    this.inputNewItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addItem();
      }
    });

    this.selectList.addEventListener('change', () => {
      this.selectListById(parseInt(this.selectList.value, 10));
    });

    this.btnCreateList.addEventListener('click', () => this.createNewList());
    this.btnDeleteList.addEventListener('click', () => this.deleteCurrentList());

    // Barra espaciadora para girar
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.spin();
      }
    });
  }
}
