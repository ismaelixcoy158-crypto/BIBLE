const path = require('path');
const fs = require('fs');
const { dialog, app } = require('electron');

/**
 * BIBLE — BackgroundService
 * Servicio centralizado para la administración de fondos de proyección:
 * archivos locales (fotos/videos), enlaces web (HTTP/HTTPS) y degradados de estudio.
 */
class BackgroundService {
  constructor() {
    this.backgroundsDir = null;
  }

  init() {
    if (!this.backgroundsDir) {
      let userData;
      try {
        userData = (app && typeof app.getPath === 'function') ? app.getPath('userData') : null;
      } catch {}
      if (!userData) {
        userData = path.join('/tmp', 'bible-church-media-system');
      }
      this.backgroundsDir = path.join(userData, 'media', 'backgrounds');
      if (!fs.existsSync(this.backgroundsDir)) {
        fs.mkdirSync(this.backgroundsDir, { recursive: true });
      }
    }
  }

  /**
   * Abre explorador nativo para seleccionar una imagen o video local
   */
  async selectLocalBackground(parentWindow) {
    this.init();
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Seleccionar Fondo de Proyección (Imagen o Video)',
      properties: ['openFile'],
      filters: [
        { name: 'Multimedia (Imágenes y Videos)', extensions: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'] },
        { name: 'Imágenes (*.jpg, *.png, *.webp)', extensions: ['jpg', 'jpeg', 'png', 'webp'] },
        { name: 'Videos (*.mp4, *.webm)', extensions: ['mp4', 'webm'] }
      ]
    });

    if (result.canceled || !result.filePaths.length) {
      return null;
    }

    const sourcePath = result.filePaths[0];
    const ext = path.extname(sourcePath).toLowerCase();
    const isVideo = ['.mp4', '.webm'].includes(ext);
    const targetFilename = `bg_${Date.now()}${ext}`;
    const targetPath = path.join(this.backgroundsDir, targetFilename);

    // Copiar archivo al directorio seguro de medios
    fs.copyFileSync(sourcePath, targetPath);

    return {
      success: true,
      type: isVideo ? 'video' : 'image',
      url: `bible-media://backgrounds/${targetFilename}`,
      name: path.basename(sourcePath),
      source: 'local'
    };
  }

  /**
   * Limpia y normaliza cualquier URL ingresada por el usuario
   */
  normalizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    let clean = rawUrl.trim().replace(/^["'<`]|["'>`]$/g, '').trim();

    // Eliminar espacios accidentales dentro de la URL
    clean = clean.replace(/\s+/g, '');

    // Si el usuario copió un enlace sin https:// ni http://
    if (clean.startsWith('//')) {
      clean = 'https:' + clean;
    } else if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('data:')) {
      clean = 'https://' + clean;
    }

    // 1. Google Imágenes / Búsqueda de Google (extraer parámetro real de la imagen)
    if (clean.includes('google.') && (clean.includes('imgurl=') || clean.includes('mediaurl=') || (clean.includes('/url?') && clean.includes('url=')))) {
      try {
        const parsed = new URL(clean);
        let directImg = parsed.searchParams.get('imgurl') || parsed.searchParams.get('mediaurl') || parsed.searchParams.get('url');
        if (directImg) {
          while (directImg.includes('%2F') || directImg.includes('%3A') || directImg.includes('%3D')) {
            const decoded = decodeURIComponent(directImg);
            if (decoded === directImg) break;
            directImg = decoded;
          }
          return this.normalizeUrl(directImg);
        }
      } catch {}
    }

    // 2. Google Drive: convertir enlaces compartidos o de visor a descarga directa
    const driveMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) || 
                       clean.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i) ||
                       clean.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/i);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // 3. Dropbox: convertir enlaces de vista previa a descarga directa (raw=1)
    if (clean.includes('dropbox.com')) {
      clean = clean.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      if (clean.includes('dl=0')) clean = clean.replace('dl=0', 'raw=1');
      else if (clean.includes('dl=1')) clean = clean.replace('dl=1', 'raw=1');
      else if (!clean.includes('raw=1')) clean = clean + (clean.includes('?') ? '&raw=1' : '?raw=1');
      return clean;
    }

    // 4. Microsoft OneDrive / 1drv.ms
    if (clean.includes('1drv.ms') || clean.includes('onedrive.live.com')) {
      if (clean.includes('?')) {
        if (!clean.includes('download=1')) clean += '&download=1';
      } else {
        clean += '?download=1';
      }
      return clean;
    }

    // 5. YouTube: convertir enlace de video a miniatura oficial en máxima resolución
    const ytMatch = clean.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch) {
      const videoId = ytMatch[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // 6. Imgur: convertir post simple o galería a enlace directo de imagen
    const imgurMatch = clean.match(/imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)?$/i);
    if (imgurMatch && !clean.includes('i.imgur.com')) {
      const id = imgurMatch[1];
      const ext = imgurMatch[2] || '.jpg';
      return `https://i.imgur.com/${id}${ext}`;
    }

    // 7. Giphy: convertir enlaces de visualización a gif directo
    const giphyMatch = clean.match(/giphy\.com\/gifs\/(?:[a-zA-Z0-9_-]+-)?([a-zA-Z0-9]+)$/i);
    if (giphyMatch && !clean.includes('media.giphy.com')) {
      return `https://media.giphy.com/media/${giphyMatch[1]}/giphy.gif`;
    }

    return clean;
  }

  /**
   * Extrae la URL directa de la imagen desde el HTML de una página web (OpenGraph, Twitter Cards, JSON-LD)
   */
  extractImageFromHtml(html, baseUrl) {
    if (!html || typeof html !== 'string') return null;

    // 1. Buscar en etiquetas meta OpenGraph, Twitter Cards, link image_src
    const ogRegexes = [
      /<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image:secure_url["']/i,
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      /<meta[^>]*name=["']twitter:image:src["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image:src["']/i,
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
      /<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i,
      /<meta[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i
    ];

    for (const regex of ogRegexes) {
      const match = html.match(regex);
      if (match && match[1]) {
        try {
          return new URL(match[1].replace(/&amp;/g, '&'), baseUrl).href;
        } catch {
          return match[1].replace(/&amp;/g, '&');
        }
      }
    }

    // 2. Buscar en datos estructurados Schema.org JSON-LD
    const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        const candidate = data.image || data.thumbnailUrl || data.contentUrl || 
                          (Array.isArray(data['@graph']) && data['@graph'].find(item => item.image)?.image);
        if (candidate) {
          const imgUrl = typeof candidate === 'string' ? candidate : (candidate.url || candidate[0]);
          if (imgUrl && typeof imgUrl === 'string') {
            return new URL(imgUrl.replace(/&amp;/g, '&'), baseUrl).href;
          }
        }
      } catch {}
    }

    // 3. Buscar la primera etiqueta <img> con atributo src que parezca foto principal
    const imgTagMatches = html.matchAll(/<img[^>]*src=["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp|avif)[^"']*)["'][^>]*>/gi);
    for (const match of imgTagMatches) {
      const candidateSrc = match[1];
      // Filtrar iconos pequeños o logos de rastreo
      if (!candidateSrc.includes('icon') && !candidateSrc.includes('avatar') && !candidateSrc.includes('pixel') && !candidateSrc.includes('logo')) {
        return candidateSrc.replace(/&amp;/g, '&');
      }
    }

    return null;
  }

  /**
   * Descarga o valida un fondo desde cualquier enlace web (HTTP/HTTPS/Data URI)
   */
  async processUrlBackground(rawUrl) {
    this.init();
    const cleanUrl = this.normalizeUrl(rawUrl);
    if (!cleanUrl) {
      throw new Error('Por favor ingresa un enlace web válido');
    }

    // Detectar si el usuario pegó la URL de una página de visualización protegida por anti-bot
    const knownViewerPages = [
      { pattern: /unsplash\.com\/(?:[a-z-]+\/)?photos?\//i, name: 'Unsplash' },
      { pattern: /pexels\.com\/(?:[a-z-]+\/)?photo\//i, name: 'Pexels' },
      { pattern: /pinterest\.(?:[a-z.]+)\/pin\/|pin\.it\//i, name: 'Pinterest' },
      { pattern: /pixabay\.com\/(?:[a-z-]+\/)?photos?\//i, name: 'Pixabay' },
      { pattern: /freepik\.(?:com|es)\//i, name: 'Freepik' },
      { pattern: /shutterstock\.com\//i, name: 'Shutterstock' },
      { pattern: /wallpaperflare\.com\/(?!c4\.)/i, name: 'WallpaperFlare' }
    ];

    for (const site of knownViewerPages) {
      if (site.pattern.test(cleanUrl)) {
        throw new Error(
          `Has pegado el enlace de la página web de ${site.name} (no la foto directa).\n` +
          `Para usarla: en tu navegador haz CLIC DERECHO sobre la foto y selecciona "Copiar dirección de la imagen", luego pega ese enlace aquí.`
        );
      }
    }

    // Caso especial: Data URI (base64)
    if (cleanUrl.startsWith('data:image/')) {
      try {
        const matches = cleanUrl.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          const ext = '.' + (matches[1] === 'jpeg' ? 'jpg' : matches[1]);
          const buffer = Buffer.from(matches[2], 'base64');
          const targetFilename = `bg_data_${Date.now()}${ext}`;
          const targetPath = path.join(this.backgroundsDir, targetFilename);
          fs.writeFileSync(targetPath, buffer);
          return {
            success: true,
            type: 'image',
            url: `bible-media://backgrounds/${targetFilename}`,
            name: 'Imagen Pegada (Data URI)',
            source: 'url'
          };
        }
      } catch (err) {
        console.warn('[BackgroundService] Error procesando Data URI:', err);
      }
    }

    // Cabeceras de navegador moderno para evitar bloqueos por parte de servidores y CDNs
    const browserHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,image/svg+xml,image/*,video/*;q=0.8,*/*;q=0.5',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    let targetFetchUrl = cleanUrl;
    let isVideo = Boolean(cleanUrl.match(/\.(mp4|webm)($|\?)/i));

    try {
      let res = await fetch(targetFetchUrl, {
        headers: browserHeaders,
        redirect: 'follow'
      });

      // Si YouTube maxresdefault dio 404, intentar secuencialmente con hqdefault y sddefault
      if (res.status === 404 && targetFetchUrl.includes('maxresdefault.jpg')) {
        targetFetchUrl = targetFetchUrl.replace('maxresdefault.jpg', 'hqdefault.jpg');
        res = await fetch(targetFetchUrl, { headers: browserHeaders, redirect: 'follow' });
        if (res.status === 404) {
          targetFetchUrl = targetFetchUrl.replace('hqdefault.jpg', 'sddefault.jpg');
          res = await fetch(targetFetchUrl, { headers: browserHeaders, redirect: 'follow' });
        }
      }

      // Si Google Drive uc?export=download devolvió HTML (aviso de virus o página de confirmación),
      // intentar directamente con la API de miniaturas en alta resolución
      if (cleanUrl.includes('drive.google.com') && res.ok) {
        const cType = (res.headers.get('content-type') || '').toLowerCase();
        if (cType.includes('text/html')) {
          const driveIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          if (driveIdMatch) {
            targetFetchUrl = `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}&sz=w2560`;
            const thumbRes = await fetch(targetFetchUrl, { headers: browserHeaders, redirect: 'follow' });
            if (thumbRes.ok && (thumbRes.headers.get('content-type') || '').startsWith('image/')) {
              res = thumbRes;
            }
          }
        }
      }

      if (res.ok) {
        let contentType = (res.headers.get('content-type') || '').toLowerCase();
        let targetResponse = res;

        // Si la URL apuntaba a una página web (HTML), intentar extraer la imagen principal
        if (contentType.includes('text/html')) {
          const htmlText = await res.text();
          const extractedImgUrl = this.extractImageFromHtml(htmlText, res.url);
          if (extractedImgUrl) {
            targetFetchUrl = extractedImgUrl;
            const imgRes = await fetch(targetFetchUrl, { headers: browserHeaders, redirect: 'follow' });
            if (imgRes.ok) {
              targetResponse = imgRes;
              contentType = (imgRes.headers.get('content-type') || '').toLowerCase();
            } else {
              throw new Error(
                'El enlace apunta a una página web y no se pudo obtener su imagen principal.\n' +
                'Por favor, haz clic derecho sobre la foto en tu navegador y selecciona "Copiar dirección de la imagen".'
              );
            }
          } else {
            throw new Error(
              'El enlace ingresado es una página web y no contiene una imagen directa.\n' +
              'Por favor, haz clic derecho sobre la foto en tu navegador y selecciona "Copiar dirección de la imagen".'
            );
          }
        }

        // Determinar extensión adecuada a partir del Content-Type
        let ext = '.jpg';
        if (contentType.includes('png')) ext = '.png';
        else if (contentType.includes('webp')) ext = '.webp';
        else if (contentType.includes('gif')) ext = '.gif';
        else if (contentType.includes('svg')) ext = '.svg';
        else if (contentType.includes('avif')) ext = '.avif';
        else if (contentType.includes('mp4') || targetFetchUrl.includes('.mp4')) {
          ext = '.mp4';
          isVideo = true;
        } else if (contentType.includes('webm') || targetFetchUrl.includes('.webm')) {
          ext = '.webm';
          isVideo = true;
        }

        const buffer = Buffer.from(await targetResponse.arrayBuffer());
        // Límite de seguridad de 50MB
        if (buffer.length > 50 * 1024 * 1024) {
          throw new Error('El archivo remoto excede el límite máximo de 50 MB');
        }

        const targetFilename = `bg_web_${Date.now()}${ext}`;
        const targetPath = path.join(this.backgroundsDir, targetFilename);
        fs.writeFileSync(targetPath, buffer);

        return {
          success: true,
          type: isVideo ? 'video' : 'image',
          url: `bible-media://backgrounds/${targetFilename}`,
          originalUrl: cleanUrl,
          name: isVideo ? 'Video Web Guardado' : 'Fondo Web Guardado',
          source: 'url'
        };
      } else {
        throw new Error(`El servidor remoto respondió con estado ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.warn('[BackgroundService] Error procesando descarga de URL:', err.message);

      // Si el error fue una validación explícita de página web o límite, relanzar el mensaje claro
      if (err.message.includes('página web') || err.message.includes('límite máximo')) {
        throw err;
      }

      // Si el enlace tiene extensión reconocible de imagen/video o proviene de CDN conocido,
      // permitimos proyectarlo de forma directa en el navegador
      const isLikelyDirectMedia = Boolean(
        cleanUrl.match(/\.(jpe?g|png|webp|gif|svg|avif|mp4|webm)($|\?)/i) ||
        cleanUrl.match(/(images\.|cdn\.|pinimg\.com|ytimg\.com|googleusercontent\.com|cloudinary\.com|fbcdn\.net)/i)
      );

      if (isLikelyDirectMedia) {
        return {
          success: true,
          type: isVideo ? 'video' : 'image',
          url: cleanUrl,
          originalUrl: cleanUrl,
          name: isVideo ? 'Video Web Directo' : 'Fondo Web Directo',
          source: 'url',
          isDirectStream: true
        };
      }

      throw new Error(
        'No se pudo cargar la imagen desde ese enlace.\n' +
        'Sugerencia: En tu navegador, haz clic derecho sobre la foto y selecciona "Copiar dirección de la imagen".'
      );
    }
  }

  /**
   * Retorna los preajustes de degradados y fondos sólidos elegantes
   */
  getPresets() {
    return [
      {
        id: 'black',
        name: 'Negro Clásico',
        type: 'color',
        value: '#000000',
        preview: '#000000'
      },
      {
        id: 'deep-ocean',
        name: 'Océano Profundo',
        type: 'gradient',
        value: 'linear-gradient(145deg, #0a2e5c 0%, #124e8c 35%, #1a6cb8 65%, #0e3b6e 100%)',
        preview: 'linear-gradient(145deg, #0a2e5c 0%, #124e8c 35%, #1a6cb8 65%, #0e3b6e 100%)'
      },
      {
        id: 'blue-night',
        name: 'Obsidiana Noche',
        type: 'gradient',
        value: 'linear-gradient(145deg, #111e38 0%, #1e3a8a 40%, #2e4cad 70%, #152244 100%)',
        preview: 'linear-gradient(145deg, #111e38 0%, #1e3a8a 40%, #2e4cad 70%, #152244 100%)'
      },
      {
        id: 'celestial-purple',
        name: 'Púrpura Solemne',
        type: 'gradient',
        value: 'linear-gradient(145deg, #2b0938 0%, #581c87 40%, #7e22ce 70%, #350c45 100%)',
        preview: 'linear-gradient(145deg, #2b0938 0%, #581c87 40%, #7e22ce 70%, #350c45 100%)'
      },
      {
        id: 'emerald-dawn',
        name: 'Aurora Esmeralda',
        type: 'gradient',
        value: 'linear-gradient(145deg, #063828 0%, #047857 40%, #059669 70%, #084331 100%)',
        preview: 'linear-gradient(145deg, #063828 0%, #047857 40%, #059669 70%, #084331 100%)'
      },
      {
        id: 'warm-charcoal',
        name: 'Carbón y Oro',
        type: 'gradient',
        value: 'linear-gradient(145deg, #2b180a 0%, #78350f 40%, #b45309 70%, #3d210d 100%)',
        preview: 'linear-gradient(145deg, #2b180a 0%, #78350f 40%, #b45309 70%, #3d210d 100%)'
      }
    ];
  }
}

module.exports = new BackgroundService();

