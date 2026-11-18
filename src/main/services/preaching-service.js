const path = require('path');
const fs = require('fs');
const { dialog, app } = require('electron');
const dbManager = require('../../database/database.js');
const PreachingRepository = require('../../database/repositories/preaching.repository.js');
const projectionService = require('./projection-service.js');

/**
 * BIBLE — PreachingService
 * Orquestador para presentaciones de predicación, control de diapositivas y alternancia con Biblia.
 */
class PreachingService {
  constructor() {
    this.repo = null;
    this.mediaDir = null;
    this.activePresentationState = {
      preachingId: 1,
      slideIndex: 0
    };
  }

  init() {
    if (!this.repo) {
      const db = dbManager.getInstance();
      this.repo = new PreachingRepository(db);

      const userData = app.getPath('userData');
      this.mediaDir = path.join(userData, 'media', 'preachings');
      if (!fs.existsSync(this.mediaDir)) {
        fs.mkdirSync(this.mediaDir, { recursive: true });
      }
    }
  }

  getAll() {
    this.init();
    return this.repo.getAll();
  }

  getById(id) {
    this.init();
    return this.repo.getById(id);
  }

  /**
   * Abre diálogo nativo para seleccionar un archivo PDF o PowerPoint
   */
  async selectAndImportPresentation(parentWindow) {
    this.init();
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Importar Presentación de Predicación',
      properties: ['openFile'],
      filters: [
        { name: 'Presentaciones y Documentos', extensions: ['pdf', 'pptx'] },
        { name: 'Documentos PDF', extensions: ['pdf'] },
        { name: 'PowerPoint', extensions: ['pptx'] }
      ]
    });

    if (result.canceled || !result.filePaths.length) return null;

    const sourcePath = result.filePaths[0];
    const ext = path.extname(sourcePath).toLowerCase().replace('.', '');
    const filename = path.basename(sourcePath);
    const title = path.basename(sourcePath, path.extname(sourcePath));

    const targetFilename = `preaching_${Date.now()}_${filename}`;
    const targetPath = path.join(this.mediaDir, targetFilename);
    fs.copyFileSync(sourcePath, targetPath);

    // Creamos diapositivas de referencia inicial
    const initialSlides = [
      { imagePath: `slide_default_1.jpg`, notes: 'Diapositiva 1' },
      { imagePath: `slide_default_2.jpg`, notes: 'Diapositiva 2' },
      { imagePath: `slide_default_3.jpg`, notes: 'Diapositiva 3' }
    ];

    const created = this.repo.create({
      title,
      original_filename: filename,
      file_type: ext === 'pptx' ? 'pptx' : 'pdf',
      slides: initialSlides
    });

    return created;
  }

  /**
   * Proyecta una diapositiva específica y guarda la posición actual
   */
  projectSlide(preachingId, slideIndex) {
    this.init();
    const preaching = this.repo.getById(preachingId);
    if (!preaching) throw new Error('Presentación no encontrada');

    const slide = preaching.slides[slideIndex];
    if (!slide) throw new Error(`Diapositiva ${slideIndex} no existe`);

    // Memorizar estado en el servicio y en SQLite para que el cambio a la Biblia no lo pierda
    this.activePresentationState = { preachingId, slideIndex };
    this.repo.updateLastSlideIndex(preachingId, slideIndex);

    // Emitir a la proyección
    projectionService.project({
      module: 'preaching',
      title: `${preaching.title} (Diapositiva ${slideIndex + 1}/${preaching.slide_count})`,
      text: slide.notes || `[Diapositiva ${slideIndex + 1}]`,
      reference: preaching.title,
      slideUrl: slide.slide_image_path,
      currentSlide: slideIndex + 1,
      totalSlides: preaching.slide_count
    });

    return {
      preachingId,
      slideIndex,
      totalSlides: preaching.slide_count
    };
  }

  /**
   * Reanuda la predicación exactamente en la diapositiva en la que quedó tras consultar la Biblia
   */
  resumeActivePreaching() {
    if (!this.activePresentationState.preachingId) return null;
    return this.projectSlide(
      this.activePresentationState.preachingId,
      this.activePresentationState.slideIndex
    );
  }

  delete(id) {
    this.init();
    return this.repo.delete(id);
  }
}

module.exports = new PreachingService();
