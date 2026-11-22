/**
 * BIBLE — ControlController
 * Controlador para la interfaz de escritorio del módulo de Control Remoto.
 */
export class ControlController {
  constructor() {
    this.refreshInterval = null;
    this.currentStatus = null;

    // Elementos DOM
    this.qrCodeSvgContainer = document.getElementById('qrCodeSvgContainer');
    this.btnRefreshQr = document.getElementById('btnRefreshQr');
    this.controlUrlInput = document.getElementById('controlUrlInput');
    this.btnCopyUrl = document.getElementById('btnCopyUrl');
    this.btnCopyUrlLabel = document.getElementById('btnCopyUrlLabel');
    this.networkIpLabel = document.getElementById('networkIpLabel');
    this.activeClientsCount = document.getElementById('activeClientsCount');
    this.btnToggleServer = document.getElementById('btnToggleServer');
    this.btnToggleServerText = document.getElementById('btnToggleServerText');
    this.btnDownloadApk = document.getElementById('btnDownloadApk');
    this.btnDownloadDesktop = document.getElementById('btnDownloadDesktop');
    this.btnOpenDownloadCenter = document.getElementById('btnOpenDownloadCenter');
    this.controlPinDisplay = document.getElementById('controlPinDisplay');
    this.btnGeneratePin = document.getElementById('btnGeneratePin');
    this.btnEditPin = document.getElementById('btnEditPin');
    this.customPinForm = document.getElementById('customPinForm');
    this.inputCustomPin = document.getElementById('inputCustomPin');
    this.btnSaveCustomPin = document.getElementById('btnSaveCustomPin');
    this.btnCancelCustomPin = document.getElementById('btnCancelCustomPin');
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

    // Escuchar cambio de módulo para limpiar intervalo
    window.addEventListener('module-switched', (e) => {
      if (e.detail?.module !== 'control') {
        this.destroy();
      }
    }, { once: true });
  }

  bindEvents() {
    if (this.btnRefreshQr) {
      this.btnRefreshQr.addEventListener('click', () => this.refreshQrCode());
    }

    if (this.btnCopyUrl) {
      this.btnCopyUrl.addEventListener('click', () => this.copyUrl());
    }

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
      const svg = await window.bibleAPI.control.getQrSvg();
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

    if (this.controlUrlInput && status.url) {
      this.controlUrlInput.value = status.url;
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
    if (this.btnDownloadDesktop && status.desktopUrl) {
      this.btnDownloadDesktop.href = status.desktopUrl;
    }
    if (this.btnOpenDownloadCenter && status.downloadCenterUrl) {
      this.btnOpenDownloadCenter.href = status.downloadCenterUrl;
    }

    if (status.isRunning) {
      this.controlServerStatusBadge.className = 'status-chip chip-online';
      this.controlServerStatusText.textContent = `Servidor Activo (Puerto ${status.port || 4545})`;
      this.btnToggleServerText.textContent = 'Detener Servidor HTTP';
    } else {
      this.controlServerStatusBadge.className = 'status-chip';
      this.controlServerStatusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
      this.controlServerStatusBadge.style.color = '#b91c1c';
      this.controlServerStatusText.textContent = 'Servidor Detenido';
      this.btnToggleServerText.textContent = 'Iniciar Servidor HTTP';
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
      // Fallback manual de selección
      this.controlUrlInput.select();
      document.execCommand('copy');
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
  }
}

