const test = require('node:test');
const assert = require('node:assert/strict');
const backgroundService = require('../../src/main/services/background-service.js');

test('BackgroundService - Normalización y Procesamiento Universal de Enlaces (URLs)', async (t) => {

  await t.test('debe auto-completar https:// si el usuario ingresó un enlace sin protocolo', () => {
    const res = backgroundService.normalizeUrl('misitio.com/fondo.jpg');
    assert.equal(res, 'https://misitio.com/fondo.jpg');
  });

  await t.test('debe convertir enlaces compartidos de Google Drive a descarga directa', () => {
    const url1 = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0/view?usp=sharing';
    assert.equal(backgroundService.normalizeUrl(url1), 'https://drive.google.com/uc?export=download&id=1A2B3C4D5E6F7G8H9I0');

    const url2 = 'https://drive.google.com/open?id=XYZ987654321';
    assert.equal(backgroundService.normalizeUrl(url2), 'https://drive.google.com/uc?export=download&id=XYZ987654321');
  });

  await t.test('debe convertir enlaces de Dropbox a descarga directa (raw=1 y dl.dropboxusercontent.com)', () => {
    const url1 = 'https://www.dropbox.com/scl/fi/abc123xyz/fondo.jpg?rlkey=secret&dl=0';
    const res1 = backgroundService.normalizeUrl(url1);
    assert.equal(res1.includes('dl.dropboxusercontent.com'), true);
    assert.equal(res1.includes('raw=1'), true);
    assert.equal(res1.includes('dl=0'), false);
  });

  await t.test('debe extraer el enlace de imagen real de resultados de Google Imágenes', () => {
    const googleImgUrl = 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.ejemplo.com%2Ffotos%2Fcielo.jpg&imgrefurl=https%3A%2F%2Fejemplo.com&tbnid=abc';
    const res = backgroundService.normalizeUrl(googleImgUrl);
    assert.equal(res, 'https://cdn.ejemplo.com/fotos/cielo.jpg');
  });

  await t.test('debe convertir enlaces de video de YouTube a miniatura oficial en máxima resolución', () => {
    const yt1 = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    assert.equal(backgroundService.normalizeUrl(yt1), 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');

    const yt2 = 'https://youtu.be/dQw4w9WgXcQ';
    assert.equal(backgroundService.normalizeUrl(yt2), 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');

    const ytShort = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
    assert.equal(backgroundService.normalizeUrl(ytShort), 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
  });

  await t.test('debe convertir enlaces de post simple de Imgur a enlace directo de imagen', () => {
    const imgur = 'https://imgur.com/gallery/a8cdef1';
    assert.equal(backgroundService.normalizeUrl(imgur), 'https://i.imgur.com/a8cdef1.jpg');
  });

  await t.test('debe extraer imagen desde metadatos OpenGraph y Twitter Cards en HTML', () => {
    const htmlOg = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="https://cdn.test.com/og-banner.jpg" />
        </head>
      </html>
    `;
    const extracted = backgroundService.extractImageFromHtml(htmlOg, 'https://test.com');
    assert.equal(extracted, 'https://cdn.test.com/og-banner.jpg');
  });

  await t.test('debe detectar páginas web conocidas (Unsplash, Pexels, Pinterest) y rechazar con mensaje de instrucción', async () => {
    await assert.rejects(
      async () => {
        await backgroundService.processUrlBackground('https://unsplash.com/photos/snow-covered-mountain-12345');
      },
      (err) => {
        return err.message.includes('Unsplash') && err.message.includes('Copiar dirección de la imagen');
      }
    );

    await assert.rejects(
      async () => {
        await backgroundService.processUrlBackground('https://www.pexels.com/photo/silhouette-of-cross-123/');
      },
      (err) => {
        return err.message.includes('Pexels') && err.message.includes('Copiar dirección de la imagen');
      }
    );
  });
});

