const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * BIBLE — PresentationConverter
 * Conversor de presentaciones PDF, PowerPoint (PPTX/PPT) e imágenes.
 * Extrae cada diapositiva en imágenes PNG de alta resolución (1080p/150dpi)
 * preservando 100% de la fidelidad visual, tipografías, colores, fotos y fondos.
 */
class PresentationConverter {
  /**
   * Convierte un archivo PDF o PowerPoint a un conjunto de imágenes PNG y notas de texto
   * @param {string} sourceFilePath Ruta física del archivo de origen
   * @param {string} targetDir Directorio de destino para las imágenes extraídas
   * @returns {Promise<Array<{ slideIndex: number, imagePath: string, title: string, text: string, notes: string }>>}
   */
  static async convertToSlides(sourceFilePath, targetDir) {
    if (!fs.existsSync(sourceFilePath)) {
      throw new Error(`Archivo no encontrado: ${sourceFilePath}`);
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(sourceFilePath).toLowerCase();
    let workingPdfPath = sourceFilePath;
    const tempDir = path.join(targetDir, '_temp_conversion');

    try {
      // 1. Si es archivo de PowerPoint (PPTX o PPT), convertir primero a PDF mediante LibreOffice headless
      if (ext === '.pptx' || ext === '.ppt') {
        fs.mkdirSync(tempDir, { recursive: true });
        const profileDir = path.join(tempDir, 'lo_profile');
        fs.mkdirSync(profileDir, { recursive: true });

        const libreCmd = `libreoffice -env:UserInstallation=file://${profileDir} --headless --convert-to pdf "${sourceFilePath}" --outdir "${tempDir}"`;
        execSync(libreCmd, { stdio: 'pipe', timeout: 45000 });

        const baseName = path.basename(sourceFilePath, ext);
        const convertedPdf = path.join(tempDir, `${baseName}.pdf`);

        if (!fs.existsSync(convertedPdf)) {
          throw new Error('LibreOffice no pudo generar el archivo PDF de la presentación');
        }
        workingPdfPath = convertedPdf;
      }

      // 2. Extraer diapositivas desde el PDF como imágenes PNG con pdftoppm
      const slidePrefix = path.join(targetDir, 'slide');
      const pdftoppmCmd = `pdftoppm -png -r 150 "${workingPdfPath}" "${slidePrefix}"`;
      execSync(pdftoppmCmd, { stdio: 'pipe', timeout: 60000 });

      // Listar y ordenar las imágenes de diapositivas generadas
      const slideFiles = fs.readdirSync(targetDir)
        .filter(f => f.startsWith('slide-') && f.endsWith('.png'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('slide-', '').replace('.png', ''), 10) || 0;
          const numB = parseInt(b.replace('slide-', '').replace('.png', ''), 10) || 0;
          return numA - numB;
        });

      if (!slideFiles.length) {
        throw new Error('No se pudieron extraer diapositivas de la presentación.');
      }

      // 3. Extraer texto de cada página para notas y modo "Fondo del Culto"
      const slides = [];
      slideFiles.forEach((file, index) => {
        const pageNum = index + 1;
        let pageText = '';
        try {
          const textBuf = execSync(`pdftotext "${workingPdfPath}" -f ${pageNum} -l ${pageNum} -`, { timeout: 8000 });
          pageText = textBuf.toString('utf-8').trim();
        } catch {
          pageText = '';
        }

        const lines = pageText.split('\n').map(l => l.trim()).filter(Boolean);
        const slideTitle = lines[0] || `Diapositiva ${pageNum}`;
        const slideBody = lines.slice(1).join('\n') || pageText;

        slides.push({
          slideIndex: index,
          imagePath: file, // Relativo dentro de la carpeta de la presentación
          slide_image_path: file,
          title: slideTitle,
          slide_title: slideTitle,
          text: slideBody,
          slide_text: slideBody,
          notes: pageText || `Diapositiva ${pageNum}`
        });
      });

      return slides;
    } finally {
      // Limpiar directorio temporal si se usó
      if (fs.existsSync(tempDir)) {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch {}
      }
    }
  }

  /**
   * Importa un conjunto de imágenes existentes como diapositivas
   */
  static importImageFiles(filePaths, targetDir) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const validExts = ['.png', '.jpg', '.jpeg', '.webp'];
    const filteredPaths = filePaths.filter(fp => validExts.includes(path.extname(fp).toLowerCase()));

    // Ordenar naturalmente por nombre
    filteredPaths.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    const slides = [];
    filteredPaths.forEach((srcPath, index) => {
      const ext = path.extname(srcPath).toLowerCase();
      const filename = `slide-${String(index + 1).padStart(3, '0')}${ext}`;
      const destPath = path.join(targetDir, filename);
      fs.copyFileSync(srcPath, destPath);

      const title = path.basename(srcPath, ext);

      slides.push({
        slideIndex: index,
        imagePath: filename,
        slide_image_path: filename,
        title,
        slide_title: title,
        text: '',
        slide_text: '',
        notes: `Diapositiva ${index + 1}: ${title}`
      });
    });

    return slides;
  }
}

module.exports = PresentationConverter;

