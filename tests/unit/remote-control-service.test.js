const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

const QRCode = require('../../src/main/services/qrcode-generator.js');
const remoteControlService = require('../../src/main/services/remote-control-service.js');
const projectionService = require('../../src/main/services/projection-service.js');
const dbManager = require('../../src/database/database.js');

describe('RemoteControlService — Control Remoto Móvil (Wi-Fi Local)', () => {
  before(async () => {
    dbManager.init();
    remoteControlService.init();
    remoteControlService.setPin('1234');
    await remoteControlService.start();
  });

  after(async () => {
    await remoteControlService.stop();
  });

  test('QRCode - debe generar SVG vectorial válido sin dependencias', () => {
    const testUrl = 'http://192.168.1.50:4545';
    const svg = QRCode.generateSVG(testUrl, 2);

    assert.ok(typeof svg === 'string', 'El resultado debe ser un string');
    assert.ok(svg.includes('<svg xmlns="http://www.w3.org/2000/svg"'), 'Debe contener etiqueta svg');
    assert.ok(svg.includes('viewBox='), 'Debe tener viewBox responsivo');
    assert.ok(svg.includes('<path d="M'), 'Debe contener los módulos QR en vector path');
  });

  test('debe detectar IP local válida y construir URL de conexión', () => {
    const ip = remoteControlService.getLocalIpAddress();
    assert.ok(typeof ip === 'string' && ip.length > 0, 'Debe retornar una IP');
    assert.match(ip, /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, 'Debe tener formato IPv4');

    const url = remoteControlService.getUrl();
    assert.equal(url, `http://${ip}:${remoteControlService.port}`);
  });

  test('debe gestionar el PIN de 4 dígitos (consultar, personalizar y regenerar)', () => {
    assert.equal(remoteControlService.getPin(), '1234');

    // Cambiar PIN
    const customPin = remoteControlService.setPin('9876');
    assert.equal(customPin, '9876');
    assert.equal(remoteControlService.getPin(), '9876');

    // Debe rechazar PIN no numérico o de longitud distinta a 4
    assert.throws(() => remoteControlService.setPin('123'), /4 dígitos/);
    assert.throws(() => remoteControlService.setPin('abcd'), /4 dígitos/);
    assert.throws(() => remoteControlService.setPin('12345'), /4 dígitos/);

    // Regenerar PIN aleatorio
    const randomPin = remoteControlService.generateNewPin();
    assert.match(randomPin, /^\d{4}$/);
    assert.equal(remoteControlService.getPin(), randomPin);

    // Restaurar PIN de prueba
    remoteControlService.setPin('1234');
  });

  test('debe responder GET / con la aplicación web móvil (remote-client.html)', async () => {
    const status = remoteControlService.getStatus();
    const port = status.port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, headers: r.headers, body: data }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.ok(res.headers['content-type'].includes('text/html'));
    assert.ok(res.body.includes('BIBLE Control'));
    assert.ok(res.body.includes('Modo Predicador'));
    assert.ok(res.body.includes('Modo Multimedia'));
  });

  test('debe responder GET /api/status con datos del servidor y de proyección', async () => {
    const status = remoteControlService.getStatus();
    const port = status.port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/api/status`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, body: JSON.parse(data) }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.isRunning, true);
    assert.equal(res.body.port, port);
    assert.ok(res.body.projection, 'Debe incluir estado de proyección');
    assert.equal(typeof res.body.pin, 'string');
  });

  test('debe responder GET /manifest.json con el manifiesto PWA para instalación móvil', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/manifest.json`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, headers: r.headers, body: JSON.parse(data) }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.name, 'BIBLE Control Remoto');
    assert.equal(res.body.display, 'standalone');
  });

  test('debe responder GET /icon.png con la imagen de logotipo en Content-Type image/png', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/icon.png`, (r) => {
        const chunks = [];
        r.on('data', chunk => chunks.push(chunk));
        r.on('end', () => resolve({ statusCode: r.statusCode, headers: r.headers, length: Buffer.concat(chunks).length }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.ok(res.headers['content-type'].includes('image/png'));
    assert.ok(res.length > 1000);
  });

  test('debe permitir descargar el APK nativo en GET /download/bible-control.apk', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/download/bible-control.apk`, (r) => {
        const chunks = [];
        r.on('data', chunk => chunks.push(chunk));
        r.on('end', () => resolve({
          statusCode: r.statusCode,
          headers: r.headers,
          length: Buffer.concat(chunks).length
        }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/vnd.android.package-archive');
    assert.ok(res.length > 50000, 'El APK debe pesar más de 50 KB');
  });

  test('debe permitir descargar el instalador ejecutable de Windows en GET /download/BIBLE-Instalador-Windows.exe', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/download/BIBLE-Instalador-Windows.exe`, (r) => {
        const chunks = [];
        r.on('data', chunk => {
          chunks.push(chunk);
          if (Buffer.concat(chunks).length > 2048) {
            r.destroy(); // Solo necesitamos verificar cabeceras y primeros bytes del binario PE
            resolve({
              statusCode: r.statusCode,
              headers: r.headers,
              firstBytes: Buffer.concat(chunks).slice(0, 2).toString()
            });
          }
        });
        r.on('end', () => resolve({
          statusCode: r.statusCode,
          headers: r.headers,
          firstBytes: Buffer.concat(chunks).slice(0, 2).toString()
        }));
      }).on('error', (err) => {
        // Ignorar error si fue por destroy tras recibir bytes
        if (err.code === 'ECONNRESET') return;
        reject(err);
      });
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/vnd.microsoft.portable-executable');
    assert.ok(res.headers['content-disposition'].includes('BIBLE-Instalador-Windows.exe'));
    assert.equal(res.firstBytes, 'MZ', 'Debe ser un ejecutable PE válido con cabecera MZ');
  });

  test('debe responder GET /api/qr con código SVG en Content-Type image/svg+xml', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/api/qr`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, headers: r.headers, body: data }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.ok(res.headers['content-type'].includes('image/svg+xml'));
    assert.ok(res.body.includes('<svg'));
  });

  test('debe rechazar PIN incorrecto en POST /api/auth con 401', async () => {
    const port = remoteControlService.getStatus().port;
    const postData = JSON.stringify({ pin: '0000' });

    const res = await new Promise((resolve, reject) => {
      const req = http.request(`http://127.0.0.1:${port}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, body: JSON.parse(data) }));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.success, false);
  });

  test('debe autenticar con PIN correcto en POST /api/auth y emitir token', async () => {
    const port = remoteControlService.getStatus().port;
    const postData = JSON.stringify({ pin: '1234' });

    const res = await new Promise((resolve, reject) => {
      const req = http.request(`http://127.0.0.1:${port}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, body: JSON.parse(data) }));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token, 'Debe devolver un token de sesión');
  });

  test('debe permitir ejecutar acciones autorizadas con el token (toggle-blackout, etc.)', async () => {
    const port = remoteControlService.getStatus().port;

    // 1. Obtener token
    const authPost = JSON.stringify({ pin: '1234' });
    const authRes = await new Promise((resolve, reject) => {
      const req = http.request(`http://127.0.0.1:${port}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(authPost) }
      }, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => resolve(JSON.parse(d)));
      });
      req.on('error', reject);
      req.write(authPost);
      req.end();
    });

    const token = authRes.token;
    assert.ok(token);

    // Estado inicial de blackout
    const initialBlackout = projectionService.getState().isBlackout;

    // 2. Enviar acción 'toggle-blackout' con token
    const actionPost = JSON.stringify({ action: 'toggle-blackout' });
    const actionRes = await new Promise((resolve, reject) => {
      const req = http.request(`http://127.0.0.1:${port}/api/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
          'Content-Length': Buffer.byteLength(actionPost)
        }
      }, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => resolve({ statusCode: r.statusCode, body: JSON.parse(d) }));
      });
      req.on('error', reject);
      req.write(actionPost);
      req.end();
    });

    assert.equal(actionRes.statusCode, 200);
    assert.equal(actionRes.body.success, true);
    assert.equal(actionRes.body.state.isBlackout, !initialBlackout);

    // Restaurar estado de blackout
    projectionService.toggleBlackout(false);
  });

  test('debe servir el Centro de Descargas en GET /download con opciones para móvil y PC', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/download`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, headers: r.headers, body: data }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.ok(res.headers['content-type'].includes('text/html'));
    assert.ok(res.body.includes('Centro de Descargas BIBLE'));
    assert.ok(res.body.includes('bible-control.apk'));
    assert.ok(res.body.includes('bible-desktop-linux.tar.gz'));
  });

  test('debe permitir descargar el paquete de escritorio en GET /download/bible-desktop-linux.tar.gz', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/download/bible-desktop-linux.tar.gz`, (r) => {
        const chunks = [];
        r.on('data', chunk => chunks.push(chunk));
        r.on('end', () => resolve({
          statusCode: r.statusCode,
          headers: r.headers,
          length: Buffer.concat(chunks).length
        }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/gzip');
    assert.ok(res.length > 50000000, 'El paquete comprimido de escritorio debe pesar más de 50 MB');
  });

  test('debe permitir descargar el instalador para Windows en GET /download/bible-windows-setup.zip', async () => {
    const port = remoteControlService.getStatus().port;

    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/download/bible-windows-setup.zip`, (r) => {
        const chunks = [];
        r.on('data', chunk => chunks.push(chunk));
        r.on('end', () => resolve({
          statusCode: r.statusCode,
          headers: r.headers,
          length: Buffer.concat(chunks).length
        }));
      }).on('error', reject);
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/zip');
    assert.ok(res.length > 5000000, 'El paquete de Windows debe pesar más de 5 MB');
  });
});
