const { BrowserWindow, screen } = require('electron');
const path = require('path');
const SecurityConfig = require('../security/security-config.js');

class WindowManager {
  constructor() {
    this.operatorWindow = null;
    this.publicWindow = null;
  }

  /**
   * Identifica las pantallas disponibles
   * Devuelve { primaryDisplay, secondaryDisplay }
   */
  getDisplays() {
    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();
    const secondaryDisplay = displays.find(d => d.id !== primaryDisplay.id) || null;

    return { displays, primaryDisplay, secondaryDisplay };
  }

  /**
   * Crea la Ventana del Operador (Panel de Control)
   */
  createOperatorWindow() {
    const { primaryDisplay } = this.getDisplays();

    this.operatorWindow = new BrowserWindow({
      title: 'BIBLE — Panel del Operador',
      width: Math.min(1366, primaryDisplay.workAreaSize.width),
      height: Math.min(820, primaryDisplay.workAreaSize.height),
      minWidth: 1024,
      minHeight: 680,
      backgroundColor: '#0D1117',
      webPreferences: {
        preload: path.join(__dirname, '../../preload/preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    SecurityConfig.secureWindow(this.operatorWindow);

    // Redirigir mensajes de consola del renderer a stdout para diagnósticos claros
    this.operatorWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
      console.log(`[Operator Console] [lvl ${level}] ${message} (${sourceId}:${line})`);
    });

    this.operatorWindow.loadFile(
      path.join(__dirname, '../../renderer/shared/shell.html')
    );

    this.operatorWindow.on('closed', () => {
      this.operatorWindow = null;
      // Si se cierra el panel del operador, se cierra la aplicación
      if (this.publicWindow && !this.publicWindow.isDestroyed()) {
        this.publicWindow.close();
      }
    });

    return this.operatorWindow;
  }

  /**
   * Crea la Ventana Pública (Salida Congregacional en Proyector / TV)
   */
  createPublicWindow() {
    const { secondaryDisplay, primaryDisplay } = this.getDisplays();
    const targetDisplay = secondaryDisplay || primaryDisplay;
    const isSingleMonitor = !secondaryDisplay;

    this.publicWindow = new BrowserWindow({
      title: 'BIBLE — Proyección Pública',
      x: targetDisplay.bounds.x + (isSingleMonitor ? 100 : 0),
      y: targetDisplay.bounds.y + (isSingleMonitor ? 100 : 0),
      width: isSingleMonitor ? 960 : targetDisplay.bounds.width,
      height: isSingleMonitor ? 540 : targetDisplay.bounds.height,
      frame: isSingleMonitor, // Con marco solo en desarrollo con un monitor
      fullscreen: !isSingleMonitor, // Pantalla completa real en monitor secundario
      skipTaskbar: !isSingleMonitor,
      backgroundColor: '#000000',
      webPreferences: {
        preload: path.join(__dirname, '../../preload/preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    SecurityConfig.secureWindow(this.publicWindow);

    this.publicWindow.loadFile(
      path.join(__dirname, '../../renderer/projection/projection.html')
    );

    this.publicWindow.on('closed', () => {
      this.publicWindow = null;
    });

    return this.publicWindow;
  }

  /**
   * Escucha eventos de conexión / desconexión HDMI
   */
  setupDisplayListeners(projectionService) {
    screen.on('display-added', (event, newDisplay) => {
      console.log('[WindowManager] Nuevo display detectado:', newDisplay.id);
      if (this.publicWindow && !this.publicWindow.isDestroyed()) {
        // Mover la ventana pública automáticamente a la nueva pantalla conectada
        this.publicWindow.setBounds(newDisplay.bounds);
        this.publicWindow.setFullScreen(true);
        if (projectionService) projectionService.emitState();
      }
    });

    screen.on('display-removed', (event, oldDisplay) => {
      console.warn('[WindowManager] Pantalla desconectada:', oldDisplay.id);
      // Mantener la ventana activa sin cerrarla para no perder el estado
    });
  }

  getWindows() {
    return {
      operatorWindow: this.operatorWindow,
      publicWindow: this.publicWindow
    };
  }
}

module.exports = new WindowManager();

