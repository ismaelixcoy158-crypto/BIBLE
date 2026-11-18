/**
 * BIBLE — Controlador del Módulo de Identidad de la Iglesia
 */
export class ChurchIdentityController {
  constructor() {
    this.nameInput = document.getElementById('churchNameInput');
    this.btnSaveName = document.getElementById('btnSaveChurchName');
    this.btnSelectLocal = document.getElementById('btnSelectLocalLogo');
    this.urlInput = document.getElementById('logoUrlInput');
    this.btnDownloadUrl = document.getElementById('btnDownloadUrlLogo');
    this.btnDeleteLogo = document.getElementById('btnDeleteLogo');
    this.btnResetIdentity = document.getElementById('btnResetIdentity');
    this.btnTestProject = document.getElementById('btnTestProjectLogo');

    this.logoPreviewBox = document.getElementById('logoPreviewBox');
    this.logoPreviewImg = document.getElementById('logoPreviewImg');
    this.logoPlaceholder = document.getElementById('logoPlaceholder');
    this.logoSourceBadge = document.getElementById('logoSourceBadge');
    this.alertBox = document.getElementById('identityAlert');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadCurrentIdentity();
  }

  showAlert(message, type = 'success') {
    this.alertBox.className = `identity-alert ${type}`;
    this.alertBox.textContent = message;
    setTimeout(() => {
      this.alertBox.style.display = 'none';
      this.alertBox.className = 'identity-alert';
    }, 4000);
  }

  async loadCurrentIdentity() {
    try {
      const identity = await window.bibleAPI.church.getIdentity();
      this.renderIdentity(identity);
    } catch (err) {
      console.error('[ChurchIdentity] Error al cargar identidad:', err);
      this.showAlert('Error al cargar la identidad de la iglesia', 'error');
    }
  }

  renderIdentity(identity) {
    if (!identity) return;

    this.nameInput.value = identity.name || '';

    if (identity.logoUrl) {
      this.logoPreviewImg.src = identity.logoUrl;
      this.logoPreviewImg.style.display = 'block';
      this.logoPlaceholder.style.display = 'none';
      this.logoPreviewBox.classList.add('has-logo');
      this.btnDeleteLogo.style.display = 'inline-flex';

      const originLabel = identity.logoSourceType === 'url' ? 'Descarga web' : 'Archivo local';
      this.logoSourceBadge.textContent = `Logotipo activo (${originLabel})`;
      this.logoSourceBadge.style.color = 'var(--status-live)';
    } else {
      this.logoPreviewImg.style.display = 'none';
      this.logoPlaceholder.style.display = 'flex';
      this.logoPreviewBox.classList.remove('has-logo');
      this.btnDeleteLogo.style.display = 'none';

      this.logoSourceBadge.textContent = 'Sin logotipo cargado';
      this.logoSourceBadge.style.color = 'var(--text-muted)';
    }
  }

  bindEvents() {
    // Guardar nombre
    this.btnSaveName.addEventListener('click', async () => {
      const newName = this.nameInput.value.trim();
      if (!newName) {
        this.showAlert('El nombre de la congregación no puede estar vacío', 'error');
        return;
      }
      try {
        const updated = await window.bibleAPI.church.updateName(newName);
        this.renderIdentity(updated);
        this.showAlert('Nombre de la congregación guardado correctamente');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // Cargar archivo local
    this.btnSelectLocal.addEventListener('click', async () => {
      try {
        const updated = await window.bibleAPI.church.selectLocalLogo();
        if (updated) {
          this.renderIdentity(updated);
          this.showAlert('Logotipo local importado y guardado correctamente');
        }
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // Descargar desde URL
    this.btnDownloadUrl.addEventListener('click', async () => {
      const url = this.urlInput.value.trim();
      if (!url) {
        this.showAlert('Por favor introduce una dirección URL válida', 'error');
        return;
      }
      try {
        this.showAlert('Descargando imagen...', 'success');
        const updated = await window.bibleAPI.church.downloadLogoUrl(url);
        this.urlInput.value = '';
        this.renderIdentity(updated);
        this.showAlert('Logotipo descargado y guardado localmente con éxito');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // Eliminar solo logo
    this.btnDeleteLogo.addEventListener('click', async () => {
      if (!confirm('¿Deseas eliminar el logotipo actual?')) return;
      try {
        const updated = await window.bibleAPI.church.deleteLogo();
        this.renderIdentity(updated);
        this.showAlert('Logotipo eliminado');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // Restablecer todo
    this.btnResetIdentity.addEventListener('click', async () => {
      if (!confirm('¿Estás seguro de restablecer toda la identidad de la iglesia?')) return;
      try {
        const updated = await window.bibleAPI.church.reset();
        this.renderIdentity(updated);
        this.showAlert('Identidad restablecida a valores iniciales');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // Proyectar logo en pantalla
    this.btnTestProject.addEventListener('click', async () => {
      await window.bibleAPI.projection.toggleLogo(true);
      this.showAlert('Proyectando logotipo en la pantalla pública');
    });
  }
}
