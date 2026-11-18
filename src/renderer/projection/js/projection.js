/**
 * BIBLE — Projection Renderer Script
 * Gestiona el renderizado de la ventana pública recibido por eventos IPC.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const bgLayer = document.getElementById('bgLayer');
  const contentLayer = document.getElementById('contentLayer');
  const refTop = document.getElementById('refTop');
  const mainText = document.getElementById('mainText');
  const refBottom = document.getElementById('refBottom');
  const logoLayer = document.getElementById('logoLayer');
  const churchLogoImg = document.getElementById('churchLogoImg');
  const churchNameTitle = document.getElementById('churchNameTitle');
  const blackoutLayer = document.getElementById('blackoutLayer');
  const mediaSpotLayer = document.getElementById('mediaSpotLayer');
  const spotVideo = document.getElementById('spotVideo');
  const spotImage = document.getElementById('spotImage');

  /**
   * Actualiza el DOM congregacional a partir del estado emitido
   */
  function renderState(state) {
    if (!state) return;

    // 1. Manejo de Pantalla a Negro (Blackout)
    if (state.isBlackout) {
      blackoutLayer.classList.add('active');
    } else {
      blackoutLayer.classList.remove('active');
    }

    // 2. Manejo de Logotipo Institucional
    if (state.isLogo) {
      logoLayer.classList.add('active');
      if (state.churchIdentity) {
        if (state.churchIdentity.logoUrl) {
          churchLogoImg.src = state.churchIdentity.logoUrl;
          churchLogoImg.style.display = 'block';
        } else {
          churchLogoImg.style.display = 'none';
        }

        if (state.churchIdentity.name) {
          churchNameTitle.textContent = state.churchIdentity.name;
          churchNameTitle.style.display = 'block';
        } else {
          churchNameTitle.style.display = 'none';
        }
      }
    } else {
      logoLayer.classList.remove('active');
    }

    // 3. Manejo de Borrar Texto (Clear Text)
    if (state.isClearText) {
      contentLayer.classList.add('hidden-text');
    } else {
      contentLayer.classList.remove('hidden-text');
    }

    // 4. Renderizado del contenido activo
    if (state.activeContent) {
      // Manejo específico del módulo de Spots Multimedia
      if (state.activeContent.module === 'spots') {
        contentLayer.style.display = 'none';
        mediaSpotLayer.style.display = 'flex';

        if (state.activeContent.fileType === 'video') {
          spotImage.style.display = 'none';
          spotVideo.style.display = 'block';
          spotVideo.src = state.activeContent.mediaUrl;
          spotVideo.loop = Boolean(state.activeContent.loop);
          spotVideo.play().catch(e => console.warn('[Video] Autoplay error:', e));
        } else {
          spotVideo.pause();
          spotVideo.style.display = 'none';
          spotImage.style.display = 'block';
          spotImage.src = state.activeContent.mediaUrl;
        }
        return;
      }

      // Detener y ocultar video si cambiamos a otro módulo
      spotVideo.pause();
      spotVideo.removeAttribute('src');
      spotVideo.load();
      mediaSpotLayer.style.display = 'none';
      contentLayer.style.display = 'flex';

      const { text, reference, refPosition = 'bottom', background, customStyles } = state.activeContent;

      // Texto principal
      mainText.textContent = text || '';

      // Referencia bíblica / autor
      if (reference) {
        if (refPosition === 'top') {
          refTop.textContent = reference;
          refTop.style.display = 'block';
          refBottom.style.display = 'none';
        } else {
          refBottom.textContent = reference;
          refBottom.style.display = 'block';
          refTop.style.display = 'none';
        }
      } else {
        refTop.style.display = 'none';
        refBottom.style.display = 'none';
      }

      // Fondo personalizado o predeterminado
      if (background) {
        if (background.startsWith('bible-media://') || background.startsWith('data:')) {
          bgLayer.style.backgroundImage = `url("${background}")`;
        } else {
          // Fondo predeterminado o color
          bgLayer.style.backgroundImage = `linear-gradient(135deg, #111827 0%, #1F2937 100%)`;
        }
      }

      // Estilos tipográficos personalizados si vienen en el payload
      if (customStyles) {
        if (customStyles.fontSize) mainText.style.fontSize = customStyles.fontSize;
        if (customStyles.fontFamily) mainText.style.fontFamily = customStyles.fontFamily;
        if (customStyles.color) mainText.style.color = customStyles.color;
      }
    }
  }

  // Suscribirse a eventos de actualización emitidos por el Main Process
  if (window.bibleAPI && window.bibleAPI.projection) {
    window.bibleAPI.projection.onStateUpdate((state) => {
      renderState(state);
    });

    // Cargar estado inicial
    try {
      const initialState = await window.bibleAPI.projection.getState();
      renderState(initialState);
    } catch (err) {
      console.error('[ProjectionView] Error al cargar estado inicial:', err);
    }
  }
});
