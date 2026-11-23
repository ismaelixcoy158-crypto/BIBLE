import { ProjectionToolbarController } from '../../../shared/js/projection-toolbar.js';

/**
 * BIBLE — SpotsController
 * Controlador profesional para emisión de videos, spots multimedia y anuncios web.
 * Soporta archivos locales (MP4, WebM, MKV, AVI, imágenes) y enlaces por HTTP / Web.
 */
export class SpotsController {
  constructor() {
    this.spots = [];
    this.currentFilter = '';
    this.selectedSpot = null;
    this.projectedSpot = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentVolume = 1.0;

    // Elementos DOM - Biblioteca
    this.gridContainer = document.getElementById('spotsGridContainer');
    this.inputSearch = document.getElementById('inputSpotsSearch');
    this.btnClearSearch = document.getElementById('btnClearSpotsSearch');
    this.spotsCountHeader = document.getElementById('spotsCountHeader');
    this.btnImport = document.getElementById('btnImportSpot');
    this.btnOpenAddUrl = document.getElementById('btnOpenAddUrlModal');
    this.tabs = [
      document.getElementById('tabSpotsAll'),
      document.getElementById('tabSpotsVideos'),
      document.getElementById('tabSpotsImages')
    ];

    // Elementos DOM - Monitor del Operador
    this.operatorVideo = document.getElementById('operatorSpotVideo');
    this.operatorYoutube = document.getElementById('operatorSpotYoutube');
    this.operatorImage = document.getElementById('operatorSpotImage');
    this.standbyScreen = document.getElementById('spotStandbyScreen');
    this.tallyBadge = document.getElementById('spotTallyBadge');
    this.tallyText = document.getElementById('spotTallyText');

    // Consola de Transporte
    this.timeline = document.getElementById('spotTimeline');
    this.timeCurrent = document.getElementById('spotTimeCurrent');
    this.timeDuration = document.getElementById('spotTimeDuration');
    this.timeRemaining = document.getElementById('spotTimeRemaining');
    this.btnPlayPause = document.getElementById('btnSpotPlayPause');
    this.iconPlay = document.getElementById('iconSpotPlay');
    this.iconPause = document.getElementById('iconSpotPause');
    this.labelPlayPause = document.getElementById('labelSpotPlayPause');
    this.btnStop = document.getElementById('btnSpotStop');
    this.btnRestart = document.getElementById('btnSpotRestart');
    this.btnLoop = document.getElementById('btnSpotLoop');
    this.labelLoop = document.getElementById('labelSpotLoop');
    this.btnMute = document.getElementById('btnSpotMute');
    this.iconVolumeHigh = document.getElementById('iconVolumeHigh');
    this.iconVolumeMuted = document.getElementById('iconVolumeMuted');
    this.sliderVolume = document.getElementById('sliderSpotVolume');
    this.labelVolumePercent = document.getElementById('spotVolumePercent');

    // Ficha de Detalles
    this.detailTitle = document.getElementById('detailSpotTitle');
    this.detailType = document.getElementById('detailSpotType');
    this.detailOrigin = document.getElementById('detailSpotOrigin');
    this.detailSize = document.getElementById('detailSpotSize');
    this.detailLiveStatus = document.getElementById('detailSpotLiveStatus');

    // Barra Inferior
    this.btnBottomPlayPause = document.getElementById('btnBottomPlayPause');
    this.btnBottomStop = document.getElementById('btnBottomStop');
    this.btnBottomProject = document.getElementById('btnBottomProjectSpot');

    // Modal Agregar por URL (HTTP / Web)
    this.modalAddUrl = document.getElementById('modalAddUrlSpot');
    this.btnCloseAddUrl = document.getElementById('btnCloseAddUrlModal');
    this.btnCancelAddUrl = document.getElementById('btnCancelAddUrl');
    this.btnSaveAddUrl = document.getElementById('btnSaveAddUrl');
    this.inputUrl = document.getElementById('inputSpotUrl');
    this.inputUrlTitle = document.getElementById('inputSpotTitle');
    this.selectUrlType = document.getElementById('selectSpotType');
    this.checkUrlLoop = document.getElementById('checkSpotLoop');
    this.checkUrlDownload = document.getElementById('checkSpotDownloadLocal');

    this.init();
  }

  sendOperatorYoutubeCommand(command, args = []) {
    if (this.operatorYoutube && this.operatorYoutube.contentWindow) {
      try {
        this.operatorYoutube.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: command,
          args: args
        }), '*');
      } catch (_) {}
    }
  }

  async init() {
    this.bindEvents();

    // Inicializar barra inferior con POO
    this.toolbar = new ProjectionToolbarController({
      container: document.querySelector('.spots-bottom-bar'),
      module: 'spots',
      onPrev: () => this.restartVideo(),
      onNext: () => this.restartVideo(),
      onProject: () => {
        if (this.selectedSpot) this.projectSpot(this.selectedSpot.id);
      }
    });
    await this.toolbar.init();

    await this.loadSpots();

    // Escuchar actualizaciones de tiempo desde la pantalla pública en tiempo real
    if (window.bibleAPI?.spots?.onTimeUpdate) {
      window.bibleAPI.spots.onTimeUpdate((timeData) => {
        this.handleTimeUpdate(timeData);
      });
    }

    // Escuchar comandos de medios
    if (window.bibleAPI?.spots?.onMediaCommand) {
      window.bibleAPI.spots.onMediaCommand((cmd) => {
        if (cmd.action === 'stop') {
          this.handleStopped();
        }
      });
    }

    // Verificar si ya hay un spot activo proyectado
    try {
      const state = await window.bibleAPI.projection.getState();
      if (state?.activeContent && state.activeContent.module === 'spots') {
        const matching = this.spots.find(s => s.id === state.activeContent.spotId);
        if (matching) {
          this.selectSpot(matching, true);
        }
      }
    } catch (e) {
      console.warn('[SpotsController] Error al verificar estado inicial:', e);
    }
  }

  async loadSpots(filter = '') {
    try {
      this.spots = await window.bibleAPI.spots.getAll(filter || null);
      this.renderGrid();
      if (this.spots.length > 0 && !this.selectedSpot) {
        this.selectSpot(this.spots[0], false);
      }
    } catch (err) {
      console.error('[SpotsController] Error al cargar spots:', err);
    }
  }

  renderGrid(filteredItems = null) {
    const items = filteredItems || this.spots;
    this.gridContainer.innerHTML = '';

    if (this.spotsCountHeader) {
      this.spotsCountHeader.textContent = `Biblioteca Multimedia (${this.spots.length})`;
    }

    if (!items.length) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px 16px; color: var(--text-muted); text-align: center; font-size: 13px;">
          <svg class="icon" style="width: 36px; height: 36px; margin-bottom: 8px; opacity: 0.5;" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>
          <div style="font-weight: 700; color: #FFFFFF;">No hay spots multimedia en esta vista</div>
          <div style="margin-top: 6px; font-size: 11px;">
            Haz clic en <strong>"Importar Archivo Local"</strong> o en <strong>"Agregar por Enlace (HTTP)"</strong> para comenzar.
          </div>
        </div>
      `;
      return;
    }

    items.forEach(spot => {
      const card = document.createElement('div');
      const isProjected = Boolean(this.projectedSpot && this.projectedSpot.id === spot.id);
      const isSelected = Boolean(this.selectedSpot && this.selectedSpot.id === spot.id);

      card.className = `spot-card ${isProjected ? 'projected' : ''} ${isSelected ? 'selected' : ''}`;
      card.dataset.id = spot.id;

      const isVideo = spot.file_type === 'video';
      const isYoutube = Boolean(spot.isYoutube);
      let extBadge = spot.isHttp ? 'WEB' : (spot.stored_filename?.split('.').pop() || spot.file_type).toUpperCase();
      if (isYoutube) extBadge = 'YOUTUBE';
      const sizeMB = isYoutube ? 'YouTube' : (spot.file_size ? `${(spot.file_size / (1024 * 1024)).toFixed(1)} MB` : 'Stream Web');

      let thumbnailHtml = '';
      if (isYoutube) {
        thumbnailHtml = `
          <img src="${spot.thumbnailUrl || spot.mediaUrl}" class="spot-thumbnail-img" alt="${spot.title}" loading="lazy" style="position: relative; z-index: 2; object-fit: cover;">
          <div class="spot-play-overlay-icon" style="background: rgba(225, 29, 72, 0.9); z-index: 3;">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        `;
      } else if (isVideo) {
        thumbnailHtml = `
          <video src="${spot.mediaUrl}#t=0.5" preload="metadata" class="spot-thumbnail-video" muted playsinline></video>
          <div class="spot-play-overlay-icon">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        `;
      } else {
        thumbnailHtml = `
          <svg class="icon" style="width: 28px; height: 28px; position: absolute; z-index: 1; opacity: 0.4;" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <img src="${spot.mediaUrl}" class="spot-thumbnail-img" alt="${spot.title}" loading="lazy" style="position: relative; z-index: 2;" onerror="this.style.display='none';">
        `;
      }

      card.innerHTML = `
        <div class="spot-thumbnail-box">
          ${thumbnailHtml}
          <span class="spot-type-badge ${isYoutube ? 'youtube-badge' : ''}">${extBadge}</span>
        </div>
        <div class="spot-card-footer">
          <span class="spot-card-title" title="${spot.title}">${spot.title}</span>
          <div class="spot-meta-row">
            <span>${sizeMB}</span>
            <span>${isYoutube ? 'En línea' : (isVideo ? (spot.loop_enabled ? 'Bucle' : '1 vez') : 'Foto')}</span>
          </div>
          <div class="spot-card-actions">
            <button class="btn btn-primary btn-project-spot" style="flex: 1; font-size: 11px; padding: 5px 8px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;" title="Proyectar a la pantalla pública">
              <svg class="icon icon-xs" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              <span>Proyectar</span>
            </button>
            <button class="btn btn-sm btn-delete-spot" style="padding: 5px 8px; color: #F87171; border-color: rgba(239, 68, 68, 0.25); display: inline-flex; align-items: center; justify-content: center;" title="Eliminar anuncio">
              <svg class="icon icon-xs" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;

      // Clic en la tarjeta para previsualizar en el monitor
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-project-spot') || e.target.closest('.btn-delete-spot')) return;
        this.selectSpot(spot, false);
      });

      // Doble clic para proyectar directamente
      card.addEventListener('dblclick', () => {
        this.projectSpot(spot.id);
      });

      // Botón proyectar
      card.querySelector('.btn-project-spot')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.projectSpot(spot.id);
      });

      // Botón eliminar
      card.querySelector('.btn-delete-spot')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteSpot(spot.id, spot.title);
      });

      this.gridContainer.appendChild(card);
    });
  }

  selectSpot(spot, wasProjected = false) {
    this.selectedSpot = spot;
    if (wasProjected) {
      this.projectedSpot = spot;
    }

    // Actualizar clase selected en tarjetas
    this.gridContainer.querySelectorAll('.spot-card').forEach(c => {
      if (parseInt(c.dataset.id, 10) === spot.id) {
        c.classList.add('selected');
        if (wasProjected) c.classList.add('projected');
      } else {
        c.classList.remove('selected');
        if (wasProjected) c.classList.remove('projected');
      }
    });

    // Actualizar Monitor del Operador
    if (this.standbyScreen) this.standbyScreen.style.display = 'none';

    if (spot.isYoutube) {
      if (this.operatorVideo) {
        this.operatorVideo.pause();
        this.operatorVideo.style.display = 'none';
      }
      if (this.operatorImage) this.operatorImage.style.display = 'none';
      if (this.operatorYoutube) {
        this.operatorYoutube.style.display = 'block';
        if (this.operatorYoutube.src !== spot.mediaUrl) {
          this.operatorYoutube.src = spot.mediaUrl;
        }
      }
      this.timeline.disabled = false;
      this.btnPlayPause.disabled = false;
      this.btnRestart.disabled = false;
      this.btnLoop.disabled = false;
      if (this.labelLoop) {
        this.labelLoop.textContent = spot.loop_enabled ? 'Bucle: Sí' : 'Bucle: No';
      }
    } else if (spot.file_type === 'video') {
      if (this.operatorYoutube) {
        this.operatorYoutube.src = 'about:blank';
        this.operatorYoutube.style.display = 'none';
      }
      if (this.operatorImage) this.operatorImage.style.display = 'none';
      if (this.operatorVideo) {
        this.operatorVideo.style.display = 'block';
        if (this.operatorVideo.src !== spot.mediaUrl) {
          this.operatorVideo.src = spot.mediaUrl;
        }
        this.operatorVideo.loop = Boolean(spot.loop_enabled);
        this.operatorVideo.muted = true; // El monitor del operador está muteado para evitar eco con la sala
      }
      this.timeline.disabled = false;
      this.btnPlayPause.disabled = false;
      this.btnRestart.disabled = false;
      this.btnLoop.disabled = false;
      if (this.labelLoop) {
        this.labelLoop.textContent = spot.loop_enabled ? 'Bucle: Sí' : 'Bucle: No';
      }
    } else {
      if (this.operatorYoutube) {
        this.operatorYoutube.src = 'about:blank';
        this.operatorYoutube.style.display = 'none';
      }
      if (this.operatorVideo) {
        this.operatorVideo.pause();
        this.operatorVideo.style.display = 'none';
      }
      if (this.operatorImage) {
        this.operatorImage.style.display = 'block';
        this.operatorImage.src = spot.mediaUrl;
      }
      this.timeline.disabled = true;
      this.btnPlayPause.disabled = true;
      this.btnRestart.disabled = true;
      this.btnLoop.disabled = true;
    }

    // Actualizar Ficha de Detalles
    if (this.detailTitle) this.detailTitle.textContent = spot.title;
    if (this.detailType) this.detailType.textContent = spot.isYoutube ? 'Video de YouTube (Online)' : (spot.file_type === 'video' ? 'Video' : 'Fotografía / Imagen');
    if (this.detailOrigin) this.detailOrigin.textContent = spot.isYoutube ? 'YouTube (Audio oficial)' : (spot.isHttp ? 'Enlace Web (HTTP/HTTPS)' : 'Archivo Local en Disco');
    if (this.detailSize) {
      this.detailSize.textContent = spot.isYoutube ? 'Streaming Web' : (spot.file_size ? `${(spot.file_size / (1024 * 1024)).toFixed(1)} MB` : 'En línea');
    }
    if (this.detailLiveStatus) {
      const isLive = Boolean(this.projectedSpot && this.projectedSpot.id === spot.id);
      this.detailLiveStatus.textContent = isLive ? 'EN EL AIRE' : 'En Espera';
      this.detailLiveStatus.style.color = isLive ? 'var(--status-live)' : 'var(--text-muted)';
    }

    // Actualizar Tally del Monitor
    this.updateTally(wasProjected);
  }

  async projectSpot(id) {
    try {
      const spot = this.spots.find(s => s.id === id);
      if (!spot) return;

      this.projectedSpot = spot;
      this.selectSpot(spot, true);

      await window.bibleAPI.spots.project(id, {
        volume: this.currentVolume,
        currentTime: this.operatorVideo?.currentTime || 0
      });

      this.isPlaying = true;
      this.updatePlayPauseUI(true);
      this.updateTally(true);

      if (spot.file_type === 'video' && this.operatorVideo) {
        this.operatorVideo.play().catch(() => {});
      }
    } catch (err) {
      alert(`Error al proyectar spot: ${err.message}`);
    }
  }

  handleTimeUpdate(data) {
    if (!data || !this.projectedSpot || this.projectedSpot.file_type !== 'video') return;

    const curr = data.currentTime || 0;
    const dur = data.duration || 0;

    if (this.timeCurrent) this.timeCurrent.textContent = this.formatTime(curr);
    if (this.timeDuration) this.timeDuration.textContent = this.formatTime(dur);

    const remaining = Math.max(0, dur - curr);
    if (this.timeRemaining) this.timeRemaining.textContent = `(-${this.formatTime(remaining)})`;

    if (dur > 0 && this.timeline) {
      const pct = (curr / dur) * 100;
      this.timeline.value = pct;
      const progressFill = document.getElementById('spotTimelineProgress');
      if (progressFill) progressFill.style.width = `${pct}%`;
    }

    if (data.paused !== undefined) {
      this.isPlaying = !data.paused;
      this.updatePlayPauseUI(this.isPlaying);
    }
  }

  handleStopped() {
    this.isPlaying = false;
    this.projectedSpot = null;
    this.updatePlayPauseUI(false);
    this.updateTally(false);

    if (this.operatorVideo) {
      this.operatorVideo.pause();
      this.operatorVideo.currentTime = 0;
    }
    if (this.operatorYoutube) {
      this.sendOperatorYoutubeCommand('stopVideo');
      this.operatorYoutube.src = 'about:blank';
      this.operatorYoutube.style.display = 'none';
    }
    if (this.timeline) this.timeline.value = 0;
    if (this.timeCurrent) this.timeCurrent.textContent = '00:00';
    if (this.timeRemaining) this.timeRemaining.textContent = '(-00:00)';

    this.gridContainer.querySelectorAll('.spot-card.projected').forEach(c => {
      c.classList.remove('projected');
    });

    if (this.detailLiveStatus) {
      this.detailLiveStatus.textContent = 'En Espera';
      this.detailLiveStatus.style.color = 'var(--text-muted)';
    }
  }

  updateTally(isLive) {
    if (this.tallyBadge) {
      if (isLive && this.projectedSpot) {
        this.tallyBadge.classList.add('live');
        if (this.tallyText) this.tallyText.textContent = `EN AIRE: ${this.projectedSpot.title}`;
      } else {
        this.tallyBadge.classList.remove('live');
        if (this.tallyText) this.tallyText.textContent = 'En espera';
      }
    }

    // Tally en la barra inferior
    const liveStatusSpots = document.getElementById('liveStatusBadgeSpots');
    const liveSpotsRef = document.getElementById('liveStatusSpotsRef');
    if (liveStatusSpots) {
      if (isLive && this.projectedSpot) {
        liveStatusSpots.classList.add('live');
        if (liveSpotsRef) liveSpotsRef.textContent = this.projectedSpot.title;
      } else {
        liveStatusSpots.classList.remove('live');
        if (liveSpotsRef) liveSpotsRef.textContent = 'En espera';
      }
    }
  }

  updatePlayPauseUI(playing) {
    if (this.iconPlay && this.iconPause && this.labelPlayPause) {
      if (playing) {
        this.iconPlay.style.display = 'none';
        this.iconPause.style.display = 'block';
        this.labelPlayPause.textContent = 'Pausa';
      } else {
        this.iconPlay.style.display = 'block';
        this.iconPause.style.display = 'none';
        this.labelPlayPause.textContent = 'Reproducir';
      }
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  async togglePlayPause() {
    if (!this.projectedSpot) {
      if (this.selectedSpot) {
        await this.projectSpot(this.selectedSpot.id);
      }
      return;
    }

    if (this.isPlaying) {
      await window.bibleAPI.spots.pause();
      if (this.operatorVideo) this.operatorVideo.pause();
      this.sendOperatorYoutubeCommand('pauseVideo');
      this.isPlaying = false;
      this.updatePlayPauseUI(false);
    } else {
      await window.bibleAPI.spots.play();
      if (this.operatorVideo) this.operatorVideo.play().catch(() => {});
      this.sendOperatorYoutubeCommand('playVideo');
      this.isPlaying = true;
      this.updatePlayPauseUI(true);
    }
  }

  async stopVideo() {
    await window.bibleAPI.spots.stop();
    this.sendOperatorYoutubeCommand('stopVideo');
    if (this.operatorYoutube) {
      this.operatorYoutube.src = 'about:blank';
      this.operatorYoutube.style.display = 'none';
    }
    this.handleStopped();
  }

  async restartVideo() {
    if (this.projectedSpot) {
      await window.bibleAPI.spots.seek(0);
      if (this.operatorVideo) this.operatorVideo.currentTime = 0;
      this.sendOperatorYoutubeCommand('seekTo', [0, true]);
    }
  }

  async toggleLoop() {
    if (!this.selectedSpot) return;
    const newLoop = !this.selectedSpot.loop_enabled;
    this.selectedSpot.loop_enabled = newLoop ? 1 : 0;
    if (this.labelLoop) {
      this.labelLoop.textContent = newLoop ? 'Bucle: Sí' : 'Bucle: No';
    }
    await window.bibleAPI.spots.setLoop(this.selectedSpot.id, newLoop);
    if (this.operatorVideo) this.operatorVideo.loop = newLoop;
  }

  async setVolume(volume, isMuted = false) {
    this.currentVolume = volume;
    this.isMuted = isMuted;

    if (this.labelVolumePercent) {
      this.labelVolumePercent.textContent = isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`;
    }
    if (this.iconVolumeHigh && this.iconVolumeMuted) {
      this.iconVolumeHigh.style.display = isMuted || volume === 0 ? 'none' : 'block';
      this.iconVolumeMuted.style.display = isMuted || volume === 0 ? 'block' : 'none';
    }

    await window.bibleAPI.spots.setVolume(volume, isMuted);
  }

  filterSpots(queryText) {
    const q = (queryText || '').toLowerCase().trim();
    if (this.btnClearSearch) {
      this.btnClearSearch.style.display = q ? 'block' : 'none';
    }

    if (!q) {
      this.renderGrid();
      return;
    }

    const filtered = this.spots.filter(s => {
      const title = (s.title || '').toLowerCase();
      const ext = (s.stored_filename || '').toLowerCase();
      return title.includes(q) || ext.includes(q);
    });

    this.renderGrid(filtered);
  }

  async importLocalFile() {
    try {
      if (this.btnImport) {
        this.btnImport.textContent = 'Importando...';
        this.btnImport.disabled = true;
      }

      const imported = await window.bibleAPI.spots.importFile();
      if (imported) {
        await this.loadSpots(this.currentFilter);
        this.selectSpot(imported, false);
      }
    } catch (err) {
      alert(`Error al importar archivo: ${err.message}`);
    } finally {
      if (this.btnImport) {
        this.btnImport.innerHTML = `
          <svg class="icon icon-sm" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" x2="12" y1="3" y2="15"/>
          </svg>
          <span>Importar Archivo Local</span>
        `;
        this.btnImport.disabled = false;
      }
    }
  }

  openAddUrlModal() {
    if (!this.modalAddUrl) return;
    this.modalAddUrl.style.display = 'flex';
    if (this.inputUrl) this.inputUrl.value = '';
    if (this.inputUrlTitle) this.inputUrlTitle.value = '';
    setTimeout(() => this.inputUrl?.focus(), 50);
  }

  closeAddUrlModal() {
    if (this.modalAddUrl) this.modalAddUrl.style.display = 'none';
  }

  async saveUrlSpot() {
    const url = this.inputUrl?.value?.trim();
    if (!url) {
      alert('Por favor ingresa una URL válida (HTTP o HTTPS).');
      this.inputUrl?.focus();
      return;
    }

    const title = this.inputUrlTitle?.value?.trim() || '';
    const fileType = this.selectUrlType?.value || null;
    const loopEnabled = Boolean(this.checkUrlLoop?.checked);
    const downloadLocal = Boolean(this.checkUrlDownload?.checked);

    try {
      if (this.btnSaveAddUrl) {
        this.btnSaveAddUrl.textContent = downloadLocal ? 'Descargando y procesando...' : 'Guardando...';
        this.btnSaveAddUrl.disabled = true;
      }

      const created = await window.bibleAPI.spots.addUrl({
        url,
        title,
        fileType,
        loopEnabled,
        downloadLocal
      });

      this.closeAddUrlModal();
      await this.loadSpots(this.currentFilter);
      if (created) {
        this.selectSpot(created, false);
      }
    } catch (err) {
      alert(`Error al agregar spot por enlace: ${err.message}`);
    } finally {
      if (this.btnSaveAddUrl) {
        this.btnSaveAddUrl.textContent = 'Guardar en Biblioteca';
        this.btnSaveAddUrl.disabled = false;
      }
    }
  }

  async deleteSpot(id, title) {
    if (!confirm(`¿Eliminar el spot multimedia "${title}"?`)) return;
    try {
      if (this.projectedSpot && this.projectedSpot.id === id) {
        await this.stopVideo();
      }
      await window.bibleAPI.spots.delete(id);
      await this.loadSpots(this.currentFilter);
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  }

  bindEvents() {
    // Importación y Creación
    this.btnImport?.addEventListener('click', () => this.importLocalFile());
    this.btnOpenAddUrl?.addEventListener('click', () => this.openAddUrlModal());
    this.btnCloseAddUrl?.addEventListener('click', () => this.closeAddUrlModal());
    this.btnCancelAddUrl?.addEventListener('click', () => this.closeAddUrlModal());
    this.btnSaveAddUrl?.addEventListener('click', () => this.saveUrlSpot());

    // Pestañas de Filtro
    this.tabs.forEach(tab => {
      if (!tab) return;
      tab.addEventListener('click', async () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.type || '';
        await this.loadSpots(this.currentFilter);
      });
    });

    // Buscador
    this.inputSearch?.addEventListener('input', () => {
      this.filterSpots(this.inputSearch.value);
    });
    this.btnClearSearch?.addEventListener('click', () => {
      if (this.inputSearch) this.inputSearch.value = '';
      this.filterSpots('');
      this.inputSearch?.focus();
    });

    // Controles de Transporte
    this.btnPlayPause?.addEventListener('click', () => this.togglePlayPause());
    this.btnStop?.addEventListener('click', () => this.stopVideo());
    this.btnRestart?.addEventListener('click', () => this.restartVideo());
    this.btnLoop?.addEventListener('click', () => this.toggleLoop());

    // Scrubber / Timeline
    this.timeline?.addEventListener('input', () => {
      if (!this.operatorVideo || !this.operatorVideo.duration) return;
      const pct = parseFloat(this.timeline.value);
      const targetSec = (pct / 100) * this.operatorVideo.duration;
      window.bibleAPI?.spots?.seek(targetSec);
    });

    // Controles de Volumen
    this.sliderVolume?.addEventListener('input', () => {
      const vol = parseFloat(this.sliderVolume.value);
      this.setVolume(vol, this.isMuted);
    });

    this.btnMute?.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      this.setVolume(this.currentVolume, this.isMuted);
    });

    // Barra inferior
    this.btnBottomPlayPause?.addEventListener('click', () => this.togglePlayPause());
    this.btnBottomStop?.addEventListener('click', () => this.stopVideo());
    this.btnBottomProject?.addEventListener('click', () => {
      if (this.selectedSpot) this.projectSpot(this.selectedSpot.id);
    });

    // Tecla Espacio para Play/Pausa, Enter para Proyectar
    window.addEventListener('keydown', (e) => {
      const activeNav = document.querySelector('.nav-item.active');
      if (activeNav && activeNav.dataset.module !== 'spots') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.selectedSpot) this.projectSpot(this.selectedSpot.id);
      }
    });
  }
}
