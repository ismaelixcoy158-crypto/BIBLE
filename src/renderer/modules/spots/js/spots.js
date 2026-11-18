/**
 * BIBLE — SpotsController
 * Controlador para la biblioteca visual de videos y anuncios multimedia.
 */
export class SpotsController {
  constructor() {
    this.spots = [];
    this.currentFilter = '';

    this.gridContainer = document.getElementById('spotsGridContainer');
    this.btnImport = document.getElementById('btnImportSpot');
    this.tabs = [
      document.getElementById('tabSpotsAll'),
      document.getElementById('tabSpotsVideos'),
      document.getElementById('tabSpotsImages')
    ];

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadSpots();
  }

  async loadSpots(filter = '') {
    try {
      this.spots = await window.bibleAPI.spots.getAll(filter || null);
      this.renderGrid();
    } catch (err) {
      console.error('[SpotsController] Error al cargar spots:', err);
    }
  }

  renderGrid() {
    this.gridContainer.innerHTML = '';
    if (!this.spots.length) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; color: var(--text-muted); text-align: center; font-size: 14px;">
          No hay spots disponibles. Haz clic en "Importar Spot" para subir un video o imagen de tu congregación.
        </div>
      `;
      return;
    }

    this.spots.forEach(spot => {
      const card = document.createElement('div');
      card.className = 'spot-card';
      const isVideo = spot.file_type === 'video';

      let mediaPreview = '';
      if (isVideo) {
        mediaPreview = `
          <div style="font-size: 38px; color: var(--text-muted);">🎬</div>
        `;
      } else {
        mediaPreview = `
          <div style="font-size: 38px; color: var(--text-muted);">🖼️</div>
        `;
      }

      const sizeMB = (spot.file_size / (1024 * 1024)).toFixed(1);

      card.innerHTML = `
        <div class="spot-thumbnail-box">
          ${mediaPreview}
          <span class="spot-type-badge">${spot.file_type}</span>
        </div>
        <div class="spot-card-footer">
          <span class="spot-card-title" title="${spot.title}">${spot.title}</span>
          <div class="spot-meta-row">
            <span>${sizeMB} MB</span>
            <span>${spot.loop_enabled ? 'Bucle activo' : 'Una vez'}</span>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <button class="btn btn-primary btn-project-spot" style="flex: 1; font-size: 12px; padding: 6px;" data-id="${spot.id}">
              🖥️ Proyectar
            </button>
            <button class="btn btn-delete-spot" style="font-size: 11px; padding: 6px; color: var(--status-blackout); border-color: rgba(239, 68, 68, 0.3);" data-id="${spot.id}">
              🗑️
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-project-spot').addEventListener('click', () => {
        this.projectSpot(spot.id);
      });

      card.querySelector('.btn-delete-spot').addEventListener('click', () => {
        this.deleteSpot(spot.id, spot.title);
      });

      this.gridContainer.appendChild(card);
    });
  }

  async projectSpot(id) {
    try {
      await window.bibleAPI.spots.project(id);
    } catch (err) {
      alert(`Error al proyectar spot: ${err.message}`);
    }
  }

  async deleteSpot(id, title) {
    if (!confirm(`¿Deseas eliminar el anuncio "${title}"?`)) return;
    try {
      await window.bibleAPI.spots.delete(id);
      await this.loadSpots(this.currentFilter);
    } catch (err) {
      alert(err.message);
    }
  }

  async importSpot() {
    try {
      const imported = await window.bibleAPI.spots.importFile();
      if (imported) {
        await this.loadSpots(this.currentFilter);
      }
    } catch (err) {
      alert(`Error al importar: ${err.message}`);
    }
  }

  bindEvents() {
    this.btnImport.addEventListener('click', () => this.importSpot());

    this.tabs.forEach(tab => {
      if (!tab) return;
      tab.addEventListener('click', async () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.type || '';
        await this.loadSpots(this.currentFilter);
      });
    });
  }
}

