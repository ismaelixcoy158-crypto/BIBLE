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
        // Soporta bible-media://backgrounds/bg_123.jpg, bible-media://branding/logo.png, etc.
        const host = urlObj.hostname || '';
        let pathname = decodeURIComponent(urlObj.pathname || '');
        if (pathname.startsWith('/')) {
          pathname = pathname.slice(1);
        }

        let resolvedPath;
        if (host && host !== 'local') {
          resolvedPath = path.resolve(mediaDirectory, host, pathname);
        } else {
          resolvedPath = path.resolve(mediaDirectory, pathname);
        }

        // Si no existe con host, intentar directamente bajo mediaDirectory
        if (!fs.existsSync(resolvedPath)) {
          const directFallback = path.resolve(mediaDirectory, pathname);
          if (fs.existsSync(directFallback)) {
            resolvedPath = directFallback;
          }
        }

        // Validación estricta: la ruta debe residir dentro de mediaDirectory
        if (!resolvedPath.startsWith(path.resolve(mediaDirectory))) {
          console.error('[Security] Acceso denegado fuera del directorio multimedia:', resolvedPath);
          return new Response('Acceso no autorizado', { status: 403 });
        }

        if (!fs.existsSync(resolvedPath)) {
          return new Response('Archivo no encontrado', { status: 404 });
        }

        const ext = path.extname(resolvedPath).toLowerCase();
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.bmp': 'image/bmp',
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.mkv': 'video/x-matroska',
          '.avi': 'video/x-msvideo',
          '.mov': 'video/quicktime',
          '.m4v': 'video/x-m4v'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        const stats = fs.statSync(resolvedPath);
        const fileSize = stats.size;
        const range = request.headers.get('range');

        // Soporte de Range Requests (HTTP 206 Partial Content) para reproducción y streaming fluido de videos
        if (range && (ext === '.mp4' || ext === '.webm' || ext === '.mkv' || ext === '.mov' || ext === '.m4v')) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;

          const stream = fs.createReadStream(resolvedPath, { start, end });
          const { Readable } = require('stream');
          const webStream = Readable.toWeb(stream);

          return new Response(webStream, {
            status: 206,
            statusText: 'Partial Content',
            headers: {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': String(chunksize),
              'Content-Type': contentType
            }
          });
        }

        const fileBuffer = fs.readFileSync(resolvedPath);
        return new Response(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Length': String(fileSize),
            'Accept-Ranges': 'bytes'
          }
        });
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
            "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: bible-media: http: https: blob: https://*.ytimg.com https://*.googleusercontent.com; " +
            "media-src 'self' bible-media: http: https: blob:; " +
            "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; " +
            "child-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; " +
            "connect-src 'self' http: https: blob: data: https://www.youtube.com; " +
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

