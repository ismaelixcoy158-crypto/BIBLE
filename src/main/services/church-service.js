const path = require('path');
const fs = require('fs');
const { dialog, app } = require('electron');
const ChurchRepository = require('../../database/repositories/church.repository.js');
const dbManager = require('../../database/database.js');

class ChurchService {
  constructor() {
    this.repo = null;
    this.brandingDir = null;
  }

  init() {
    if (!this.repo) {
      const db = dbManager.getInstance();
      this.repo = new ChurchRepository(db);

      const userData = app.getPath('userData');
      this.brandingDir = path.join(userData, 'media', 'branding');
      if (!fs.existsSync(this.brandingDir)) {
        fs.mkdirSync(this.brandingDir, { recursive: true });
      }
    }
  }

  /**
   * Obtiene la identidad formateada con URL de protocolo seguro
   */
  getIdentity() {
    this.init();
    const identity = this.repo.get();
    let logoUrl = null;

    if (identity.logo_filename) {
      const fullPath = path.join(this.brandingDir, identity.logo_filename);
      if (fs.existsSync(fullPath)) {
        logoUrl = `bible-media://branding/${identity.logo_filename}`;
      }
    }

    return {
      name: identity.name,
      logoFilename: identity.logo_filename,
      logoSourceType: identity.logo_source_type,
      logoUrl,
      updatedAt: identity.updated_at
    };
  }

  /**
   * Actualiza el nombre de la iglesia
   */
  updateName(name) {
    this.init();
    this.repo.updateName(name);
    return this.getIdentity();
  }

  /**
   * Abre el explorador nativo para seleccionar y copiar un logo local
   */
  async selectLocalLogo(parentWindow) {
    this.init();
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Seleccionar Logotipo de la Iglesia',
      properties: ['openFile'],
      filters: [
        { name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg'] }
      ]
    });

    if (result.canceled || !result.filePaths.length) {
      return null;
    }

    const sourcePath = result.filePaths[0];
    const stats = fs.statSync(sourcePath);

    // Límite de 10 MB
    if (stats.size > 10 * 1024 * 1024) {
      throw new Error('El archivo seleccionado excede el límite máximo de 10 MB');
    }

    // Eliminar logo anterior si existe
    this.cleanCurrentLogoFile();

    const ext = path.extname(sourcePath).toLowerCase();
    const targetFilename = `logo_${Date.now()}${ext}`;
    const targetPath = path.join(this.brandingDir, targetFilename);

    fs.copyFileSync(sourcePath, targetPath);
    this.repo.updateLogo(targetFilename, 'local');

    return this.getIdentity();
  }

  /**
   * Descarga un logotipo desde una URL HTTP/HTTPS y lo almacena localmente
   */
  async downloadLogoUrl(imageUrl) {
    this.init();
    const parsed = new URL(imageUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Solo se permiten enlaces web HTTP o HTTPS');
    }

    // Descarga segura con fetch nativo de Node 20
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'BIBLE-ChurchMediaSystem/1.0' }
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(`Error al descargar la imagen (Código HTTP: ${response.status})`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error('La dirección URL proporcionada no corresponde a una imagen válida');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > 10 * 1024 * 1024) {
      throw new Error('La imagen descargada supera el límite máximo de 10 MB');
    }

    // Determinar extensión
    let ext = '.png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
    else if (contentType.includes('webp')) ext = '.webp';
    else if (contentType.includes('svg')) ext = '.svg';

    this.cleanCurrentLogoFile();

    const targetFilename = `logo_url_${Date.now()}${ext}`;
    const targetPath = path.join(this.brandingDir, targetFilename);

    fs.writeFileSync(targetPath, buffer);
    this.repo.updateLogo(targetFilename, 'url');

    return this.getIdentity();
  }

  /**
   * Elimina el archivo del logo y su registro
   */
  deleteLogo() {
    this.init();
    this.cleanCurrentLogoFile();
    this.repo.deleteLogo();
    return this.getIdentity();
  }

  /**
   * Restablece la identidad a los valores de fábrica
   */
  reset() {
    this.init();
    this.cleanCurrentLogoFile();
    this.repo.reset();
    return this.getIdentity();
  }

  cleanCurrentLogoFile() {
    const current = this.repo.get();
    if (current && current.logo_filename) {
      const filePath = path.join(this.brandingDir, current.logo_filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('[ChurchService] No se pudo eliminar el logo anterior:', e);
        }
      }
    }
  }
}

module.exports = new ChurchService();
