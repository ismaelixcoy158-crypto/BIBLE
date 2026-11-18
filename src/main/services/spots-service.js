const path = require('path');
const fs = require('fs');
const { dialog, app } = require('electron');
const dbManager = require('../../database/database.js');
const SpotsRepository = require('../../database/repositories/spots.repository.js');
const projectionService = require('./projection-service.js');

/**
 * BIBLE — SpotsService
 * Gestión, importación y emisión de anuncios multimedia, fotos y videos.
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
    }
  }

  getAll(fileType = null) {
    this.init();
    const items = this.repo.getAll(fileType);
    return items.map(s => ({
      ...s,
      mediaUrl: `bible-media://spots/${s.stored_filename}`
    }));
  }

  getById(id) {
    this.init();
    const spot = this.repo.getById(id);
    if (!spot) return null;
    return {
      ...spot,
      mediaUrl: `bible-media://spots/${spot.stored_filename}`
    };
  }

  /**
   * Abre explorador nativo para importar imágenes o videos
   */
  async selectAndImportSpot(parentWindow) {
    this.init();
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Importar Spot Multimedia (Foto o Video)',
      properties: ['openFile'],
      filters: [
        { name: 'Multimedia Compatible', extensions: ['mp4', 'webm', 'png', 'jpg', 'jpeg', 'webp'] },
        { name: 'Videos (MP4, WebM)', extensions: ['mp4', 'webm'] },
        { name: 'Imágenes (PNG, JPG, WEBP)', extensions: ['png', 'jpg', 'jpeg', 'webp'] }
      ]
    });

    if (result.canceled || !result.filePaths.length) return null;

    const sourcePath = result.filePaths[0];
    const stats = fs.statSync(sourcePath);
    const ext = path.extname(sourcePath).toLowerCase().replace('.', '');
    const filename = path.basename(sourcePath);
    const title = path.basename(sourcePath, path.extname(sourcePath));

    const isVideo = ['mp4', 'webm'].includes(ext);
    const file_type = isVideo ? 'video' : 'image';
    const mime_type = isVideo ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    const stored_filename = `spot_${Date.now()}_${filename}`;
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

    return {
      ...created,
      mediaUrl: `bible-media://spots/${created.stored_filename}`
    };
  }

  /**
   * Proyecta directamente el spot en la pantalla congregacional
   */
  projectSpot(id) {
    this.init();
    const spot = this.getById(id);
    if (!spot) throw new Error('Spot no encontrado');

    projectionService.project({
      module: 'spots',
      title: spot.title,
      fileType: spot.file_type,
      mediaUrl: spot.mediaUrl,
      loop: Boolean(spot.loop_enabled)
    });

    return spot;
  }

  delete(id) {
    this.init();
    const spot = this.repo.getById(id);
    if (spot && spot.stored_filename) {
      const filePath = path.join(this.spotsDir, spot.stored_filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn(e); }
      }
    }
    return this.repo.delete(id);
  }
}

module.exports = new SpotsService();
