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
      isBlackout: false,        // Pantalla a negro
      isLogo: false,            // Logotipo de la iglesia / fondo institucional
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
   * Proyecta un nuevo contenido aprobado por el operador
   * @param {Object} payload Contenido a proyectar
   */
  project(payload) {
    if (this.state.isFrozen) {
      console.warn('[ProjectionService] Proyección bloqueada: La pantalla está CONGELADA.');
      return this.getState();
    }

    // Al proyectar nuevo contenido, desactivamos automáticamente blackout y logo
    this.state.activeContent = { ...payload };
    this.state.isBlackout = false;
    this.state.isLogo = false;
    this.state.isClearText = false;
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
   * Congela o descongela la emisión
   */
  toggleFreeze(forceState = null) {
    this.state.isFrozen = forceState !== null ? forceState : !this.state.isFrozen;
    this.state.lastUpdated = Date.now();
    this.emitState();
    return this.getState();
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
