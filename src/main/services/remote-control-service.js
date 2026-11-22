const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const QRCode = require('./qrcode-generator.js');
const projectionService = require('./projection-service.js');
const preachingService = require('./preaching-service.js');
const dbManager = require('../../database/database.js');

/**
 * BIBLE — RemoteControlService
 * Servidor HTTP local embebido de control remoto para teléfonos móviles (púlpito y multimedia).
 * 100% Offline: Funciona por Wi-Fi local sin internet, sin apps externas ni dependencias npm.
 */
class RemoteControlService {
  constructor() {
    this.server = null;
    this.port = 4545;
    this.isRunning = false;
    this.activeTokens = new Set();
    this.operatorWindow = null;
    this.publicWindow = null;
    this.clientHtml = null;
  }

  /**
   * Conecta las referencias de las ventanas del operador y pública
   */
  init({ operatorWindow, publicWindow } = {}) {
    if (operatorWindow) this.operatorWindow = operatorWindow;
    if (publicWindow) this.publicWindow = publicWindow;
    this.loadClientHtml();
  }

  /**
   * Carga en memoria la aplicación web móvil
   */
  loadClientHtml() {
    try {
      const htmlPath = path.join(__dirname, 'remote-client.html');
      if (fs.existsSync(htmlPath)) {
        this.clientHtml = fs.readFileSync(htmlPath, 'utf-8');
      }
    } catch (err) {
      console.warn('[RemoteControlService] No se pudo precargar remote-client.html:', err.message);
    }
  }

  /**
   * Detecta la dirección IP de la red Wi-Fi o red local activa
   */
  getLocalIpAddress() {
    try {
      const interfaces = os.networkInterfaces();
      const candidates = [];

      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          // Filtrar únicamente IPv4 no internas (no 127.0.0.1)
          if (iface.family === 'IPv4' && !iface.internal) {
            candidates.push({ name, address: iface.address });
          }
        }
      }

      if (candidates.length === 0) {
        return '127.0.0.1';
      }

      // Priorizar interfaces Wi-Fi o inalámbricas (wlan, wl, wi-fi, etc.)
      const wifiMatch = candidates.find(c => /wlan|wl|wifi|wi-fi/i.test(c.name));
      if (wifiMatch) return wifiMatch.address;

      // Priorizar interfaz Ethernet si no hay wifi
      const ethMatch = candidates.find(c => /eth|en/i.test(c.name));
      if (ethMatch) return ethMatch.address;

      return candidates[0].address;
    } catch (err) {
      return '127.0.0.1';
    }
  }

  /**
   * Retorna la URL local de conexión
   */
  getUrl() {
    const ip = this.getLocalIpAddress();
    return `http://${ip}:${this.port}`;
  }

  /**
   * Genera el SVG del código QR para la URL actual
   */
  getQrSvg() {
    const url = this.getUrl();
    return QRCode.generateSVG(url, 2);
  }

  /**
   * Obtiene el PIN de seguridad actual desde SQLite
   */
  getPin() {
    try {
      const db = dbManager.getDb ? dbManager.getDb() : (dbManager.init && dbManager.init());
      if (db) {
        const row = db.prepare("SELECT value FROM settings WHERE key = 'remote_control_pin'").get();
        if (row && row.value) {
          return String(row.value).trim();
        }
        // Sembrar PIN por defecto '1234'
        db.prepare(`
          INSERT INTO settings (key, value) VALUES ('remote_control_pin', '1234')
          ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run();
      }
    } catch (err) {
      console.warn('[RemoteControlService] Error al consultar PIN en settings:', err.message);
    }
    return '1234';
  }

  /**
   * Establece un nuevo PIN de seguridad de 4 dígitos
   */
  setPin(pin) {
    const cleanPin = String(pin).trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      throw new Error('El PIN debe ser un código numérico exacto de 4 dígitos');
    }
    try {
      const db = dbManager.getDb ? dbManager.getDb() : (dbManager.init && dbManager.init());
      if (db) {
        db.prepare(`
          INSERT INTO settings (key, value) VALUES ('remote_control_pin', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run(cleanPin);
      }
    } catch (err) {
      console.warn('[RemoteControlService] Error al guardar PIN:', err.message);
    }
    // Invalidar sesiones previas para exigir el nuevo PIN
    this.activeTokens.clear();
    return cleanPin;
  }

  /**
   * Genera un nuevo PIN aleatorio de 4 dígitos
   */
  generateNewPin() {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    return this.setPin(newPin);
  }

  /**
   * Valida si un token de sesión es legítimo
   */
  isValidToken(token) {
    if (!token) return false;
    return this.activeTokens.has(token);
  }

  /**
   * Estado completo del servidor para el módulo de escritorio y el cliente móvil
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      port: this.port,
      ip: this.getLocalIpAddress(),
      url: this.getUrl(),
      downloadCenterUrl: `${this.getUrl()}/download`,
      apkUrl: `${this.getUrl()}/download/bible-control.apk`,
      desktopUrl: `${this.getUrl()}/download/bible-desktop-linux.tar.gz`,
      windowsUrl: `${this.getUrl()}/download/bible-windows-setup.zip`,
      pin: this.getPin(),
      activeConnections: this.activeTokens.size,
      projection: projectionService.getState(),
      preaching: {
        activePreaching: preachingService.activePresentationState || null
      }
    };
  }

  /**
   * Inicia el servidor HTTP en el proceso principal de Electron
   */
  start() {
    if (this.isRunning && this.server) {
      return Promise.resolve(this.getStatus());
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleHttpRequest(req, res);
      });

      const tryListen = () => {
        this.server.removeAllListeners('error');
        this.server.removeAllListeners('listening');

        this.server.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.warn(`[RemoteControlService] Puerto ${this.port} ocupado, intentando puerto alternativo...`);
            this.port += 1;
            tryListen();
          } else {
            console.error('[RemoteControlService] Error en servidor HTTP:', err.message);
            reject(err);
          }
        });

        this.server.once('listening', () => {
          this.isRunning = true;
          console.log(`[RemoteControlService] Servidor de control remoto activo en ${this.getUrl()}`);
          resolve(this.getStatus());
        });

        this.server.listen(this.port, '0.0.0.0');
      };

      tryListen();
    });
  }

  /**
   * Detiene el servidor HTTP
   */
  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.server = null;
          this.isRunning = false;
          console.log('[RemoteControlService] Servidor detenido.');
          resolve(this.getStatus());
        });
      } else {
        resolve(this.getStatus());
      }
    });
  }

  /**
   * Manejador central de peticiones HTTP
   */
  handleHttpRequest(req, res) {
    // Permitir CORS básico para conexiones locales
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const isGetOrHead = req.method === 'GET' || req.method === 'HEAD';

    // 1. Ruta raíz: Servir cliente móvil web
    if (pathname === '/' && isGetOrHead) {
      this.loadClientHtml();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (req.method === 'HEAD') { res.end(); return; }
      res.end(this.clientHtml || '<h1>BIBLE Control Remoto</h1>');
      return;
    }

    // Manifest PWA (Permite instalar en Android como una aplicación/APK sin descargas)
    if (pathname === '/manifest.json' && isGetOrHead) {
      const manifest = {
        name: 'BIBLE Control Remoto',
        short_name: 'BIBLE Control',
        description: 'Control remoto local para púlpito y multimedia en iglesias',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      };
      res.writeHead(200, { 'Content-Type': 'application/manifest+json; charset=utf-8' });
      if (req.method === 'HEAD') { res.end(); return; }
      res.end(JSON.stringify(manifest));
      return;
    }

    // Icono oficial de la aplicación
    if (pathname === '/icon.png' && isGetOrHead) {
      const iconPath = path.join(__dirname, '../../renderer/shared/assets/bible-logo.png');
      if (fs.existsSync(iconPath)) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(iconPath).pipe(res);
        return;
      }
    }

    // Centro de Descargas (HTML para descargar APK del celular y paquete para otra computadora)
    if ((pathname === '/download' || pathname === '/downloads' || pathname === '/descargas') && isGetOrHead) {
      const centerPath = path.join(__dirname, 'download-center.html');
      if (fs.existsSync(centerPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(centerPath).pipe(res);
        return;
      }
    }

    // Descarga directa del instalador nativo de Android (.apk)
    if ((pathname === '/bible-control.apk' || pathname === '/download/bible-control.apk') && isGetOrHead) {
      const apkPath = path.join(__dirname, 'downloads/bible-control.apk');
      if (fs.existsSync(apkPath)) {
        const stat = fs.statSync(apkPath);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Length': stat.size,
          'Content-Disposition': 'attachment; filename="bible-control.apk"'
        });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(apkPath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('APK no disponible en este momento');
        return;
      }
    }

    // Descarga directa del paquete portable de BIBLE para Computadora (PC / Laptop Linux)
    if ((pathname === '/bible-desktop-linux.tar.gz' || pathname === '/download/bible-desktop-linux.tar.gz') && isGetOrHead) {
      const desktopPath = path.join(__dirname, 'downloads/bible-desktop-linux.tar.gz');
      if (fs.existsSync(desktopPath)) {
        const stat = fs.statSync(desktopPath);
        res.writeHead(200, {
          'Content-Type': 'application/gzip',
          'Content-Length': stat.size,
          'Content-Disposition': 'attachment; filename="bible-desktop-linux.tar.gz"'
        });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(desktopPath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Paquete de escritorio no disponible en este momento');
        return;
      }
    }

    // Descarga directa del Instalador Automático de Windows (.exe 1-Clic, se instala solo)
    if ((pathname === '/BIBLE-Instalador-Windows.exe' || pathname === '/download/BIBLE-Instalador-Windows.exe') && isGetOrHead) {
      const winExePath = path.join(__dirname, 'downloads/BIBLE-Instalador-Windows.exe');
      if (fs.existsSync(winExePath)) {
        const stat = fs.statSync(winExePath);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.microsoft.portable-executable',
          'Content-Length': stat.size,
          'Content-Disposition': 'attachment; filename="BIBLE-Instalador-Windows.exe"'
        });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(winExePath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Instalador de Windows no disponible en este momento');
        return;
      }
    }

    // Descarga directa de BIBLE Portable para Windows (Con BIBLE.exe 100% listo, sin instalar Node ni Git)
    if ((pathname === '/BIBLE-Windows-Portable.zip' || pathname === '/download/BIBLE-Windows-Portable.zip') && isGetOrHead) {
      const winPortablePath = path.join(__dirname, 'downloads/BIBLE-Windows-Portable.zip');
      if (fs.existsSync(winPortablePath)) {
        const stat = fs.statSync(winPortablePath);
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Length': stat.size,
          'Content-Disposition': 'attachment; filename="BIBLE-Windows-Portable.zip"'
        });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(winPortablePath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('BIBLE Portable para Windows no disponible en este momento');
        return;
      }
    }

    // Descarga directa del paquete instalador para Computadora Windows (PC / Laptop)
    if ((pathname === '/bible-windows-setup.zip' || pathname === '/download/bible-windows-setup.zip') && isGetOrHead) {
      const winPath = path.join(__dirname, 'downloads/bible-windows-setup.zip');
      if (fs.existsSync(winPath)) {
        const stat = fs.statSync(winPath);
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Length': stat.size,
          'Content-Disposition': 'attachment; filename="bible-windows-setup.zip"'
        });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(winPath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Paquete de Windows no disponible en este momento');
        return;
      }
    }

    // 2. Estado de proyección y servidor
    if (pathname === '/api/status' && req.method === 'GET') {
      const status = this.getStatus();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(status));
      return;
    }

    // 3. Código QR en formato SVG vectorial
    if (pathname === '/api/qr' && req.method === 'GET') {
      const svg = this.getQrSvg();
      res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
      res.end(svg);
      return;
    }

    // 4. Autenticación por PIN de 4 dígitos
    if (pathname === '/api/auth' && req.method === 'POST') {
      this.readJsonBody(req, (err, body) => {
        if (err || !body || !body.pin) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'Debe ingresar un PIN' }));
          return;
        }

        const currentPin = this.getPin();
        if (String(body.pin).trim() === currentPin) {
          const token = crypto.randomBytes(16).toString('hex');
          this.activeTokens.add(token);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, token }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'PIN incorrecto. Verifica la pantalla del operador.' }));
        }
      });
      return;
    }

    // 5. Ejecución de Acciones de Control (Avanzar, Retroceder, Pánico F1-F4)
    if (pathname === '/api/action' && req.method === 'POST') {
      const token = req.headers['x-auth-token'] ||
                    (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');

      if (!this.isValidToken(token)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'No autorizado. Se requiere PIN válido.' }));
        return;
      }

      this.readJsonBody(req, (err, body) => {
        if (err || !body || !body.action) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'Acción no especificada' }));
          return;
        }

        const action = body.action;
        let actionResult = null;

        switch (action) {
          case 'next':
            // 1. Si la predicación está en curso, avanzar diapositiva en el servicio
            if (preachingService.activePresentationState?.preachingId) {
              actionResult = preachingService.nextSlide();
            }
            // 2. Reenviar al shell del operador para que la Biblia o Coritos avancen si están activos
            if (this.operatorWindow && !this.operatorWindow.isDestroyed()) {
              this.operatorWindow.webContents.send('remote:action', { action: 'next' });
            }
            break;

          case 'prev':
            // 1. Si la predicación está en curso, retroceder diapositiva en el servicio
            if (preachingService.activePresentationState?.preachingId) {
              actionResult = preachingService.prevSlide();
            }
            // 2. Reenviar al shell del operador para que la Biblia o Coritos retrocedan si están activos
            if (this.operatorWindow && !this.operatorWindow.isDestroyed()) {
              this.operatorWindow.webContents.send('remote:action', { action: 'prev' });
            }
            break;

          case 'toggle-blackout':
            actionResult = projectionService.toggleBlackout();
            break;

          case 'toggle-logo':
            actionResult = projectionService.toggleLogo();
            break;

          case 'toggle-clear-text':
            actionResult = projectionService.toggleClearText();
            break;

          case 'toggle-freeze':
            actionResult = projectionService.toggleFreeze();
            break;

          default:
            console.warn('[RemoteControlService] Acción desconocida:', action);
            break;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          action,
          result: actionResult,
          state: projectionService.getState()
        }));
      });
      return;
    }

    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }

  /**
   * Helper para parsear cuerpos de peticiones JSON
   */
  readJsonBody(req, callback) {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1e5) { // 100 KB max
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(raw);
        callback(null, parsed);
      } catch (err) {
        callback(err, null);
      }
    });
  }
}

module.exports = new RemoteControlService();
