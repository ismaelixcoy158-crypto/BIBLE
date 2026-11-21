/**
 * BIBLE — ProjectionService
 * Máquina de estados centralizada e independiente para la proyección pública.
 * Administra el contenido activo, modos de pánico (Negro, Logo, Borrar Texto) y congelamiento.
 */
class ProjectionService {
  constructor() {
    this.operatorWindow = null;
    this.publicWindow = null;

    this.state = {
      activeContent: null,      // { module, title, text, reference, background, customStyles, meta }
      currentBackground: null,  // Fondo activo general del culto (compartido entre todos los módulos)
      currentTextColor: 'white',// Color de letra general del culto (Blanco / Negro)
      currentFontSize: 100,     // Escala de tamaño de letra en porcentaje (60% - 220%)
      currentFontFamily: 'sans-serif', // Tipografía ('sans-serif', 'serif', 'bold', 'condensed')
      isBlackout: false,        // Pantalla a negro
      isLogo: false,            // Logotipo de la iglesia / fondo institucional
      churchIdentity: null,     // { name, logoUrl }
      isClearText: false,       // Oculta el texto pero mantiene el fondo activo
      isFrozen: false,          // Congela la emisión actual
      lastUpdated: Date.now()
    };
  }

  /**
   * Vincula las referencias de las ventanas creadas
   */
  setWindows({ operatorWindow, publicWindow }) {
    this.operatorWindow = operatorWindow;
    this.publicWindow = publicWindow;
  }

  /**
   * Retorna una copia inmutable del estado actual
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Actualiza los datos de la identidad institucional disponibles para proyección
   */
  setChurchIdentity(identity) {
    this.state.churchIdentity = identity;
    if (this.state.isLogo) {
      this.emitState();
    }
  }

  /**
   * Proyecta un nuevo contenido aprobado por el operador
   * @param {Object} payload Contenido a proyectar
   */
  project(payload) {
    // Si el payload trae un fondo explícito, actualizamos el fondo global del servicio
    if (payload.background) {
      this.state.currentBackground = payload.background;
    } else if (this.state.currentBackground) {
      // Si el contenido proyectado no trae fondo explícito, preservamos el fondo global activo
      payload.background = this.state.currentBackground;
    } else if (this.state.activeContent?.background) {
      payload.background = this.state.activeContent.background;
      this.state.currentBackground = this.state.activeContent.background;
    }

    // Preservar o actualizar el color de letra general
    if (payload.textColor) {
      this.state.currentTextColor = payload.textColor;
    } else if (this.state.currentTextColor && !payload.textColor) {
      payload.textColor = this.state.currentTextColor;
    }

    // Preservar o actualizar el tamaño de letra general
    if (payload.fontSize !== undefined) {
      this.state.currentFontSize = payload.fontSize;
    } else if (this.state.currentFontSize && payload.fontSize === undefined) {
      payload.fontSize = this.state.currentFontSize;
    }

    // Preservar o actualizar la tipografía general
    if (payload.fontFamily) {
      this.state.currentFontFamily = payload.fontFamily;
    } else if (this.state.currentFontFamily && !payload.fontFamily) {
      payload.fontFamily = this.state.currentFontFamily;
    }

    // Al proyectar nuevo contenido aprobado por el operador, desactivamos automáticamente
    // cualquier modo de pánico previo (blackout, logo, clearText) y descongelamos la emisión
    this.state.activeContent = { ...payload };
    this.state.isBlackout = false;
    this.state.isLogo = false;
    this.state.isClearText = false;
    this.state.isFrozen = false;
    this.state.lastUpdated = Date.now();

    this.emitState();
    return this.getState();
  }

  /**
   * Activa o desactiva la pantalla a negro
   */
  toggleBlackout(forceState = null) {
    this.state.isBlackout = forceState !== null ? forceState : !this.state.isBlackout;
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Activa o desactiva la pantalla de Logotipo
   */
  toggleLogo(forceState = null) {
    this.state.isLogo = forceState !== null ? forceState : !this.state.isLogo;
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Oculta o muestra el texto sobre el fondo
   */
  toggleClearText(forceState = null) {
    this.state.isClearText = forceState !== null ? forceState : !this.state.isClearText;
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Actualiza el fondo de la emisión activa en tiempo real y lo memoriza globalmente
   */
  updateBackground(background) {
    this.state.currentBackground = background;
    if (this.state.activeContent) {
      this.state.activeContent.background = background;
    }
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Actualiza el color de letra (blanco / negro) en tiempo real y lo memoriza globalmente
   */
  updateTextColor(textColor) {
    this.state.currentTextColor = textColor;
    if (this.state.activeContent) {
      this.state.activeContent.textColor = textColor;
    }
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Actualiza el tamaño de letra en tiempo real (porcentaje 60% - 220%)
   */
  updateFontSize(fontSize) {
    const clamped = Math.max(60, Math.min(220, parseInt(fontSize, 10) || 100));
    this.state.currentFontSize = clamped;
    if (this.state.activeContent) {
      this.state.activeContent.fontSize = clamped;
    }
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Actualiza la tipografía / tipo de letra en tiempo real
   */
  updateFontFamily(fontFamily) {
    this.state.currentFontFamily = fontFamily || 'sans-serif';
    if (this.state.activeContent) {
      this.state.activeContent.fontFamily = this.state.currentFontFamily;
    }
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Congela o descongela la emisión
   */
  toggleFreeze(forceState = null) {
    this.state.isFrozen = forceState !== null ? forceState : !this.state.isFrozen;
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
  }

  /**
   * Envía un comando de control de reproducción multimedia (Play, Pause, Seek, Volume, Loop, Stop)
   */
  sendMediaCommand(commandData) {
    if (this.publicWindow && !this.publicWindow.isDestroyed()) {
      this.publicWindow.webContents.send('projection:media-command', commandData);
    }
    if (this.operatorWindow && !this.operatorWindow.isDestroyed()) {
      this.operatorWindow.webContents.send('projection:media-command', commandData);
    }
  }

  /**
   * Notifica el tiempo transcurrido del video desde la pantalla pública al monitor del operador
   */
  notifyMediaTimeUpdate(timeData) {
    if (this.operatorWindow && !this.operatorWindow.isDestroyed()) {
      this.operatorWindow.webContents.send('projection:media-time-update', timeData);
    }
  }

  /**
   * Emite el estado a la ventana pública y al monitor del operador
   */
  emitState() {
    const currentState = this.getState();

    // 1. Notificar a la pantalla pública congregacional
    if (this.publicWindow && !this.publicWindow.isDestroyed()) {
      this.publicWindow.webContents.send('projection:update', currentState);
    }

    // 2. Notificar al panel del operador (para la vista previa 16:9 y botones de estado)
    if (this.operatorWindow && !this.operatorWindow.isDestroyed()) {
      this.operatorWindow.webContents.send('projection:preview-update', currentState);
    }
  }
}

const defaultProjectionService = new ProjectionService();
module.exports = defaultProjectionService;
module.exports.ProjectionService = ProjectionService;
