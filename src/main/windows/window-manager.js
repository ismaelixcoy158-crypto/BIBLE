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

    const appIcon = path.join(__dirname, '../../assets/icons/bible-logo.png');

    this.operatorWindow = new BrowserWindow({
      title: 'BIBLE — Panel del Operador',
      icon: appIcon,
      width: Math.min(1366, primaryDisplay.workAreaSize.width),
      height: Math.min(820, primaryDisplay.workAreaSize.height),
      minWidth: 1024,
      minHeight: 680,
      backgroundColor: '#0D1117',
      autoHideMenuBar: true,
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

    // Abrir maximizado para que ocupe toda la pantalla del operador
    this.operatorWindow.maximize();

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

    const appIcon = path.join(__dirname, '../../assets/icons/bible-logo.png');

    this.publicWindow = new BrowserWindow({
      title: 'BIBLE — Proyección Pública',
      icon: appIcon,
      x: targetDisplay.bounds.x + (isSingleMonitor ? 100 : 0),
      y: targetDisplay.bounds.y + (isSingleMonitor ? 100 : 0),
      width: isSingleMonitor ? 960 : targetDisplay.bounds.width,
      height: isSingleMonitor ? 540 : targetDisplay.bounds.height,
      frame: isSingleMonitor, // Con marco solo en desarrollo con un solo monitor
      fullscreen: !isSingleMonitor, // Pantalla completa en monitor secundario
      skipTaskbar: !isSingleMonitor,
      alwaysOnTop: !isSingleMonitor,
      autoHideMenuBar: true,
      resizable: true,
      minWidth: 480,
      minHeight: 270,
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

    if (!isSingleMonitor && secondaryDisplay) {
      this.publicWindow.setMenuBarVisibility(false);
      this.publicWindow.setBounds(secondaryDisplay.bounds);
      this.publicWindow.setFullScreen(true);
    }

    this.publicWindow.on('closed', () => {
      this.publicWindow = null;
    });

    return this.publicWindow;
  }

  /**
   * Alterna la visibilidad de la ventana pública o la envía en pantalla completa al proyector
   */
  togglePublicWindow() {
    if (!this.publicWindow || this.publicWindow.isDestroyed()) {
      this.createPublicWindow();
      return true;
    }
    const { secondaryDisplay } = this.getDisplays();
    if (secondaryDisplay) {
      // Re-alinear y forzar pantalla completa limpia en el proyector / TV
      this.publicWindow.setFullScreen(false);
      this.publicWindow.setBounds(secondaryDisplay.bounds);
      this.publicWindow.setMenuBarVisibility(false);
      this.publicWindow.setFullScreen(true);
      this.publicWindow.show();
      if (this.operatorWindow && !this.operatorWindow.isDestroyed()) {
        this.operatorWindow.focus();
      }
      return true;
    } else {
      // Modo 1 monitor: alternar mostrar u ocultar la ventana flotante
      if (this.publicWindow.isVisible()) {
        this.publicWindow.hide();
        return false;
      } else {
        this.publicWindow.show();
        return true;
      }
    }
  }

  /**
   * Escucha eventos de conexión / desconexión HDMI o cambios de pantalla
   */
  setupDisplayListeners(projectionService) {
    const handleDisplayChange = () => {
      const { secondaryDisplay, displays } = this.getDisplays();
      console.log('[WindowManager] Actualización de pantallas:', displays.length, 'detectadas');
      if (this.publicWindow && !this.publicWindow.isDestroyed()) {
        if (secondaryDisplay) {
          console.log('[WindowManager] Proyector secundario activo, moviendo proyección a pantalla completa');
          this.publicWindow.setFullScreen(false);
          this.publicWindow.setBounds(secondaryDisplay.bounds);
          this.publicWindow.setMenuBarVisibility(false);
          this.publicWindow.setFullScreen(true);
          this.publicWindow.show();
        }
        if (projectionService) projectionService.emitState();
      }
    };

    screen.on('display-added', handleDisplayChange);
    screen.on('display-metrics-changed', handleDisplayChange);
    screen.on('display-removed', handleDisplayChange);
  }

  getWindows() {
    return {
      operatorWindow: this.operatorWindow,
      publicWindow: this.publicWindow
    };
  }
}

module.exports = new WindowManager();

