const { app, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const SecurityConfig = require('./security/security-config.js');
const dbManager = require('../database/database.js');
const projectionService = require('./services/projection-service.js');
const churchService = require('./services/church-service.js');
const remoteControlService = require('./services/remote-control-service.js');
const windowManager = require('./windows/window-manager.js');
const registerIpcHandlers = require('./ipc/register-ipc-handlers.js');

// 1. Registrar esquemas privilegiados y políticas de autoplay antes de app.whenReady
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
if (!app.commandLine.hasSwitch('remote-debugging-port')) {
  app.commandLine.appendSwitch('remote-debugging-port', '9222');
}
SecurityConfig.registerSchemes();

// 2. Ciclo de vida principal
app.whenReady().then(() => {
  // Desactivar barra de menús genérica de Chromium para no interferir con atajos Alt del operador
  Menu.setApplicationMenu(null);
  // Inicializar Base de Datos SQLite (WAL + Migraciones)
  try {
    dbManager.init();
    console.log('[Main] Base de datos SQLite inicializada correctamente.');
  } catch (err) {
    console.error('[Main] Error crítico al inicializar la base de datos:', err);
    app.quit();
    return;
  }

  // Directorio local de archivos multimedia
  const userDataPath = app.getPath('userData');
  console.log('[Main] UserData path:', userDataPath);
  const mediaDirectory = path.join(userDataPath, 'media');
  if (!fs.existsSync(mediaDirectory)) {
    fs.mkdirSync(mediaDirectory, { recursive: true });
  }

  // Aplicar configuraciones de seguridad (CSP, protocolo bible-media://)
  SecurityConfig.apply(mediaDirectory);

  // Registrar manejadores IPC
  registerIpcHandlers();

  // Crear ventanas
  const operatorWindow = windowManager.createOperatorWindow();
  const publicWindow = windowManager.createPublicWindow();

  // Conectar ventanas con el servicio central de proyección
  projectionService.setWindows({ operatorWindow, publicWindow });

  // Sincronizar identidad institucional de la iglesia al inicio
  try {
    const churchIdentity = churchService.getIdentity();
    projectionService.setChurchIdentity(churchIdentity);
  } catch (err) {
    console.warn('[Main] No se pudo inicializar identidad de la iglesia:', err);
  }

  // Iniciar servidor local de control remoto (púlpito y multimedia)
  try {
    remoteControlService.init({ operatorWindow, publicWindow });
    remoteControlService.start();
  } catch (err) {
    console.warn('[Main] No se pudo inicializar control remoto:', err);
  }

  // Escuchar conexiones/desconexiones de monitores HDMI
  windowManager.setupDisplayListeners(projectionService);

  console.log('[Main] BIBLE inicializado y listo.');
});

// Salir cuando todas las ventanas se cierran
app.on('window-all-closed', () => {
  try {
    remoteControlService.stop();
  } catch (e) {}
  dbManager.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

