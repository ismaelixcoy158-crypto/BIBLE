/**
 * BIBLE — ChurchIdentityController
 * Gestión completa y robusta de la identidad congregacional:
 * - Nombre oficial personalizado con guardado automático y tecla Enter.
 * - Logotipo o imagen oficial:
 *   * Explorador local nativo o selector HTML directo.
 *   * Arrastrar y Soltar (Drag & Drop) sobre el recuadro.
 *   * Pegar desde el portapapeles (Ctrl+V).
 *   * Descarga desde enlace web HTTP/HTTPS.
 *   * Emblemas institucionales predeterminados con 1 clic.
 * - Proyección directa en pantalla pública (Atajo F2 / Botón con estado Tally).
 */

const SAMPLE_EMBLEMS = {
  cross: {
    name: 'Cruz Celestial Dorada',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FDE047"/><stop offset="50%" stop-color="#EAB308"/><stop offset="100%" stop-color="#CA8A04"/></linearGradient><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#EAB308" stop-opacity="0.35"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="190" fill="url(#glow)"/><rect x="175" y="50" width="50" height="300" rx="6" fill="url(#gold)"/><rect x="100" y="120" width="200" height="50" rx="6" fill="url(#gold)"/><circle cx="200" cy="145" r="55" fill="none" stroke="url(#gold)" stroke-width="8" opacity="0.6"/></svg>`
  },
  dove: {
    name: 'Paloma de la Paz',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0284C7"/></linearGradient></defs><circle cx="200" cy="200" r="180" fill="none" stroke="url(#sky)" stroke-width="6"/><path d="M120 180 C150 120, 250 110, 280 160 C260 170, 240 185, 230 205 C260 215, 290 235, 300 260 C260 250, 220 240, 190 230 C170 250, 150 280, 130 290 C140 260, 150 230, 150 210 C130 200, 110 190, 120 180 Z" fill="#FFFFFF"/><circle cx="255" cy="155" r="4" fill="#0F172A"/><path d="M275 160 L305 165 L278 172 Z" fill="#F59E0B"/></svg>`
  },
  bible: {
    name: 'Santa Biblia Abierta',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="bGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FCD34D"/><stop offset="100%" stop-color="#D97706"/></linearGradient></defs><circle cx="200" cy="200" r="180" fill="none" stroke="url(#bGold)" stroke-width="6"/><path d="M70 270 Q200 240 200 130 Q200 240 330 270 L320 290 Q200 260 200 160 Q200 260 80 290 Z" fill="#E2E8F0"/><path d="M70 120 Q190 100 200 140 Q210 100 330 120 L330 270 Q200 240 200 150 Q200 240 70 270 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/><line x1="200" y1="140" x2="200" y2="255" stroke="#CBD5E1" stroke-width="4"/><path d="M200 145 Q210 180 200 280" stroke="#DC2626" stroke-width="6" fill="none"/></svg>`
  },
  flame: {
    name: 'Llama de Fuego Santo',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="fire" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#DC2626"/><stop offset="40%" stop-color="#EA580C"/><stop offset="70%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#FEF08A"/></linearGradient></defs><path d="M200 40 C220 120, 310 160, 310 250 C310 320, 260 360, 200 360 C140 360, 90 320, 90 250 C90 190, 130 140, 160 110 C160 140, 180 160, 190 180 C200 150, 190 100, 200 40 Z" fill="url(#fire)"/><path d="M200 180 C210 220, 260 240, 260 280 C260 320, 230 340, 200 340 C170 340, 140 320, 140 280 C140 250, 160 230, 180 210 C180 220, 190 230, 200 240 C200 220, 190 200, 200 180 Z" fill="#FEF08A" opacity="0.9"/></svg>`
  }
};

export class ChurchIdentityController {
  constructor() {
    this.cacheElements();
    this.init();
  }

  cacheElements() {
    // Nombre
    this.nameInput = document.getElementById('churchNameInput');
    this.btnSaveName = document.getElementById('btnSaveChurchName');
    this.txtBtnSaveName = document.getElementById('txtBtnSaveName');

    // Logo
    this.fileLogoDirect = document.getElementById('fileLogoDirect');
    this.logoPreviewBox = document.getElementById('logoPreviewBox');
    this.logoPreviewImg = document.getElementById('logoPreviewImg');
    this.logoPlaceholder = document.getElementById('logoPlaceholder');
    this.logoSourceBadge = document.getElementById('logoSourceBadge');
    this.btnSelectLocal = document.getElementById('btnSelectLocalLogo');
    this.btnPasteClipboard = document.getElementById('btnPasteClipboardLogo');
    this.urlInput = document.getElementById('logoUrlInput');
    this.btnDownloadUrl = document.getElementById('btnDownloadUrlLogo');
    this.btnDeleteLogo = document.getElementById('btnDeleteLogo');
    this.btnTestProject = document.getElementById('btnTestProjectLogo');
    this.txtBtnProjectLogo = document.getElementById('txtBtnProjectLogo');

    // Restablecer & Alertas
    this.btnResetIdentity = document.getElementById('btnResetIdentity');
    this.alertBox = document.getElementById('identityAlert');

    // Emblemas
    this.sampleEmblemBtns = document.querySelectorAll('.btn-sample-emblem');

    // Temas y Apariencia
    this.themeCards = document.querySelectorAll('.theme-card');
    this.btnResetTheme = document.getElementById('btnResetDefaultTheme');

    // Términos y Proyecto Ixcoydev
    this.btnOpenTermsModal = document.getElementById('btnOpenTermsModal');
  }

  async init() {
    this.bindEvents();
    this.updateActiveThemeCard();
    window.addEventListener('app-theme-changed', (e) => {
      this.updateActiveThemeCard(e.detail?.theme);
    });
    await this.loadCurrentIdentity();
    await this.syncProjectionState();

    // Escuchar actualizaciones de emisión en tiempo real
    if (window.bibleAPI?.projection?.onPreviewUpdate) {
      window.bibleAPI.projection.onPreviewUpdate((state) => {
        this.updateProjectButtonState(state);
      });
    }
  }

  showAlert(message, type = 'success') {
    if (!this.alertBox) return;
    this.alertBox.className = `identity-alert ${type}`;
    this.alertBox.textContent = message;
    this.alertBox.style.display = 'block';

    if (this._alertTimeout) clearTimeout(this._alertTimeout);
    this._alertTimeout = setTimeout(() => {
      this.alertBox.style.display = 'none';
      this.alertBox.className = 'identity-alert';
    }, 4500);
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

  async syncProjectionState() {
    try {
      if (window.bibleAPI?.projection?.getState) {
        const state = await window.bibleAPI.projection.getState();
        this.updateProjectButtonState(state);
      }
    } catch (e) {
      console.warn('[ChurchIdentity] No se pudo sincronizar estado de proyección:', e);
    }
  }

  updateProjectButtonState(state) {
    if (!this.btnTestProject) return;
    const isLogoActive = Boolean(state?.isLogo && !state?.isBlackout);

    if (isLogoActive) {
      this.btnTestProject.classList.remove('btn-primary');
      this.btnTestProject.classList.add('btn-danger');
      if (this.txtBtnProjectLogo) {
        this.txtBtnProjectLogo.textContent = 'Dejar de Proyectar Logo (F2)';
      }
    } else {
      this.btnTestProject.classList.remove('btn-danger');
      this.btnTestProject.classList.add('btn-primary');
      if (this.txtBtnProjectLogo) {
        this.txtBtnProjectLogo.textContent = 'Proyectar Logo en Pantalla (F2)';
      }
    }
  }

  renderIdentity(identity) {
    if (!identity) return;

    if (this.nameInput && document.activeElement !== this.nameInput) {
      this.nameInput.value = identity.name || '';
    }

    // Actualizar nombre en el encabezado general del sistema
    const shellChurchNameTag = document.getElementById('shellChurchNameTag');
    if (shellChurchNameTag) {
      if (identity.name && identity.name !== 'Mi Iglesia') {
        shellChurchNameTag.textContent = identity.name;
        shellChurchNameTag.title = identity.name;
      } else {
        shellChurchNameTag.textContent = 'CHURCH MEDIA SYSTEM';
      }
    }

    if (identity.logoUrl) {
      if (this.logoPreviewImg) {
        this.logoPreviewImg.src = identity.logoUrl;
        this.logoPreviewImg.style.display = 'block';
      }
      if (this.logoPlaceholder) this.logoPlaceholder.style.display = 'none';
      if (this.logoPreviewBox) this.logoPreviewBox.classList.add('has-logo');
      if (this.btnDeleteLogo) this.btnDeleteLogo.style.display = 'inline-flex';

      const originLabel = identity.logoSourceType === 'url' ? 'Descarga web' : 'Archivo local';
      if (this.logoSourceBadge) {
        this.logoSourceBadge.textContent = `Logotipo activo (${originLabel})`;
        this.logoSourceBadge.style.color = 'var(--status-live)';
      }
    } else {
      if (this.logoPreviewImg) {
        this.logoPreviewImg.style.display = 'none';
        this.logoPreviewImg.src = '';
      }
      if (this.logoPlaceholder) this.logoPlaceholder.style.display = 'flex';
      if (this.logoPreviewBox) this.logoPreviewBox.classList.remove('has-logo');
      if (this.btnDeleteLogo) this.btnDeleteLogo.style.display = 'none';

      if (this.logoSourceBadge) {
        this.logoSourceBadge.textContent = 'Sin logotipo cargado';
        this.logoSourceBadge.style.color = 'var(--text-muted)';
      }
    }
  }

  async saveName() {
    const newName = this.nameInput?.value.trim();
    if (!newName) {
      this.showAlert('El nombre de la congregación no puede estar vacío', 'error');
      return;
    }
    try {
      if (this.txtBtnSaveName) this.txtBtnSaveName.textContent = 'Guardando...';
      const updated = await window.bibleAPI.church.updateName(newName);
      this.renderIdentity(updated);
      this.showAlert('¡Nombre de la congregación guardado con éxito!');
    } catch (err) {
      this.showAlert(err.message, 'error');
    } finally {
      if (this.txtBtnSaveName) this.txtBtnSaveName.textContent = 'Guardar Nombre';
    }
  }

  async uploadFileDirect(file) {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.name.match(/\.(png|jpe?g|webp|svg|gif)$/i)) {
      this.showAlert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, SVG, GIF)', 'error');
      return;
    }

    try {
      this.showAlert('Procesando imagen...', 'success');
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          const updated = await window.bibleAPI.church.uploadLogoBase64({
            base64Data,
            filename: file.name
          });
          this.renderIdentity(updated);
          this.showAlert('¡Logotipo importado y guardado correctamente!');
        } catch (err) {
          this.showAlert(err.message, 'error');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      this.showAlert(err.message, 'error');
    }
  }

  async applySampleEmblem(emblemKey) {
    if (emblemKey === 'bible_official') {
      try {
        this.showAlert('Aplicando logotipo oficial de BIBLE...', 'success');
        const resp = await fetch('../../shared/assets/bible-logo.png');
        const blob = await resp.blob();
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const base64Data = e.target.result;
            const updated = await window.bibleAPI.church.uploadLogoBase64({
              base64Data,
              filename: 'bible_official_logo.png'
            });
            this.renderIdentity(updated);
            this.showAlert('¡Logotipo oficial de BIBLE asignado con éxito!');
          } catch (err) {
            this.showAlert(err.message, 'error');
          }
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        this.showAlert('Error al cargar logotipo de BIBLE: ' + err.message, 'error');
      }
      return;
    }

    const emblem = SAMPLE_EMBLEMS[emblemKey];
    if (!emblem) return;

    try {
      this.showAlert(`Aplicando emblema: ${emblem.name}...`, 'success');
      const base64Data = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(emblem.svg)));
      const updated = await window.bibleAPI.church.uploadLogoBase64({
        base64Data,
        filename: `${emblemKey}_emblem.svg`
      });
      this.renderIdentity(updated);
      this.showAlert(`¡Emblema "${emblem.name}" asignado con éxito!`);
    } catch (err) {
      this.showAlert(err.message, 'error');
    }
  }

  bindEvents() {
    // 1. Guardar Nombre (Botón + Tecla Enter + Auto-guardado en Blur)
    this.btnSaveName?.addEventListener('click', () => this.saveName());

    this.nameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.saveName();
      }
    });

    this.nameInput?.addEventListener('change', () => this.saveName());

    // 2. Selección de Archivo Local
    this.btnSelectLocal?.addEventListener('click', async () => {
      try {
        const updated = await window.bibleAPI.church.selectLocalLogo();
        if (updated) {
          this.renderIdentity(updated);
          this.showAlert('Logotipo local importado y guardado correctamente');
        }
      } catch (err) {
        // Si el diálogo nativo falla, abrir fallback input file
        this.fileLogoDirect?.click();
      }
    });

    // Clic en la caja de previsualización abre el selector
    this.logoPreviewBox?.addEventListener('click', (e) => {
      if (e.target !== this.logoPreviewImg) {
        this.btnSelectLocal?.click();
      }
    });

    // Input file HTML directo
    this.fileLogoDirect?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        this.uploadFileDirect(file);
      }
    });

    // 3. Arrastrar y Soltar (Drag & Drop) sobre la caja de previsualización
    if (this.logoPreviewBox) {
      ['dragenter', 'dragover'].forEach(eventName => {
        this.logoPreviewBox.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.logoPreviewBox.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        this.logoPreviewBox.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.logoPreviewBox.classList.remove('dragover');
        });
      });

      this.logoPreviewBox.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt?.files?.[0];
        if (file) {
          this.uploadFileDirect(file);
        }
      });
    }

    // 4. Pegar imagen desde el portapapeles (Ctrl+V)
    const handlePaste = (e) => {
      // Si el foco está en un input de texto para escribir URL o nombre, no interceptar
      if (document.activeElement === this.nameInput || document.activeElement === this.urlInput) {
        return;
      }
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            this.uploadFileDirect(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);

    this.btnPasteClipboard?.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.read) {
          const clipboardItems = await navigator.clipboard.read();
          for (const item of clipboardItems) {
            const imageType = item.types.find(t => t.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const file = new File([blob], 'clipboard_logo.png', { type: imageType });
              this.uploadFileDirect(file);
              return;
            }
          }
        }
        this.showAlert('Presiona Ctrl+V con una imagen copiada en tu portapapeles', 'success');
      } catch (err) {
        this.showAlert('Usa Ctrl+V directamente en esta ventana para pegar la imagen copiada', 'success');
      }
    });

    // 5. Descargar desde URL
    this.btnDownloadUrl?.addEventListener('click', async () => {
      const url = this.urlInput?.value.trim();
      if (!url) {
        this.showAlert('Por favor introduce una dirección URL válida', 'error');
        return;
      }
      try {
        this.showAlert('Descargando imagen...', 'success');
        const updated = await window.bibleAPI.church.downloadLogoUrl(url);
        if (this.urlInput) this.urlInput.value = '';
        this.renderIdentity(updated);
        this.showAlert('¡Logotipo descargado y guardado localmente con éxito!');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    this.urlInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.btnDownloadUrl?.click();
      }
    });

    // 6. Emblemas Predeterminados Rápidos
    this.sampleEmblemBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        const emblemKey = btn.dataset.emblem;
        if (emblemKey) {
          this.applySampleEmblem(emblemKey);
        }
      });
    });

    // 7. Eliminar solo logo
    this.btnDeleteLogo?.addEventListener('click', async () => {
      if (!confirm('¿Deseas quitar el logotipo actual?')) return;
      try {
        const updated = await window.bibleAPI.church.deleteLogo();
        this.renderIdentity(updated);
        this.showAlert('Logotipo eliminado correctamente');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // 8. Restablecer toda la identidad
    this.btnResetIdentity?.addEventListener('click', async () => {
      if (!confirm('¿Estás seguro de restablecer el nombre y quitar el logo a los valores por defecto?')) return;
      try {
        const updated = await window.bibleAPI.church.reset();
        this.renderIdentity(updated);
        this.showAlert('Identidad restablecida a los valores iniciales ("Mi Iglesia")');
      } catch (err) {
        this.showAlert(err.message, 'error');
      }
    });

    // 10. Selección Interactiva de Temas Dinámicos
    this.themeCards?.forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.dataset.themeId;
        if (themeId && window.setAppTheme) {
          window.setAppTheme(themeId, true);
          this.updateActiveThemeCard(themeId);
          const name = card.querySelector('.theme-name')?.textContent || themeId;
          this.showAlert(`Tema «${name}» aplicado correctamente.`);
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // 11. Restablecer Tema Predeterminado
    this.btnResetTheme?.addEventListener('click', () => {
      if (window.setAppTheme) {
        window.setAppTheme('warm-cream', true);
        this.updateActiveThemeCard('warm-cream');
        this.showAlert('Tema predeterminado «Warm Cream» restaurado con éxito.');
      }
    });

    // 12. Modal de Términos, Reglas y Proyecto Ixcoydev
    this.btnOpenTermsModal?.addEventListener('click', () => {
      if (typeof window.openTermsModal === 'function') {
        window.openTermsModal(true);
      }
    });
  }

  updateActiveThemeCard(themeId) {
    const activeId = themeId || window.getCurrentAppTheme?.() || 'warm-cream';
    this.themeCards?.forEach(card => {
      if (card.dataset.themeId === activeId) {
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
      } else {
        card.classList.remove('active');
        card.removeAttribute('aria-selected');
      }
    });
  }
}
