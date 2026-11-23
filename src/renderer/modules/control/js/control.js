/**
 * BIBLE — ControlController
 * Controlador para la interfaz de escritorio del módulo de Control Remoto.
 * Gestiona el Código de Sala exclusivo, PIN de 4 dígitos, QR inteligente y Cloud Relay.
 */
export class ControlController {
  constructor() {
    this.refreshInterval = null;
    this.currentStatus = null;
    this.activeMode = 'cloud'; // 'cloud' (recomendado) o 'local'

    // Elementos DOM
    this.tabModeCloud = document.getElementById('tabModeCloud');
    this.tabModeLocal = document.getElementById('tabModeLocal');
    this.qrCodeSvgContainer = document.getElementById('qrCodeSvgContainer');
    this.btnRefreshQr = document.getElementById('btnRefreshQr');
    this.qrCardTitle = document.getElementById('qrCardTitle');
    this.qrModeTag = document.getElementById('qrModeTag');
    this.qrInstructionText = document.getElementById('qrInstructionText');

    this.controlRoomDisplay = document.getElementById('controlRoomDisplay');
    this.btnGenerateRoom = document.getElementById('btnGenerateRoom');
    this.btnEditRoom = document.getElementById('btnEditRoom');
    this.customRoomForm = document.getElementById('customRoomForm');
    this.inputCustomRoom = document.getElementById('inputCustomRoom');
    this.btnSaveCustomRoom = document.getElementById('btnSaveCustomRoom');
    this.btnCancelCustomRoom = document.getElementById('btnCancelCustomRoom');

    this.controlPinDisplay = document.getElementById('controlPinDisplay');
    this.btnGeneratePin = document.getElementById('btnGeneratePin');
    this.btnEditPin = document.getElementById('btnEditPin');
    this.customPinForm = document.getElementById('customPinForm');
    this.inputCustomPin = document.getElementById('inputCustomPin');
    this.btnSaveCustomPin = document.getElementById('btnSaveCustomPin');
    this.btnCancelCustomPin = document.getElementById('btnCancelCustomPin');

    this.urlInputLabel = document.getElementById('urlInputLabel');
    this.controlUrlInput = document.getElementById('controlUrlInput');
    this.btnCopyUrl = document.getElementById('btnCopyUrl');
    this.btnCopyUrlLabel = document.getElementById('btnCopyUrlLabel');
    this.networkIpLabel = document.getElementById('networkIpLabel');
    this.activeClientsCount = document.getElementById('activeClientsCount');
    this.cloudRelayStatusLabel = document.getElementById('cloudRelayStatusLabel');
    this.cloudBrokerLabel = document.getElementById('cloudBrokerLabel');

    this.btnToggleServer = document.getElementById('btnToggleServer');
    this.btnToggleServerText = document.getElementById('btnToggleServerText');
    this.btnDownloadApk = document.getElementById('btnDownloadApk');
    this.btnOpenDownloadCenter = document.getElementById('btnOpenDownloadCenter');
    this.controlServerStatusBadge = document.getElementById('controlServerStatusBadge');
    this.controlServerStatusText = document.getElementById('controlServerStatusText');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.refreshAll();

    // Auto-refresco de estado cada 3.5 segundos mientras el módulo esté abierto
    this.refreshInterval = setInterval(() => {
      this.refreshStatusOnly();
    }, 3500);

    // Escuchar cambio de estado del Cloud Relay
    this.onCloudStatusBound = (e) => this.onCloudRelayStatus(e.detail);
    window.addEventListener('cloud-relay:status', this.onCloudStatusBound);

    // Escuchar cambio de módulo para limpiar intervalo
    window.addEventListener('module-switched', (e) => {
      if (e.detail?.module !== 'control') {
        this.destroy();
      }
    }, { once: true });
  }

  bindEvents() {
    // Selector de modo Cloud vs Local
    if (this.tabModeCloud) {
      this.tabModeCloud.addEventListener('click', () => this.switchMode('cloud'));
    }
    if (this.tabModeLocal) {
      this.tabModeLocal.addEventListener('click', () => this.switchMode('local'));
    }

    if (this.btnRefreshQr) {
      this.btnRefreshQr.addEventListener('click', () => this.refreshQrCode());
    }

    if (this.btnCopyUrl) {
      this.btnCopyUrl.addEventListener('click', () => this.copyUrl());
    }

    // Código de Sala
    if (this.btnGenerateRoom) {
      this.btnGenerateRoom.addEventListener('click', () => this.generateNewRoom());
    }
    if (this.btnEditRoom) {
      this.btnEditRoom.addEventListener('click', () => {
        this.customRoomForm.style.display = 'flex';
        this.inputCustomRoom.value = this.controlRoomDisplay.textContent || '';
        this.inputCustomRoom.focus();
      });
    }
    if (this.btnCancelCustomRoom) {
      this.btnCancelCustomRoom.addEventListener('click', () => {
        this.customRoomForm.style.display = 'none';
      });
    }
    if (this.btnSaveCustomRoom) {
      this.btnSaveCustomRoom.addEventListener('click', () => this.saveCustomRoom());
    }
    if (this.inputCustomRoom) {
      this.inputCustomRoom.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.saveCustomRoom();
        } else if (e.key === 'Escape') {
          this.customRoomForm.style.display = 'none';
        }
      });
    }

    // PIN de Seguridad
    if (this.btnGeneratePin) {
      this.btnGeneratePin.addEventListener('click', () => this.generateNewPin());
    }
    if (this.btnEditPin) {
      this.btnEditPin.addEventListener('click', () => {
        this.customPinForm.style.display = 'flex';
        this.inputCustomPin.value = this.controlPinDisplay.textContent || '';
        this.inputCustomPin.focus();
      });
    }
    if (this.btnCancelCustomPin) {
      this.btnCancelCustomPin.addEventListener('click', () => {
        this.customPinForm.style.display = 'none';
      });
    }
    if (this.btnSaveCustomPin) {
      this.btnSaveCustomPin.addEventListener('click', () => this.saveCustomPin());
    }
    if (this.inputCustomPin) {
      this.inputCustomPin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.saveCustomPin();
        } else if (e.key === 'Escape') {
          this.customPinForm.style.display = 'none';
        }
      });
    }

    if (this.btnToggleServer) {
      this.btnToggleServer.addEventListener('click', () => this.toggleServer());
    }
  }

  switchMode(mode) {
    if (this.activeMode === mode) return;
    this.activeMode = mode;

    if (mode === 'cloud') {
      this.tabModeCloud?.classList.add('active');
      this.tabModeLocal?.classList.remove('active');
      if (this.qrModeTag) {
        this.qrModeTag.textContent = 'Universal Cloud';
        this.qrModeTag.className = 'tag-pill';
      }
      if (this.qrInstructionText) {
        this.qrInstructionText.textContent = 'Abre la cámara nativa de tu teléfono Android o iPhone y apunta hacia este código. Se abrirá la consola web conectada a tu sala.';
      }
      if (this.urlInputLabel) {
        this.urlInputLabel.textContent = 'Enlace Web Cloud Directo:';
      }
    } else {
      this.tabModeCloud?.classList.remove('active');
      this.tabModeLocal?.classList.add('active');
      if (this.qrModeTag) {
        this.qrModeTag.textContent = 'Local Wi-Fi';
        this.qrModeTag.className = 'tag-pill tag-secure';
      }
      if (this.qrInstructionText) {
        this.qrInstructionText.textContent = 'Apunta la cámara con el teléfono conectado al mismo Wi-Fi del templo para abrir el control local sin conexión a internet.';
      }
      if (this.urlInputLabel) {
        this.urlInputLabel.textContent = 'Dirección en Red Local (Wi-Fi):';
      }
    }

    this.refreshQrCode();
    this.applyStatusToUI(this.currentStatus);
  }

  async refreshAll() {
    await Promise.all([
      this.refreshStatusOnly(),
      this.refreshQrCode()
    ]);
  }

  async refreshStatusOnly() {
    if (!window.bibleAPI || !window.bibleAPI.control) return;
    try {
      const status = await window.bibleAPI.control.getStatus();
      this.currentStatus = status;
      this.applyStatusToUI(status);
    } catch (err) {
      console.warn('[ControlController] Error al consultar estado:', err);
    }
  }

  async refreshQrCode() {
    if (!window.bibleAPI || !window.bibleAPI.control) return;
    try {
      const svg = await window.bibleAPI.control.getQrSvg(this.activeMode);
      if (this.qrCodeSvgContainer && svg) {
        this.qrCodeSvgContainer.innerHTML = svg;
      }
    } catch (err) {
      console.warn('[ControlController] Error al obtener QR SVG:', err);
      if (this.qrCodeSvgContainer) {
        this.qrCodeSvgContainer.innerHTML = '<span style="color:var(--status-blackout)">Error generando QR</span>';
      }
    }
  }

  applyStatusToUI(status) {
    if (!status) return;

    if (this.controlRoomDisplay && status.roomId) {
      this.controlRoomDisplay.textContent = status.roomId;
    }

    if (this.controlUrlInput) {
      this.controlUrlInput.value = this.activeMode === 'local' ? status.localUrl : status.cloudUrl;
    }
    if (this.networkIpLabel && status.ip) {
      this.networkIpLabel.textContent = status.ip;
    }
    if (this.activeClientsCount) {
      this.activeClientsCount.textContent = status.activeConnections || 0;
    }
    if (this.controlPinDisplay && status.pin) {
      this.controlPinDisplay.textContent = status.pin;
    }
    if (this.btnDownloadApk && status.apkUrl) {
      this.btnDownloadApk.href = status.apkUrl;
    }
    if (this.btnOpenDownloadCenter && status.downloadCenterUrl) {
      this.btnOpenDownloadCenter.href = status.downloadCenterUrl;
    }

    if (status.isRunning) {
      this.btnToggleServerText.textContent = 'Reiniciar Servidor HTTP';
    } else {
      this.btnToggleServerText.textContent = 'Iniciar Servidor HTTP';
    }
  }

  onCloudRelayStatus(detail) {
    if (!detail) return;
    if (this.cloudRelayStatusLabel) {
      if (detail.connected) {
        this.cloudRelayStatusLabel.textContent = '🟢 Conectado';
        this.cloudRelayStatusLabel.style.color = 'var(--accent-green, #22c55e)';
        if (this.controlServerStatusText) {
          this.controlServerStatusText.textContent = `Cloud Relay Activo (${detail.broker || 'WSS'})`;
        }
      } else {
        this.cloudRelayStatusLabel.textContent = '🟡 Conectando...';
        this.cloudRelayStatusLabel.style.color = 'var(--accent-amber, #f59e0b)';
        if (this.controlServerStatusText) {
          this.controlServerStatusText.textContent = 'Reconectando Cloud Relay...';
        }
      }
    }
    if (this.cloudBrokerLabel && detail.broker) {
      this.cloudBrokerLabel.textContent = detail.broker;
    }
  }

  async copyUrl() {
    const url = this.controlUrlInput ? this.controlUrlInput.value : '';
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      if (this.btnCopyUrlLabel) {
        const originalText = this.btnCopyUrlLabel.textContent;
        this.btnCopyUrlLabel.textContent = '¡Copiado!';
        this.btnCopyUrl.classList.add('btn-success');
        setTimeout(() => {
          this.btnCopyUrlLabel.textContent = originalText;
          this.btnCopyUrl.classList.remove('btn-success');
        }, 2000);
      }
    } catch (err) {
      this.controlUrlInput.select();
      document.execCommand('copy');
    }
  }

  async generateNewRoom() {
    if (!window.bibleAPI || !window.bibleAPI.control) return;
    try {
      const newRoom = await window.bibleAPI.control.generateNewRoomId();
      if (this.controlRoomDisplay) {
        this.controlRoomDisplay.textContent = newRoom;
      }
      this.customRoomForm.style.display = 'none';
      window.dispatchEvent(new CustomEvent('control:room-updated', { detail: { roomId: newRoom } }));
      await this.refreshAll();
    } catch (err) {
      alert('Error al regenerar Código de Sala: ' + err.message);
    }
  }

  async saveCustomRoom() {
    const room = (this.inputCustomRoom?.value || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (room.length < 4 || room.length > 16) {
      alert('Por favor ingresa un Código de Sala de entre 4 y 16 caracteres (Ej: BIB-7842)');
      return;
    }

    try {
      const savedRoom = await window.bibleAPI.control.setRoomId(room);
      if (this.controlRoomDisplay) {
        this.controlRoomDisplay.textContent = savedRoom;
      }
      this.customRoomForm.style.display = 'none';
      window.dispatchEvent(new CustomEvent('control:room-updated', { detail: { roomId: savedRoom } }));
      await this.refreshAll();
    } catch (err) {
      alert('Error al guardar Código de Sala: ' + err.message);
    }
  }

  async generateNewPin() {
    if (!window.bibleAPI || !window.bibleAPI.control) return;
    try {
      const newPin = await window.bibleAPI.control.generateNewPin();
      if (this.controlPinDisplay) {
        this.controlPinDisplay.textContent = newPin;
      }
      this.customPinForm.style.display = 'none';
      window.dispatchEvent(new CustomEvent('control:pin-updated', { detail: { pin: newPin } }));
    } catch (err) {
      alert('Error al regenerar PIN: ' + err.message);
    }
  }

  async saveCustomPin() {
    const pin = (this.inputCustomPin?.value || '').trim();
    if (!/^\d{4}$/.test(pin)) {
      alert('Por favor ingresa un PIN numérico exacto de 4 dígitos (Ejemplo: 4567)');
      return;
    }

    try {
      const savedPin = await window.bibleAPI.control.setPin(pin);
      if (this.controlPinDisplay) {
        this.controlPinDisplay.textContent = savedPin;
      }
      this.customPinForm.style.display = 'none';
      window.dispatchEvent(new CustomEvent('control:pin-updated', { detail: { pin: savedPin } }));
    } catch (err) {
      alert('Error al guardar PIN: ' + err.message);
    }
  }

  async toggleServer() {
    if (!window.bibleAPI || !window.bibleAPI.control) return;
    try {
      if (this.currentStatus?.isRunning) {
        await window.bibleAPI.control.stopServer();
      } else {
        await window.bibleAPI.control.startServer();
      }
      await this.refreshAll();
    } catch (err) {
      alert('Error al alternar estado del servidor: ' + err.message);
    }
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    if (this.onCloudStatusBound) {
      window.removeEventListener('cloud-relay:status', this.onCloudStatusBound);
    }
  }
}
