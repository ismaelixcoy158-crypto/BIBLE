const { session, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * BIBLE — SecurityConfig
 * Centraliza las directivas de seguridad de Electron: CSP, navegación y protocolo seguro de medios.
 */
class SecurityConfig {
  /**
   * Registra el esquema personalizado privilegiado 'bible-media'
   * Debe llamarse antes de que la aplicación esté lista (app.whenReady)
   */
  static registerSchemes() {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'bible-media',
        privileges: {
          standard: true,
          secure: true,
          supportFetchAPI: true,
          corsEnabled: true,
          stream: true
        }
      }
    ]);
  }

  /**
   * Configura las políticas de seguridad en la sesión activa
   * @param {string} mediaDirectory Ruta absoluta autorizada para archivos multimedia
   */
  static apply(mediaDirectory) {
    // 1. Manejador del protocolo bible-media://
    protocol.handle('bible-media', (request) => {
      try {
        const urlObj = new URL(request.url);
        // La URL viene como 'bible-media://local/<nombre-archivo>' o 'bible-media://<path>'
        let relativePath = decodeURIComponent(urlObj.pathname);
        if (relativePath.startsWith('/')) {
          relativePath = relativePath.slice(1);
        }

        // Resolución segura para prevenir Path Traversal
        const resolvedPath = path.resolve(mediaDirectory, relativePath);

        // Validación estricta: la ruta debe residir dentro de mediaDirectory
        if (!resolvedPath.startsWith(path.resolve(mediaDirectory))) {
          console.error('[Security] Acceso denegado fuera del directorio multimedia:', resolvedPath);
          return new Response('Acceso no autorizado', { status: 403 });
        }

        if (!fs.existsSync(resolvedPath)) {
          return new Response('Archivo no encontrado', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(resolvedPath);
        return new Response(fileBuffer);
      } catch (err) {
        console.error('[Security] Error en protocolo bible-media:', err);
        return new Response('Error interno de seguridad', { status: 500 });
      }
    });

    // 2. Configurar cabeceras de Content Security Policy (CSP)
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: bible-media:; " +
            "media-src 'self' bible-media:; " +
            "font-src 'self';"
          ]
        }
      });
    });

    // 3. Restringir navegación externa en cualquier webContents
    session.defaultSession.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.protocol !== 'file:' && parsedUrl.protocol !== 'bible-media:') {
        event.preventDefault();
        console.warn('[Security] Navegación no autorizada bloqueada:', navigationUrl);
      }
    });
  }

  /**
   * Configura una ventana específica para bloquear ventanas emergentes no autorizadas
   */
  static secureWindow(windowInstance) {
    windowInstance.webContents.setWindowOpenHandler(({ url }) => {
      console.warn('[Security] Intento de ventana emergente bloqueado:', url);
      return { action: 'deny' };
    });
  }
}

module.exports = SecurityConfig;

