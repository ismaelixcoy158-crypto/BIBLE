const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { dialog, app } = require('electron');
const dbManager = require('../../database/database.js');
const SpotsRepository = require('../../database/repositories/spots.repository.js');
const projectionService = require('./projection-service.js');

/**
 * BIBLE — SpotsService
 * Gestión, importación y emisión profesional de anuncios multimedia, fotos y videos.
 * Soporta archivos locales (MP4, WebM, MKV, AVI, MOV, imágenes) y enlaces por HTTP / Web.
 */
class SpotsService {
  constructor() {
    this.repo = null;
    this.spotsDir = null;
  }

  init() {
    if (!this.repo) {
      const db = dbManager.getInstance();
      this.repo = new SpotsRepository(db);

      const userData = app.getPath('userData');
      this.spotsDir = path.join(userData, 'media', 'spots');
      if (!fs.existsSync(this.spotsDir)) {
        fs.mkdirSync(this.spotsDir, { recursive: true });
      }

      this.ensureSampleFiles();
    }
  }

  /**
   * Garantiza que los archivos de muestra predeterminados existan en disco
   */
  ensureSampleFiles() {
    try {
      const seedsDir = path.join(__dirname, '../../database/seeds/sample_spots');
      if (fs.existsSync(seedsDir)) {
        const samples = ['sample_vigilia.mp4', 'sample_campamento.png'];
        for (const file of samples) {
          const src = path.join(seedsDir, file);
          const dest = path.join(this.spotsDir, file);
          if (fs.existsSync(src) && !fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      }
    } catch (e) {
      console.warn('[SpotsService] Advertencia al verificar archivos de muestra:', e.message);
    }
  }

  /**
   * Obtiene todos los spots registrados formateando adecuadamente su mediaUrl
   */
  getAll(fileType = null) {
    this.init();
    const items = this.repo.getAll(fileType);
    return items.map(s => this.formatSpot(s));
  }

  getById(id) {
    this.init();
    const spot = this.repo.getById(id);
    if (!spot) return null;
    return this.formatSpot(spot);
  }

  /**
   * Formatea un spot para resolver si es URL HTTP/HTTPS directa o archivo local en bible-media://
   */
  formatSpot(spot) {
    const isHttp = spot.stored_filename && (
      spot.stored_filename.startsWith('http://') || 
      spot.stored_filename.startsWith('https://') ||
      spot.stored_filename.startsWith('data:')
    );
    const mediaUrl = isHttp ? spot.stored_filename : `bible-media://spots/${spot.stored_filename}`;
    return {
      ...spot,
      mediaUrl,
      isHttp: Boolean(isHttp)
    };
  }

  /**
   * Abre explorador nativo para importar imágenes o videos de cualquier formato
   */
  async selectAndImportSpot(parentWindow) {
    this.init();
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Importar Spot Multimedia (Video o Foto)',
      properties: ['openFile'],
      filters: [
        { 
          name: 'Todos los Formatos Compatibles', 
          extensions: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'm4v', 'mpg', 'mpeg', 'wmv', 'flv', 'ts', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'] 
        },
        { 
          name: 'Videos (MP4, WebM, MKV, AVI, MOV, M4V, WMV)', 
          extensions: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'm4v', 'mpg', 'mpeg', 'wmv', 'flv', 'ts'] 
        },
        { 
          name: 'Imágenes (PNG, JPG, JPEG, WEBP, GIF, SVG, BMP)', 
          extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'] 
        }
      ]
    });

    if (result.canceled || !result.filePaths.length) return null;

    const sourcePath = result.filePaths[0];
    const stats = fs.statSync(sourcePath);
    const ext = path.extname(sourcePath).toLowerCase().replace('.', '');
    const filename = path.basename(sourcePath);
    const title = path.basename(sourcePath, path.extname(sourcePath));

    const videoExts = ['mp4', 'webm', 'mkv', 'avi', 'mov', 'm4v', 'mpg', 'mpeg', 'wmv', 'flv', 'ts'];
    const isVideo = videoExts.includes(ext);
    const file_type = isVideo ? 'video' : 'image';
    const mime_type = isVideo ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    const stored_filename = `spot_${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const targetPath = path.join(this.spotsDir, stored_filename);
    fs.copyFileSync(sourcePath, targetPath);

    const created = this.repo.create({
      title,
      file_type,
      original_filename: filename,
      stored_filename,
      mime_type,
      file_size: stats.size,
      duration_seconds: 0,
      loop_enabled: isVideo ? 1 : 0
    });

    return this.formatSpot(created);
  }

  /**
   * Agrega un spot por URL (HTTP / HTTPS / Web) con opción de descarga local o streaming
   */
  async createFromUrl({ url, title, fileType = null, loopEnabled = true, downloadLocal = false }) {
    this.init();
    const cleanUrl = (url || '').trim();
    if (!cleanUrl) throw new Error('La URL es requerida');

    // Detección automática de video o imagen
    let detectedType = fileType;
    if (!detectedType) {
      if (cleanUrl.match(/\.(mp4|webm|mkv|avi|mov|m4v|m3u8|ts)($|\?)/i)) {
        detectedType = 'video';
      } else {
        detectedType = 'image';
      }
    }

    const defaultTitle = title?.trim() || cleanUrl.split('/').pop().split('?')[0] || (detectedType === 'video' ? 'Video Web' : 'Imagen Web');

    if (downloadLocal) {
      // Descargar archivo a disco local
      const ext = cleanUrl.match(/\.([a-zA-Z0-9]+)($|\?)/) ? cleanUrl.match(/\.([a-zA-Z0-9]+)($|\?)/)[1].toLowerCase() : (detectedType === 'video' ? 'mp4' : 'jpg');
      const filename = `web_${Date.now()}.${ext}`;
      const targetPath = path.join(this.spotsDir, filename);

      await this.downloadHttpFile(cleanUrl, targetPath);
      const stats = fs.statSync(targetPath);

      const created = this.repo.create({
        title: defaultTitle,
        file_type: detectedType,
        original_filename: path.basename(cleanUrl),
        stored_filename: filename,
        mime_type: detectedType === 'video' ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        file_size: stats.size,
        duration_seconds: 0,
        loop_enabled: loopEnabled ? 1 : 0
      });

      return this.formatSpot(created);
    } else {
      // Guardar enlace directo para streaming HTTP/HTTPS
      const created = this.repo.create({
        title: defaultTitle,
        file_type: detectedType,
        original_filename: cleanUrl,
        stored_filename: cleanUrl, // se guarda la URL directamente
        mime_type: detectedType === 'video' ? 'video/mp4' : 'image/jpeg',
        file_size: 0,
        duration_seconds: 0,
        loop_enabled: loopEnabled ? 1 : 0
      });

      return this.formatSpot(created);
    }
  }

  /**
   * Descarga un archivo por HTTP/HTTPS
   */
  downloadHttpFile(fileUrl, destPath) {
    return new Promise((resolve, reject) => {
      const client = fileUrl.startsWith('https') ? https : http;
      const file = fs.createWriteStream(destPath);

      const req = client.get(fileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BIBLE-Media/1.0'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Seguir redirección
          file.close();
          return this.downloadHttpFile(res.headers.location, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(destPath, () => {});
          return reject(new Error(`Error al descargar recurso: HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      });

      req.on('error', (err) => {
        file.close();
        fs.unlink(destPath, () => {});
        reject(err);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        file.close();
        fs.unlink(destPath, () => {});
        reject(new Error('Tiempo de espera agotado al descargar archivo'));
      });
    });
  }

  /**
   * Actualiza título o configuración de bucle de un spot
   */
  update(id, data) {
    this.init();
    const updated = this.repo.update(id, data);
    return this.formatSpot(updated);
  }

  /**
   * Proyecta directamente el spot en la pantalla congregacional
   */
  projectSpot(id, options = {}) {
    this.init();
    const spot = this.getById(id);
    if (!spot) throw new Error('Spot no encontrado');

    const volume = options.volume !== undefined ? options.volume : 1.0;
    const currentTime = options.currentTime || 0;

    projectionService.project({
      module: 'spots',
      spotId: spot.id,
      title: spot.title,
      fileType: spot.file_type,
      mediaUrl: spot.mediaUrl,
      loop: Boolean(spot.loop_enabled),
      volume,
      currentTime
    });

    return spot;
  }

  /**
   * Comandos de control de reproducción de medios
   */
  play() {
    projectionService.sendMediaCommand({ action: 'play' });
  }

  pause() {
    projectionService.sendMediaCommand({ action: 'pause' });
  }

  seek(seconds) {
    projectionService.sendMediaCommand({ action: 'seek', time: seconds });
  }

  setVolume(volume, muted = false) {
    projectionService.sendMediaCommand({ action: 'volume', volume, muted });
  }

  setLoop(spotId, loopEnabled) {
    this.init();
    if (spotId) {
      this.repo.update(spotId, { loop_enabled: loopEnabled ? 1 : 0 });
    }
    projectionService.sendMediaCommand({ action: 'loop', loop: Boolean(loopEnabled) });
  }

  stop() {
    projectionService.sendMediaCommand({ action: 'stop' });
    projectionService.project({
      module: 'idle',
      title: 'En espera'
    });
  }

  delete(id) {
    this.init();
    const spot = this.repo.getById(id);
    if (spot && spot.stored_filename && !spot.stored_filename.startsWith('http')) {
      const filePath = path.join(this.spotsDir, spot.stored_filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn(e); }
      }
    }
    return this.repo.delete(id);
  }
}

module.exports = new SpotsService();
