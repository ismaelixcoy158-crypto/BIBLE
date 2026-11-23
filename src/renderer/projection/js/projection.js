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
  const spotYoutube = document.getElementById('spotYoutube');
  const spotImage = document.getElementById('spotImage');
  const slideLayer = document.getElementById('slideLayer');
  const slideImg = document.getElementById('slideImg');
  const bgAmbientLayer = document.getElementById('bgAmbientLayer');
  const bgVideoLayer = document.getElementById('bgVideoLayer');
  const bgScrim = document.getElementById('bgScrim');
  const rouletteLayer = document.getElementById('rouletteLayer');
  const projRouletteTitle = document.getElementById('projRouletteTitle');
  const projectionRouletteCanvas = document.getElementById('projectionRouletteCanvas');
  const projWinnerBanner = document.getElementById('projWinnerBanner');
  const projWinnerLabel = document.getElementById('projWinnerLabel');
  const projConfettiCanvas = document.getElementById('projConfettiCanvas');

  // Helper para enviar comandos a reproductor de YouTube incrustado (IFrame API)
  function sendYoutubeCommand(command, args = []) {
    if (spotYoutube && spotYoutube.contentWindow) {
      try {
        spotYoutube.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: command,
          args: args
        }), '*');
      } catch (err) {
        console.warn('[YouTube Proyección] Error enviando comando:', err);
      }
    }
  }

  // Motor de Ruleta en Pantalla de Proyección
  let projWheelRotation = 0;
  let projSpinAnimId = null;
  let confettiAnimationId = null;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTickSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (_) { }
  }

  function playFanfareSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + (idx * 0.12);
        const duration = (idx === notes.length - 1) ? 0.9 : 0.22;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (_) { }
  }

  function startConfetti() {
    stopConfetti();
    if (!projConfettiCanvas) return;
    const ctx = projConfettiCanvas.getContext('2d');
    const width = projConfettiCanvas.width = window.innerWidth;
    const height = projConfettiCanvas.height = window.innerHeight;
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FCD34D'];
    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 8 + 4,
        d: Math.random() * 50 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
      });
    }

    let frame = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - (frame / 3)) * 15;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });
      frame++;
      if (frame < 220) {
        confettiAnimationId = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    confettiAnimationId = requestAnimationFrame(renderConfetti);
  }

  function stopConfetti() {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    if (projConfettiCanvas) {
      const ctx = projConfettiCanvas.getContext('2d');
      ctx.clearRect(0, 0, projConfettiCanvas.width, projConfettiCanvas.height);
    }
  }

  function drawProjectionWheel(items, rotation) {
    if (!projectionRouletteCanvas) return;
    const ctx = projectionRouletteCanvas.getContext('2d');
    const width = projectionRouletteCanvas.width;
    const height = projectionRouletteCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 25;

    ctx.clearRect(0, 0, width, height);

    if (!items || !items.length) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.stroke();
      return;
    }

    const numSlices = items.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < numSlices; i++) {
      const angle = i * sliceAngle;
      const item = items[i];

      // Sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color || '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Texto de la rebanada
      ctx.save();
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 6;

      let displayLabel = item.label || '';
      if (displayLabel.length > 18) displayLabel = displayLabel.slice(0, 16) + '...';

      ctx.fillText(displayLabel, radius - 30, 10);
      ctx.restore();
    }

    ctx.restore();

    // Borde exterior metálico
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  function animateProjectionSpin(items, winningIndex, durationMs = 5000, winnerLabel = '') {
    if (projSpinAnimId) cancelAnimationFrame(projSpinAnimId);
    stopConfetti();
    if (projWinnerBanner) projWinnerBanner.style.display = 'none';

    const numSlices = items.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const fullSpins = 6;
    const targetSectorCenter = winningIndex * sliceAngle + sliceAngle / 2;
    const targetAngle = (Math.PI * 1.5) - targetSectorCenter + (fullSpins * Math.PI * 2);

    const startRotation = projWheelRotation % (Math.PI * 2);
    const totalRotationToCover = targetAngle - startRotation;
    const startTime = performance.now();
    let lastTickSector = -1;

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      projWheelRotation = startRotation + totalRotationToCover * easeOut;

      const currentAngleUnderPointer = (Math.PI * 1.5 - (projWheelRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const currentSector = Math.floor(currentAngleUnderPointer / sliceAngle);
      if (currentSector !== lastTickSector) {
        lastTickSector = currentSector;
        playTickSound();
      }

      drawProjectionWheel(items, projWheelRotation);

      if (progress < 1) {
        projSpinAnimId = requestAnimationFrame(tick);
      } else {
        projWheelRotation = projWheelRotation % (Math.PI * 2);
        drawProjectionWheel(items, projWheelRotation);
        projSpinAnimId = null;

        // Celebrar ganador
        if (projWinnerBanner) {
          projWinnerBanner.style.display = 'flex';
          if (projWinnerLabel) {
            projWinnerLabel.textContent = winnerLabel || items[winningIndex]?.label || '¡Ganador!';
          }
        }
        playFanfareSound();
        startConfetti();
      }
    };

    projSpinAnimId = requestAnimationFrame(tick);
  }

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
          churchLogoImg.src = '../shared/assets/bible-logo.png';
          churchLogoImg.style.display = 'block';
        }

        if (state.churchIdentity.name) {
          churchNameTitle.textContent = state.churchIdentity.name;
          churchNameTitle.style.display = 'block';
        } else {
          churchNameTitle.style.display = 'none';
        }
      } else {
        churchLogoImg.src = '../shared/assets/bible-logo.png';
        churchLogoImg.style.display = 'block';
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
      // Manejo específico del módulo de Spots Multimedia (Videos e Imágenes)
      if (state.activeContent.module === 'spots') {
        contentLayer.style.display = 'none';
        if (slideLayer) slideLayer.style.display = 'none';
        if (bgScrim) bgScrim.style.opacity = '0';
        mediaSpotLayer.style.display = 'flex';

        if (state.activeContent.isYoutube) {
          spotVideo.pause();
          spotVideo.removeAttribute('src');
          spotVideo.style.display = 'none';
          spotImage.style.display = 'none';
          if (spotYoutube) {
            spotYoutube.style.display = 'block';
            const targetUrl = state.activeContent.mediaUrl;
            if (spotYoutube.src !== targetUrl) {
              spotYoutube.src = targetUrl;
            }
          }
        } else if (state.activeContent.fileType === 'video') {
          if (spotYoutube) {
            spotYoutube.src = 'about:blank';
            spotYoutube.style.display = 'none';
          }
          spotImage.style.display = 'none';
          spotVideo.style.display = 'block';

          const targetUrl = state.activeContent.mediaUrl;
          if (spotVideo.src !== targetUrl) {
            spotVideo.src = targetUrl;
            spotVideo.currentTime = state.activeContent.currentTime || 0;
          }
          spotVideo.loop = Boolean(state.activeContent.loop);
          spotVideo.volume = state.activeContent.volume !== undefined ? state.activeContent.volume : 1.0;
          spotVideo.muted = false;

          spotVideo.play().catch(e => {
            console.warn('[Video Proyección] Intento autoplay con audio falló, reintentando:', e);
            spotVideo.muted = true;
            spotVideo.play().catch(err => console.error('[Video Proyección] Play bloqueado:', err));
          });
        } else {
          spotVideo.pause();
          spotVideo.removeAttribute('src');
          spotVideo.style.display = 'none';
          if (spotYoutube) {
            spotYoutube.src = 'about:blank';
            spotYoutube.style.display = 'none';
          }
          spotImage.style.display = 'block';
          spotImage.src = state.activeContent.mediaUrl;
        }
        return;
      }

      // Detener y ocultar video si cambiamos a otro módulo
      spotVideo.pause();
      spotVideo.removeAttribute('src');
      spotVideo.load();
      if (spotYoutube) {
        spotYoutube.src = 'about:blank';
        spotYoutube.style.display = 'none';
      }
      mediaSpotLayer.style.display = 'none';

      // Manejo específico del módulo de Ruleta Dinámica
      if (state.activeContent.module === 'roulette') {
        contentLayer.style.display = 'none';
        if (slideLayer) slideLayer.style.display = 'none';
        if (bgScrim) bgScrim.style.opacity = '0.3';
        if (rouletteLayer) rouletteLayer.style.display = 'flex';

        if (projRouletteTitle) {
          projRouletteTitle.textContent = state.activeContent.title || 'Ruleta Dinámica';
        }

        const items = state.activeContent.items || [];
        const isSpinning = Boolean(state.activeContent.isSpinning);

        if (isSpinning) {
          animateProjectionSpin(
            items,
            state.activeContent.winningIndex !== undefined ? state.activeContent.winningIndex : 0,
            state.activeContent.durationMs || 5000,
            state.activeContent.winnerLabel || ''
          );
        } else {
          if (projSpinAnimId) cancelAnimationFrame(projSpinAnimId);
          projSpinAnimId = null;

          if (state.activeContent.winnerLabel) {
            if (projWinnerBanner) projWinnerBanner.style.display = 'flex';
            if (projWinnerLabel) projWinnerLabel.textContent = state.activeContent.winnerLabel;
            drawProjectionWheel(items, projWheelRotation);
          } else {
            if (projWinnerBanner) projWinnerBanner.style.display = 'none';
            stopConfetti();
            drawProjectionWheel(items, projWheelRotation);
          }
        }
        return;
      }

      // Si no es ruleta, ocultar capa de ruleta y cancelar efectos
      if (rouletteLayer) rouletteLayer.style.display = 'none';
      if (projSpinAnimId) cancelAnimationFrame(projSpinAnimId);
      stopConfetti();

      // Manejo del módulo de Predicaciones: Modo Original vs Fondo del Culto
      if (state.activeContent.module === 'preaching') {
        const renderMode = state.activeContent.renderMode || 'original';
        const slideUrl = state.activeContent.slideUrl;

        if (renderMode === 'original' && slideUrl) {
          // MODO MANTENER ORIGINAL: Proyecta la diapositiva literal del predicador al 100%
          contentLayer.style.display = 'none';
          if (slideLayer) {
            slideLayer.style.display = 'flex';
            if (slideImg && slideImg.src !== slideUrl) {
              slideImg.src = slideUrl;
            }
          }
          if (bgScrim) bgScrim.style.opacity = '0';
          return;
        } else {
          // MODO FONDO DEL CULTO: Oculta la imagen fija y proyecta el texto/bosquejo con el fondo del culto
          if (slideLayer) slideLayer.style.display = 'none';
          if (bgScrim) bgScrim.style.opacity = '1';
          contentLayer.style.display = 'flex';
        }
      } else {
        if (slideLayer) slideLayer.style.display = 'none';
        if (bgScrim) bgScrim.style.opacity = '1';
        contentLayer.style.display = 'flex';
      }

      const { text, reference, refPosition = 'bottom', background, customStyles } = state.activeContent;

      // Texto principal
      mainText.textContent = text || '';

      // Tamaño de letra dinámico (porcentaje 60% - 220%)
      const activeFontSize = state.activeContent.fontSize !== undefined
        ? state.activeContent.fontSize
        : (state.currentFontSize || 100);

      if (state.activeContent.module === 'countdown') {
        contentLayer.classList.add('module-countdown');
        const isFinished = Boolean(state.activeContent.countdown?.isFinished);
        if (isFinished) {
          contentLayer.classList.add('finished');
          mainText.style.fontSize = `calc(clamp(2.2rem, 5vw, 4.5rem) * ${activeFontSize / 100})`;
        } else {
          contentLayer.classList.remove('finished');
          mainText.style.fontSize = `calc(clamp(3.8rem, 9.5vw, 7.8rem) * ${activeFontSize / 100})`;
        }
      } else {
        contentLayer.classList.remove('module-countdown', 'finished');
        mainText.style.fontSize = `calc(clamp(2.2rem, 5vw, 4.5rem) * ${activeFontSize / 100})`;
      }

      // Tipo de letra / Tipografía
      const activeFontFamily = state.activeContent.fontFamily || state.currentFontFamily || 'sans-serif';
      const fontFamilies = {
        'sans-serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        'serif': 'Georgia, "Times New Roman", Cambria, Garamond, serif',
        'bold': 'Montserrat, "Arial Black", Gadget, Impact, sans-serif',
        'condensed': '"Arial Narrow", "Franklin Gothic Medium", Impact, sans-serif'
      };
      const chosenFont = fontFamilies[activeFontFamily] || fontFamilies['sans-serif'];
      mainText.style.fontFamily = chosenFont;
      if (refTop) refTop.style.fontFamily = chosenFont;
      if (refBottom) refBottom.style.fontFamily = chosenFont;

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

      // Fondo dinámico (Video en bucle, Imagen local/HTTP, o Degradado)
      if (background) {
        let bgType = 'image';
        let bgUrl = '';
        let bgGradient = '';
        let bgOpacity = 0.45;
        let bgFit = 'cover';
        let bgScale = 100;
        let bgPosition = 'center';

        if (typeof background === 'object') {
          bgType = background.type || (background.url && background.url.match(/\.(mp4|webm)($|\?)/i) ? 'video' : 'image');
          bgUrl = background.url || '';
          bgGradient = background.value || background.gradient || '';
          if (background.opacity !== undefined) bgOpacity = background.opacity;
          if (background.fit) bgFit = background.fit;
          if (background.scale !== undefined) bgScale = background.scale;
          if (background.position) bgPosition = background.position;
        } else if (typeof background === 'string') {
          if (background.startsWith('linear-gradient') || background.startsWith('radial-gradient')) {
            bgType = 'gradient';
            bgGradient = background;
          } else if (background.startsWith('#') || background.startsWith('rgb')) {
            bgType = 'color';
            bgGradient = background;
          } else if (background.match(/\.(mp4|webm)($|\?)/i)) {
            bgType = 'video';
            bgUrl = background;
          } else {
            bgType = 'image';
            bgUrl = background;
          }
        }

        const isDarkText = Boolean(
          (customStyles && (customStyles.color === '#000000' || customStyles.color === 'black' || customStyles.theme === 'dark')) ||
          (state.activeContent.textColor === 'black')
        );

        if (bgScrim) {
          // Si el texto es negro (fondo claro), usamos un velo blanco suave o sutil para no oscurecer la imagen
          if (isDarkText) {
            bgScrim.style.background = `rgba(255, 255, 255, ${bgOpacity * 0.5})`;
          } else if (bgType === 'gradient' || (!bgUrl && bgGradient)) {
            // Los degradados de estudio están completamente calibrados: cero oscurecimiento adicional para que los colores sean puros sin cortes oscuros
            bgScrim.style.background = 'transparent';
          } else {
            bgScrim.style.background = `rgba(0, 0, 0, ${bgOpacity})`;
          }
        }

        const scaleTransform = `scale(${bgScale / 100})`;
        const positionCss = bgPosition === 'top' ? 'center top' : (bgPosition === 'bottom' ? 'center bottom' : 'center center');

        // Manejo de fondo difuminado ambiental (para imágenes o videos verticales)
        if (bgFit === 'ambient' && bgAmbientLayer) {
          bgAmbientLayer.style.display = 'block';
          if (bgType === 'image' && bgUrl) {
            bgAmbientLayer.style.backgroundImage = `url("${bgUrl}")`;
          } else {
            bgAmbientLayer.style.display = 'none';
          }
        } else if (bgAmbientLayer) {
          bgAmbientLayer.style.display = 'none';
        }

        if (bgType === 'video' && bgUrl) {
          bgLayer.style.display = 'none';
          if (bgVideoLayer) {
            bgVideoLayer.style.display = 'block';
            bgVideoLayer.style.objectFit = (bgFit === 'ambient' ? 'contain' : bgFit);
            bgVideoLayer.style.objectPosition = positionCss;
            bgVideoLayer.style.transform = scaleTransform;
            if (bgVideoLayer.src !== bgUrl) {
              bgVideoLayer.src = bgUrl;
              bgVideoLayer.load();
            }
            bgVideoLayer.play().catch(e => console.warn('[BgVideo] Autoplay error:', e));
          }
        } else {
          if (bgVideoLayer) {
            bgVideoLayer.pause();
            bgVideoLayer.style.display = 'none';
          }
          bgLayer.style.display = 'block';
          bgLayer.style.transform = scaleTransform;
          bgLayer.style.backgroundPosition = positionCss;
          if (bgFit === 'fill') {
            bgLayer.style.backgroundSize = '100% 100%';
          } else if (bgFit === 'ambient') {
            bgLayer.style.backgroundSize = 'contain';
          } else {
            bgLayer.style.backgroundSize = bgFit; // 'cover' o 'contain'
          }

          if (bgType === 'image' && bgUrl) {
            bgLayer.style.backgroundImage = `url("${bgUrl}")`;
            bgLayer.style.backgroundColor = '#000000';
          } else if (bgGradient) {
            if (bgGradient.startsWith('#') || bgGradient.startsWith('rgb')) {
              bgLayer.style.backgroundImage = 'none';
              bgLayer.style.backgroundColor = bgGradient;
            } else {
              bgLayer.style.backgroundImage = bgGradient;
              bgLayer.style.backgroundColor = '#000000';
            }
          }
        }
      } else {
        if (bgAmbientLayer) bgAmbientLayer.style.display = 'none';
        if (bgVideoLayer) {
          bgVideoLayer.pause();
          bgVideoLayer.style.display = 'none';
        }
        bgLayer.style.display = 'block';
        bgLayer.style.backgroundImage = 'linear-gradient(145deg, #0a2e5c 0%, #124e8c 35%, #1a6cb8 65%, #0e3b6e 100%)';
        bgLayer.style.backgroundColor = '#0a2e5c';
        bgLayer.style.transform = 'scale(1)';
        if (bgScrim) bgScrim.style.background = 'transparent';
      }

      // 5. Modo de Color de Texto (Blanco para fondos oscuros, Negro para fondos claros)
      const isDarkText = Boolean(
        (customStyles && (customStyles.color === '#000000' || customStyles.color === 'black' || customStyles.theme === 'dark')) ||
        (state.activeContent.textColor === 'black')
      );

      if (isDarkText) {
        contentLayer.classList.add('dark-text');
        mainText.style.color = '#0F172A';
        refTop.style.color = '#1E40AF';
        refBottom.style.color = '#1E40AF';
      } else {
        contentLayer.classList.remove('dark-text');
        mainText.style.color = '#FFFFFF';
        refTop.style.color = '#38BDF8';
        refBottom.style.color = '#38BDF8';
      }

      // Estilos tipográficos adicionales
      if (customStyles) {
        if (customStyles.fontSize) mainText.style.fontSize = customStyles.fontSize;
        if (customStyles.fontFamily) mainText.style.fontFamily = customStyles.fontFamily;
      }
    }
  }

  // Eventos de control de reproducción y sincronización de video de Spots
  if (spotVideo) {
    spotVideo.addEventListener('timeupdate', () => {
      if (window.bibleAPI?.spots?.sendTimeUpdate) {
        window.bibleAPI.spots.sendTimeUpdate({
          currentTime: spotVideo.currentTime || 0,
          duration: spotVideo.duration || 0,
          paused: spotVideo.paused,
          ended: spotVideo.ended
        });
      }
    });

    spotVideo.addEventListener('ended', () => {
      if (window.bibleAPI?.spots?.sendTimeUpdate) {
        window.bibleAPI.spots.sendTimeUpdate({
          currentTime: spotVideo.duration || 0,
          duration: spotVideo.duration || 0,
          paused: true,
          ended: true
        });
      }
    });
  }

  // Escuchar comandos de transporte de video (Play, Pause, Seek, Volume, Loop, Stop)
  if (window.bibleAPI?.projection?.onMediaCommand) {
    window.bibleAPI.projection.onMediaCommand((cmd) => {
      if (!cmd) return;
      switch (cmd.action) {
        case 'play':
          if (spotVideo) spotVideo.play().catch(console.warn);
          sendYoutubeCommand('playVideo');
          break;
        case 'pause':
          if (spotVideo) spotVideo.pause();
          sendYoutubeCommand('pauseVideo');
          break;
        case 'seek':
          if (typeof cmd.time === 'number' && !isNaN(cmd.time)) {
            if (spotVideo) spotVideo.currentTime = cmd.time;
            sendYoutubeCommand('seekTo', [cmd.time, true]);
          }
          break;
        case 'volume':
          if (typeof cmd.volume === 'number') {
            if (spotVideo) spotVideo.volume = Math.max(0, Math.min(1, cmd.volume));
            sendYoutubeCommand('setVolume', [Math.round(cmd.volume * 100)]);
          }
          if (typeof cmd.muted === 'boolean') {
            if (spotVideo) spotVideo.muted = cmd.muted;
            sendYoutubeCommand(cmd.muted ? 'mute' : 'unMute');
          }
          break;
        case 'loop':
          if (spotVideo) spotVideo.loop = Boolean(cmd.loop);
          break;
        case 'stop':
          if (spotVideo) {
            spotVideo.pause();
            spotVideo.currentTime = 0;
          }
          sendYoutubeCommand('stopVideo');
          if (spotYoutube) {
            spotYoutube.src = 'about:blank';
            spotYoutube.style.display = 'none';
          }
          if (mediaSpotLayer) mediaSpotLayer.style.display = 'none';
          break;
      }
    });
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
