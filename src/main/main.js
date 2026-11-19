const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const SecurityConfig = require('./security/security-config.js');
const dbManager = require('../database/database.js');
const projectionService = require('./services/projection-service.js');
const windowManager = require('./windows/window-manager.js');
const registerIpcHandlers = require('./ipc/register-ipc-handlers.js');

// 1. Registrar esquemas privilegiados antes de app.whenReady
SecurityConfig.registerSchemes();

// 2. Ciclo de vida principal
app.whenReady().then(() => {
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

  // Escuchar conexiones/desconexiones de monitores HDMI
  windowManager.setupDisplayListeners(projectionService);

  console.log('[Main] BIBLE inicializado y listo.');
});

// Salir cuando todas las ventanas se cierran
app.on('window-all-closed', () => {
  dbManager.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

