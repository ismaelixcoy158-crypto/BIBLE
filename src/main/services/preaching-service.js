const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { dialog, app } = require('electron');
const dbManager = require('../../database/database.js');
const PreachingRepository = require('../../database/repositories/preaching.repository.js');
const PresentationConverter = require('./presentation-converter.js');
const projectionService = require('./projection-service.js');

/**
 * BIBLE — PreachingService
 * Orquestador para presentaciones de predicación, conversión fiel de diapositivas,
 * alternancia de modo (Fondo Original vs Fondo del Culto) y reanudación tras consultar la Biblia.
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

      const userData = app ? app.getPath('userData') : path.join(process.cwd(), 'userData');
      this.mediaDir = path.join(userData, 'media', 'preachings');
      if (!fs.existsSync(this.mediaDir)) {
        fs.mkdirSync(this.mediaDir, { recursive: true });
      }

      this.ensureSeedMedia();
    }
  }

  /**
   * Asegura que los archivos multimedia de la presentación inicial sembrada existan
   */
  ensureSeedMedia() {
    try {
      const pres1Dir = path.join(this.mediaDir, 'pres_1');
      if (!fs.existsSync(pres1Dir)) {
        fs.mkdirSync(pres1Dir, { recursive: true });
      }

      const seedDir = path.join(__dirname, '../../database/seeds/default_preachings/pres_1');
      if (fs.existsSync(seedDir)) {
        const seedFiles = fs.readdirSync(seedDir);
        for (const file of seedFiles) {
          const dest = path.join(pres1Dir, file);
          if (!fs.existsSync(dest)) {
            fs.copyFileSync(path.join(seedDir, file), dest);
          }
        }
      }
    } catch (err) {
      console.warn('[PreachingService] Advertencia al verificar medios iniciales:', err.message);
    }
  }

  getAll() {
    this.init();
    return this.repo.getAll();
  }

  getById(id) {
    this.init();
    const preaching = this.repo.getById(id);
    if (!preaching) return null;

    // Agregar URL absoluta del protocolo bible-media:// a cada diapositiva
    const slidesWithUrls = (preaching.slides || []).map(s => {
      const cleanPath = (s.slide_image_path || '').replace(/^\/+/, '');
      return {
        ...s,
        image_url: `bible-media://preachings/${cleanPath}`
      };
    });

    return {
      ...preaching,
      slides: slidesWithUrls
    };
  }

  /**
   * Abre diálogo nativo para seleccionar un archivo PDF, PowerPoint o imágenes
   */
  async selectAndImportPresentation(parentWindow) {
    this.init();
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Importar Presentación de Predicación (PDF, PowerPoint o Imágenes)',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Todos los formatos compatibles (*.pdf, *.pptx, *.ppt, *.png, *.jpg)', extensions: ['pdf', 'pptx', 'ppt', 'png', 'jpg', 'jpeg', 'webp'] },
        { name: 'Documentos PDF (*.pdf)', extensions: ['pdf'] },
        { name: 'Presentaciones PowerPoint (*.pptx, *.ppt)', extensions: ['pptx', 'ppt'] },
        { name: 'Imágenes de diapositivas (*.png, *.jpg, *.jpeg, *.webp)', extensions: ['png', 'jpg', 'jpeg', 'webp'] }
      ]
    });

    if (result.canceled || !result.filePaths.length) return null;

    const filePaths = result.filePaths;
    const firstPath = filePaths[0];
    const ext = path.extname(firstPath).toLowerCase();
    const timestamp = Date.now();
    const folderName = `pres_${timestamp}`;
    const targetFolder = path.join(this.mediaDir, folderName);
    fs.mkdirSync(targetFolder, { recursive: true });

    let fileType = 'pdf';
    let title = path.basename(firstPath, ext);
    let originalFilename = path.basename(firstPath);
    let slidesData = [];

    // Caso A: Se seleccionó una lista de imágenes
    const isImages = filePaths.every(fp => ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(fp).toLowerCase()));
    if (isImages && filePaths.length >= 1) {
      fileType = 'images';
      if (filePaths.length > 1) {
        title = `Presentación (${filePaths.length} diapositivas)`;
        originalFilename = `Lote de ${filePaths.length} imágenes`;
      }
      slidesData = PresentationConverter.importImageFiles(filePaths, targetFolder);
    } else {
      // Caso B: Archivo PDF o PowerPoint
      if (ext === '.pptx' || ext === '.ppt') {
        fileType = 'pptx';
      } else {
        fileType = 'pdf';
      }

      // Guardar copia del archivo original en la carpeta
      const destOriginal = path.join(targetFolder, `original${ext}`);
      fs.copyFileSync(firstPath, destOriginal);

      // Convertir cada diapositiva a PNG y extraer texto
      slidesData = await PresentationConverter.convertToSlides(firstPath, targetFolder);
    }

    // Mapear rutas de imagen con el nombre del directorio relativo
    const formattedSlides = slidesData.map(s => ({
      imagePath: `${folderName}/${s.imagePath}`,
      title: s.title || null,
      text: s.text || null,
      notes: s.notes || null
    }));

    const created = this.repo.create({
      title,
      preacher: 'Pastor / Predicador',
      bible_passage: null,
      original_filename: originalFilename,
      file_type: fileType,
      render_mode: 'original', // Por defecto respetar diseño original del predicador
      slides: formattedSlides
    });

    return this.getById(created.id);
  }

  /**
   * Permite crear una nueva predicación / bosquejo manualmente
   */
  async createManualPreaching({ title, preacher = null, bible_passage = null, slides = [] }) {
    this.init();
    const timestamp = Date.now();
    const folderName = `pres_${timestamp}`;
    const targetFolder = path.join(this.mediaDir, folderName);
    fs.mkdirSync(targetFolder, { recursive: true });

    const formattedSlides = [];

    // Generar diapositivas visuales de alta fidelidad para cada punto
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      const filename = `slide-${String(i + 1).padStart(3, '0')}.png`;
      const fullImagePath = path.join(targetFolder, filename);

      const slideTitle = (s.title || `Punto ${i + 1}`).replace(/"/g, '\\"');
      const slideText = (s.text || '').replace(/"/g, '\\"');
      const slideBible = (s.bible || '').replace(/"/g, '\\"');

      // Crear imagen elegante usando ImageMagick convert
      try {
        const bgColors = [
          ['#0f172a', '#1e3a8a', '#fbbf24'],
          ['#450a0a', '#831843', '#f43f5e'],
          ['#064e3b', '#047857', '#10b981'],
          ['#311042', '#4338ca', '#a855f7'],
          ['#172554', '#1d4ed8', '#60a5fa']
        ];
        const [c1, c2, cAccent] = bgColors[i % bgColors.length];

        const cmd = `convert -size 1920x1080 xc:"${c1}" \
          -fill "${c2}" -draw "circle 960,540 960,1100" \
          -stroke "${cAccent}" -strokewidth 4 -fill none -draw "roundrectangle 80,80 1840,1000 24,24" \
          -stroke none -fill "#ffffff" -pointsize 64 -gravity north -annotate +0+160 "${slideTitle}" \
          -fill "#fef08a" -pointsize 38 -gravity center -annotate +0+20 "${slideText}" \
          -fill "${cAccent}" -pointsize 32 -gravity south -annotate +0+150 "${slideBible}" \
          "${fullImagePath}"`;

        execSync(cmd, { stdio: 'pipe' });
      } catch (err) {
        console.warn('[PreachingService] Error generando imagen para diapositiva manual:', err.message);
      }

      formattedSlides.push({
        imagePath: `${folderName}/${filename}`,
        title: s.title || `Punto ${i + 1}`,
        text: s.text || '',
        notes: `${s.title || ''}\n${s.text || ''}\n${s.bible || ''}`.trim()
      });
    }

    const created = this.repo.create({
      title,
      preacher: preacher || 'Pastor de la Iglesia',
      bible_passage: bible_passage || null,
      original_filename: 'Bosquejo Creado en Sistema',
      file_type: 'images',
      render_mode: 'original',
      slides: formattedSlides
    });

    return this.getById(created.id);
  }

  /**
   * Cambia el modo de renderizado ('original' vs 'church_bg')
   */
  updateRenderMode(id, renderMode) {
    this.init();
    const mode = renderMode === 'church_bg' ? 'church_bg' : 'original';
    this.repo.updateRenderMode(id, mode);

    // Si esta predicación es la activa y se está proyectando, actualizar la pantalla en vivo
    if (this.activePresentationState.preachingId === id) {
      this.projectSlide(id, this.activePresentationState.slideIndex, mode);
    }

    return true;
  }

  /**
   * Proyecta una diapositiva específica y guarda la posición actual
   */
  projectSlide(preachingId, slideIndex, forceRenderMode = null) {
    this.init();
    const preaching = this.repo.getById(preachingId);
    if (!preaching) throw new Error('Presentación no encontrada');

    const slide = preaching.slides[slideIndex];
    if (!slide) throw new Error(`Diapositiva ${slideIndex} no existe`);

    const renderMode = forceRenderMode || preaching.render_mode || 'original';

    // Memorizar estado en el servicio y en SQLite para que el cambio a la Biblia no lo pierda
    this.activePresentationState = { preachingId, slideIndex };
    this.repo.updateLastSlideIndex(preachingId, slideIndex);

    const cleanPath = (slide.slide_image_path || '').replace(/^\/+/, '');
    const slideUrl = `bible-media://preachings/${cleanPath}`;

    // Emitir a la proyección congregacional
    projectionService.project({
      module: 'preaching',
      title: preaching.title,
      preacher: preaching.preacher || '',
      slideTitle: slide.slide_title || slide.title || `Diapositiva ${slideIndex + 1}`,
      text: slide.slide_text || slide.text || slide.notes || `[Diapositiva ${slideIndex + 1}]`,
      reference: preaching.bible_passage || preaching.title,
      slideUrl,
      renderMode, // 'original' (fiel al 100%) o 'church_bg' (con fondo del culto)
      currentSlide: slideIndex + 1,
      totalSlides: preaching.slide_count
    });

    return {
      preachingId,
      slideIndex,
      renderMode,
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
    // Eliminar carpeta de medios asociada si existe
    try {
      const presDir = path.join(this.mediaDir, `pres_${id}`);
      if (fs.existsSync(presDir)) {
        fs.rmSync(presDir, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn('[PreachingService] No se pudo eliminar directorio de medios:', e.message);
    }
    return this.repo.delete(id);
  }
}

module.exports = new PreachingService();
