const fs = require('fs');
const path = require('path');

const pahoPath = path.join(__dirname, '../src/renderer/shared/js/paho-mqtt.min.js');
let pahoCode = '';
if (fs.existsSync(pahoPath)) {
  pahoCode = fs.readFileSync(pahoPath, 'utf8');
} else {
  console.warn('Paho MQTT not found at', pahoPath);
}

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#0f172a">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/png" href="icon.png">
  <link rel="apple-touch-icon" href="icon.png">
  <title>BIBLE — Control Remoto Universal</title>
  <style>
    :root {
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --bg-card-hover: #334155;
      --border-color: rgba(255, 255, 255, 0.1);
      --accent-blue: #38bdf8;
      --accent-blue-hover: #0ea5e9;
      --accent-green: #22c55e;
      --accent-red: #ef4444;
      --accent-amber: #f59e0b;
      --accent-purple: #a855f7;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      padding-top: var(--safe-top);
      padding-bottom: var(--safe-bottom);
    }

    /* Vistas principales */
    .view-screen {
      display: none;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
    }
    .view-screen.active {
      display: flex;
    }

    /* ============================================================
       PANTALLA DE AUTENTICACIÓN (PIN & SALA)
       ============================================================ */
    #pinScreen {
      align-items: center;
      justify-content: center;
      padding: 24px;
      min-height: 100vh;
    }

    .pin-auth-card {
      width: 100%;
      max-width: 380px;
      background: var(--bg-card);
      border-radius: 24px;
      padding: 30px 24px;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
      border: 1px solid var(--border-color);
      text-align: center;
    }

    .pin-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%);
      color: #fff;
      margin-bottom: 14px;
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.4);
    }

    .pin-logo svg {
      width: 34px;
      height: 34px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }

    .room-tag-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 9999px;
      color: var(--accent-blue);
      font-size: 0.84rem;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .pin-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 4px;
    }

    .pin-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 22px;
      line-height: 1.4;
    }

    .pin-display {
      display: flex;
      justify-content: center;
      gap: 14px;
      margin-bottom: 20px;
    }

    .pin-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid var(--border-color);
      background: transparent;
      transition: all 0.15s ease;
    }

    .pin-dot.filled {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.7);
      transform: scale(1.1);
    }

    .pin-error-msg {
      font-size: 0.84rem;
      color: var(--accent-red);
      min-height: 22px;
      margin-bottom: 14px;
      opacity: 0;
      transition: opacity 0.2s ease;
      font-weight: 600;
    }
    .pin-error-msg.visible {
      opacity: 1;
    }

    .pin-keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 6px;
    }

    .pin-key {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      color: var(--text-main);
      font-size: 1.5rem;
      font-weight: 700;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.1s ease;
    }
    .pin-key:active {
      background: var(--accent-blue);
      color: #0f172a;
      transform: scale(0.93);
    }
    .pin-key.key-action {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .room-switch-link {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.78rem;
      cursor: pointer;
      text-decoration: underline;
      margin-top: 16px;
      display: inline-block;
    }

    /* ============================================================
       CABECERA Y CONTROL PRINCIPAL
       ============================================================ */
    .app-header {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent-green);
      box-shadow: 0 0 8px var(--accent-green);
      animation: pulseGreen 2s infinite;
    }

    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.15); }
    }

    .header-title-wrap {
      display: flex;
      flex-direction: column;
    }

    .header-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-room-badge {
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent-blue);
      border: 1px solid rgba(56, 189, 248, 0.3);
      letter-spacing: 0.5px;
    }

    .header-subtitle {
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-icon-subtle {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .btn-icon-subtle:active {
      background: rgba(255, 255, 255, 0.15);
      color: var(--text-main);
    }

    /* Pestañas de modo */
    .mode-tabs {
      display: flex;
      background: var(--bg-dark);
      padding: 8px 12px;
      gap: 8px;
      border-bottom: 1px solid var(--border-color);
    }

    .mode-tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .mode-tab-btn.active {
      background: var(--bg-card);
      color: var(--accent-blue);
      border-color: rgba(56, 189, 248, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Contenedores de pestañas */
    .tab-content {
      display: none;
      flex-direction: column;
      flex: 1;
      padding: 16px;
      gap: 16px;
    }
    .tab-content.active {
      display: flex;
    }

    /* ============================================================
       MODO PREDICADOR (PÚLPITO CLICKER)
       ============================================================ */
    .live-slide-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    }

    .live-slide-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--accent-green);
    }

    .slide-counter {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .live-slide-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.35;
    }

    .live-slide-snippet {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.5;
      max-height: 140px;
      overflow-y: auto;
    }

    /* BOTONES GIGANTES DE PÚLPITO CLICKER */
    .pulpit-clicker-grid {
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: 12px;
      margin-top: 4px;
    }

    .btn-pulpit {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.12s ease;
      touch-action: manipulation;
    }

    .btn-pulpit-prev {
      background: #1e293b;
      color: var(--text-main);
      min-height: 105px;
    }
    .btn-pulpit-prev:active {
      background: #334155;
      transform: scale(0.95);
    }

    .btn-pulpit-next {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      min-height: 105px;
      border-color: rgba(56, 189, 248, 0.4);
      box-shadow: 0 10px 24px rgba(2, 132, 199, 0.45);
    }
    .btn-pulpit-next:active {
      background: #0284c7;
      transform: scale(0.95);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }

    .pulpit-icon {
      width: 32px;
      height: 32px;
      stroke-width: 2.5;
      fill: none;
      stroke: currentColor;
    }

    .pulpit-label {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .pulpit-hint {
      font-size: 0.72rem;
      opacity: 0.8;
      font-weight: 500;
    }

    /* CRONOMETRO DE SERMÓN */
    .sermon-timer-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 18px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .timer-display-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .timer-clock {
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--accent-blue);
      letter-spacing: 1px;
    }
    .timer-clock.warning {
      color: var(--accent-amber);
    }
    .timer-clock.danger {
      color: var(--accent-red);
      animation: pulseRed 1.5s infinite;
    }

    @keyframes pulseRed {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .timer-label {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .timer-controls {
      display: flex;
      gap: 8px;
    }

    .btn-timer {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: var(--text-main);
      padding: 8px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-timer:active {
      background: rgba(255, 255, 255, 0.18);
    }

    /* Barra de Pánico Rápida en Púlpito */
    .pulpit-panic-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 4px;
    }

    .btn-panic-pulpit {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      color: var(--text-muted);
      padding: 10px 4px;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .btn-panic-pulpit:active {
      background: var(--bg-card-hover);
      color: var(--text-main);
    }
    .btn-panic-pulpit.active-state {
      background: rgba(239, 68, 68, 0.2);
      border-color: var(--accent-red);
      color: var(--accent-red);
    }

    /* ============================================================
       MODO MULTIMEDIA (PANIC & CONTROLS)
       ============================================================ */
    .multimedia-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .btn-media-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      min-height: 95px;
      transition: all 0.1s ease;
    }
    .btn-media-card:active {
      transform: scale(0.96);
    }

    .btn-media-card.panic-blackout.active-blackout {
      background: #000000;
      border-color: #ef4444;
      color: #ef4444;
      box-shadow: 0 0 16px rgba(239, 68, 68, 0.4);
    }

    .btn-media-card.panic-logo.active-logo {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }

    .btn-media-card.panic-clear.active-clear {
      background: rgba(245, 158, 11, 0.15);
      border-color: var(--accent-amber);
      color: var(--accent-amber);
    }

    .btn-media-card.panic-freeze.active-freeze {
      background: rgba(168, 85, 247, 0.15);
      border-color: var(--accent-purple);
      color: var(--accent-purple);
    }

    .media-card-icon {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }

    .media-card-title {
      font-size: 0.88rem;
      font-weight: 700;
    }

    .media-card-sub {
      font-size: 0.68rem;
      color: var(--text-muted);
    }

    .multimedia-nav-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 8px;
    }

    .btn-nav-large {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--text-main);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-nav-large:active {
      background: var(--bg-card-hover);
    }
  </style>
</head>
<body>

  <!-- ============================================================
       PANTALLA DE ACCESO (PIN DE SEGURIDAD & SALA VINCULADA)
       ============================================================ -->
  <div id="pinScreen" class="view-screen active">
    <div class="pin-auth-card">
      <div class="pin-logo">
        <svg viewBox="0 0 24 24">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
          <path d="m9 7 3-3 3 3"/>
          <path d="m9 11 3 3 3-3"/>
        </svg>
      </div>

      <div class="room-tag-pill" id="pinRoomTag" style="display:none;">
        <svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
        <span id="pinRoomLabel">SALA: BIB-7842</span>
      </div>

      <div id="pinConnectionBadge" class="pin-status-pill" style="display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:var(--accent-amber); background:rgba(245, 158, 11, 0.15); border:1px solid rgba(245, 158, 11, 0.35); padding:4px 12px; border-radius:9999px; margin-bottom:12px; transition: all 0.3s ease;">
        <span id="pinStatusDot" style="width:7px; height:7px; border-radius:50%; background:currentColor; display:inline-block;"></span>
        <span id="pinConnectionLabel">Conectando a la laptop...</span>
      </div>

      <h1 class="pin-title">BIBLE Control</h1>
      <p class="pin-subtitle" id="pinSubtitle">Ingresa el código que muestra tu laptop:</p>

      <!-- Entrada unificada: BIB - [ • • • • ] -->
      <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:20px;">
        <span style="font-size:1.6rem; font-weight:900; color:var(--accent-blue); letter-spacing:1px;">BIB -</span>
        <div class="pin-display" style="margin-bottom:0;">
          <div class="pin-dot" id="dot0"></div>
          <div class="pin-dot" id="dot1"></div>
          <div class="pin-dot" id="dot2"></div>
          <div class="pin-dot" id="dot3"></div>
        </div>
      </div>

      <div class="pin-error-msg" id="pinErrorMsg">PIN incorrecto. Intenta de nuevo.</div>

      <div class="pin-keypad">
        <button class="pin-key" data-num="1">1</button>
        <button class="pin-key" data-num="2">2</button>
        <button class="pin-key" data-num="3">3</button>
        <button class="pin-key" data-num="4">4</button>
        <button class="pin-key" data-num="5">5</button>
        <button class="pin-key" data-num="6">6</button>
        <button class="pin-key" data-num="7">7</button>
        <button class="pin-key" data-num="8">8</button>
        <button class="pin-key" data-num="9">9</button>
        <button class="pin-key key-action" id="btnPinClear">C</button>
        <button class="pin-key" data-num="0">0</button>
        <button class="pin-key key-action" id="btnPinDelete">⌫</button>
      </div>

      <div>
        <button id="btnChangeRoom" class="room-switch-link" type="button">Cambiar Código de Sala</button>
      </div>
    </div>
  </div>

  <!-- ============================================================
       PANTALLA PRINCIPAL DEL CONTROL REMOTO
       ============================================================ -->
  <div id="mainScreen" class="view-screen">
    <!-- Header de conexión y estado -->
    <header class="app-header">
      <div class="header-brand">
        <div class="header-status-dot"></div>
        <div class="header-title-wrap">
          <div class="header-title">
            <span>BIBLE Control</span>
            <span class="header-room-badge" id="headerRoomBadge">BIB-7842</span>
          </div>
          <span id="connectionStateLabel" class="header-subtitle">En Línea (Cloud WSS)</span>
        </div>
      </div>
      <div class="header-actions">
        <button id="btnLogout" class="btn-icon-subtle" title="Cerrar Sesión / Cambiar PIN">
          <svg style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Selector de Modo -->
    <div class="mode-tabs">
      <button class="mode-tab-btn active" data-tab="pulpit">
        <span>🎙️</span>
        <span>Modo Predicador</span>
      </button>
      <button class="mode-tab-btn" data-tab="multimedia">
        <span>🎛️</span>
        <span>Modo Multimedia</span>
      </button>
    </div>

    <!-- PESTAÑA 1: MODO PREDICADOR / PÚLPITO -->
    <div id="tabPulpit" class="tab-content active">
      <!-- Tarjeta de Diapositiva Actual en Vivo -->
      <div class="live-slide-card">
        <div class="live-slide-header">
          <span id="pulpitLiveBadge" class="live-badge">● EN PANTALLA</span>
          <span id="pulpitSlideCounter" class="slide-counter">Diapositiva -- / --</span>
        </div>
        <div id="pulpitSlideTitle" class="live-slide-title">Sin emisión activa</div>
        <div id="pulpitSlideSnippet" class="live-slide-snippet">El contenido proyectado aparecerá reflejado aquí en tiempo real.</div>
      </div>

      <!-- BOTONES GIGANTES DE PULPITO CLICKER -->
      <div class="pulpit-clicker-grid">
        <button id="btnPulpitPrev" class="btn-pulpit btn-pulpit-prev">
          <svg class="pulpit-icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          <span class="pulpit-label">ANTERIOR</span>
          <span class="pulpit-hint">Atrás</span>
        </button>

        <button id="btnPulpitNext" class="btn-pulpit btn-pulpit-next">
          <svg class="pulpit-icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="pulpit-label">SIGUIENTE</span>
          <span class="pulpit-hint">Avanzar</span>
        </button>
      </div>

      <!-- CRONOMETRO DE PREDICACIÓN -->
      <div class="sermon-timer-card">
        <div class="timer-display-group">
          <div class="timer-clock" id="sermonTimerDisplay">00:00</div>
          <div>
            <div class="timer-label">Cronómetro Sermón</div>
            <div id="timerStatusLabel" style="font-size:0.68rem; color:var(--text-dim)">Pausado</div>
          </div>
        </div>
        <div class="timer-controls">
          <button id="btnTimerToggle" class="btn-timer">Iniciar</button>
          <button id="btnTimerReset" class="btn-timer">Reiniciar</button>
        </div>
      </div>

      <!-- BOTONES DE PÁNICO RÁPIDOS EN PÚLPITO -->
      <div class="pulpit-panic-bar">
        <button id="pulpitPanicBlackout" class="btn-panic-pulpit">
          <span>⬛</span>
          <span>Negro</span>
        </button>
        <button id="pulpitPanicLogo" class="btn-panic-pulpit">
          <span>🏛️</span>
          <span>Logo</span>
        </button>
        <button id="pulpitPanicClear" class="btn-panic-pulpit">
          <span>✨</span>
          <span>Limpiar</span>
        </button>
        <button id="pulpitPanicFreeze" class="btn-panic-pulpit">
          <span>❄️</span>
          <span>Congelar</span>
        </button>
      </div>
    </div>

    <!-- PESTAÑA 2: MODO MULTIMEDIA -->
    <div id="tabMultimedia" class="tab-content">
      <!-- Tarjeta de Monitoreo -->
      <div class="live-slide-card" style="padding:14px;">
        <div class="live-slide-header">
          <span id="mediaLiveMode" class="live-badge">Modo Normal</span>
          <span id="systemIpLabel" class="slide-counter">Cloud WSS</span>
        </div>
        <div id="mediaLiveTitle" class="live-slide-title" style="font-size:1rem;">Sin Emisión Activa</div>
        <div id="mediaLiveSnippet" class="live-slide-snippet" style="font-size:0.85rem; max-height:80px;">Selecciona contenido en la consola.</div>
      </div>

      <!-- Cuadrícula de Botones de Pánico -->
      <div class="multimedia-grid">
        <button id="panicBlackout" class="btn-media-card panic-blackout">
          <svg class="media-card-icon" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
          <span class="media-card-title">Pantalla Negra</span>
          <span class="media-card-sub">F1 — Ocultar todo</span>
        </button>

        <button id="panicLogo" class="btn-media-card panic-logo">
          <svg class="media-card-icon" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span class="media-card-title">Logo Iglesia</span>
          <span class="media-card-sub">F2 — Mostrar escudo</span>
        </button>

        <button id="panicClear" class="btn-media-card panic-clear">
          <svg class="media-card-icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          <span class="media-card-title">Limpiar Letras</span>
          <span class="media-card-sub">F3 — Dejar solo fondo</span>
        </button>

        <button id="panicFreeze" class="btn-media-card panic-freeze">
          <svg class="media-card-icon" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span class="media-card-title">Congelar Pantalla</span>
          <span class="media-card-sub">F4 — Pausar proyector</span>
        </button>
      </div>

      <!-- Fila de Navegación -->
      <div class="multimedia-nav-row">
        <button id="btnMediaPrev" class="btn-nav-large">
          <svg style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          <span>Anterior</span>
        </button>
        <button id="btnMediaNext" class="btn-nav-large" style="background:var(--accent-blue); color:#0f172a;">
          <span>Siguiente</span>
          <svg style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Paho MQTT Library Bundle -->
  <script>
${pahoCode}
  </script>

  <!-- Lógica Central del Control Móvil Universal -->
  <script>
    (function() {
      // 1. Detección de Código de Sala y PIN sincronizados
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get('pin') || urlParams.get('p') || '';
      let currentRoomId = urlParams.get('room') || urlParams.get('r') || (window.location.hash ? window.location.hash.replace('#', '') : '') || localStorage.getItem('bible_remote_room') || '';
      currentRoomId = currentRoomId.trim().toUpperCase();

      // Si viene PIN en la URL (al escanear QR de la laptop), auto-sincronizar sala y PIN
      if (urlPin && /^\d{4}$/.test(urlPin)) {
        if (!currentRoomId || !currentRoomId.endsWith(urlPin)) {
          currentRoomId = 'BIB-' + urlPin;
        }
      }
      if (currentRoomId) {
        localStorage.setItem('bible_remote_room', currentRoomId);
      }

      // Elementos de Sala en DOM
      const pinRoomLabel = document.getElementById('pinRoomLabel');
      const headerRoomBadge = document.getElementById('headerRoomBadge');
      if (pinRoomLabel && currentRoomId) pinRoomLabel.textContent = 'SALA: ' + currentRoomId;
      if (headerRoomBadge && currentRoomId) headerRoomBadge.textContent = currentRoomId;

      // 2. Estado de conexión
      const localIpDirect = urlParams.get('ip') || '';
      const isLocalHost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || /^192\\.168\\./.test(window.location.hostname);
      const API_BASE = isLocalHost ? (window.location.origin.startsWith('http') ? '' : 'http://127.0.0.1:4545') : (localIpDirect ? ('http://' + localIpDirect + ':4545') : '');
      let savedPin = localStorage.getItem('bible_remote_pin') || '';
      let enteredPin = '';
      let pollTimer = null;
      let sermonSeconds = 0;
      let sermonRunning = false;
      let sermonInterval = null;
      let authTimeoutTimer = null;

      // Brokers MQTT en la nube (EMQX prioritario por alta estabilidad WSS)
      const BROKERS = [
        { name: 'EMQX', host: 'broker.emqx.io', port: 8084, path: '/mqtt' },
        { name: 'HiveMQ', host: 'broker.hivemq.com', port: 8884, path: '/mqtt' }
      ];
      let activeBrokerIdx = 0;
      let mqttClient = null;
      let isMqttConnected = false;

      // Elementos DOM
      const pinScreen = document.getElementById('pinScreen');
      const mainScreen = document.getElementById('mainScreen');
      const pinDots = [
        document.getElementById('dot0'),
        document.getElementById('dot1'),
        document.getElementById('dot2'),
        document.getElementById('dot3')
      ];
      const pinErrorMsg = document.getElementById('pinErrorMsg');
      const btnLogout = document.getElementById('btnLogout');
      const btnChangeRoom = document.getElementById('btnChangeRoom');
      const connectionStateLabel = document.getElementById('connectionStateLabel');

      // Pestañas
      const modeTabs = document.querySelectorAll('.mode-tab-btn');
      const tabPulpit = document.getElementById('tabPulpit');
      const tabMultimedia = document.getElementById('tabMultimedia');

      // Pulpit
      const pulpitLiveBadge = document.getElementById('pulpitLiveBadge');
      const pulpitSlideCounter = document.getElementById('pulpitSlideCounter');
      const pulpitSlideTitle = document.getElementById('pulpitSlideTitle');
      const pulpitSlideSnippet = document.getElementById('pulpitSlideSnippet');
      const btnPulpitNext = document.getElementById('btnPulpitNext');
      const btnPulpitPrev = document.getElementById('btnPulpitPrev');

      // Cronómetro
      const sermonTimerDisplay = document.getElementById('sermonTimerDisplay');
      const timerStatusLabel = document.getElementById('timerStatusLabel');
      const btnTimerToggle = document.getElementById('btnTimerToggle');
      const btnTimerReset = document.getElementById('btnTimerReset');

      // Multimedia
      const panicBlackout = document.getElementById('panicBlackout');
      const panicLogo = document.getElementById('panicLogo');
      const panicClear = document.getElementById('panicClear');
      const panicFreeze = document.getElementById('panicFreeze');
      const pulpitPanicBlackout = document.getElementById('pulpitPanicBlackout');
      const pulpitPanicLogo = document.getElementById('pulpitPanicLogo');
      const pulpitPanicClear = document.getElementById('pulpitPanicClear');
      const pulpitPanicFreeze = document.getElementById('pulpitPanicFreeze');
      const btnMediaPrev = document.getElementById('btnMediaPrev');
      const btnMediaNext = document.getElementById('btnMediaNext');
      const mediaLiveTitle = document.getElementById('mediaLiveTitle');
      const mediaLiveSnippet = document.getElementById('mediaLiveSnippet');
      const mediaLiveMode = document.getElementById('mediaLiveMode');
      const systemIpLabel = document.getElementById('systemIpLabel');

      // Retroalimentación Háptica
      function hapticVibrate(duration = 40) {
        if (window.navigator && window.navigator.vibrate) {
          try { window.navigator.vibrate(duration); } catch (e) {}
        }
      }

      // ---------------- MQTT CLOUD RELAY ----------------
      function updatePinConnectionStatus(online, text) {
        const badge = document.getElementById('pinConnectionBadge');
        const dot = document.getElementById('pinStatusDot');
        const label = document.getElementById('pinConnectionLabel');
        if (!badge || !label) return;

        if (online) {
          badge.style.color = 'var(--accent-green)';
          badge.style.background = 'rgba(34, 197, 94, 0.15)';
          badge.style.borderColor = 'rgba(34, 197, 94, 0.35)';
          if (dot) dot.style.background = 'var(--accent-green)';
          label.textContent = text || 'Laptop BIBLE Conectada';
        } else {
          badge.style.color = 'var(--accent-amber)';
          badge.style.background = 'rgba(245, 158, 11, 0.15)';
          badge.style.borderColor = 'rgba(245, 158, 11, 0.35)';
          if (dot) dot.style.background = 'var(--accent-amber)';
          label.textContent = text || 'Buscando laptop BIBLE...';
        }
      }

      function connectMqtt() {
        if (isMqttConnected || !window.Paho || !window.Paho.MQTT || !currentRoomId) return;
        const broker = BROKERS[activeBrokerIdx];
        const clientId = 'bible-phone-' + currentRoomId + '-' + Math.random().toString(36).substring(2, 7);

        try {
          mqttClient = new window.Paho.MQTT.Client(broker.host, broker.port, broker.path, clientId);

          mqttClient.onConnectionLost = (resp) => {
            console.warn('[MQTT] Conexión perdida:', resp?.errorMessage);
            isMqttConnected = false;
            updateConnectionBadge(false);
            updatePinConnectionStatus(false, 'Reconectando con la nube...');
            setTimeout(connectMqtt, 3000);
          };

          mqttClient.onMessageArrived = (msg) => {
            try {
              const payload = JSON.parse(msg.payloadString);
              handleRelayMessage(payload);
            } catch (e) {}
          };

          mqttClient.connect({
            useSSL: true,
            timeout: 5,
            cleanSession: true,
            keepAliveInterval: 30,
            onSuccess: () => {
              isMqttConnected = true;
              console.log('[MQTT] Conectado a ' + broker.name + ' para Sala: ' + currentRoomId);
              updateConnectionBadge(true, broker.name);

              // Suscribirse a actualizaciones de proyección de la laptop
              mqttClient.subscribe('bible/room/' + currentRoomId + '/state', { qos: 1 });

              // Enviar ping inicial para comprobar presencia de la laptop
              sendRelayCmd({ action: 'ping' });

              // Si ya tenemos PIN guardado, autenticar automáticamente
              if (savedPin) {
                sendRelayCmd({ action: 'auth', pin: savedPin });
              }
            },
            onFailure: (err) => {
              console.warn('[MQTT] Falló conexión con ' + broker.name + ':', err);
              isMqttConnected = false;
              updatePinConnectionStatus(false, 'Servidor ocupado, reintentando...');
              activeBrokerIdx = (activeBrokerIdx + 1) % BROKERS.length;
              setTimeout(connectMqtt, 2500);
            }
          });
        } catch (err) {
          console.warn('[MQTT] Error al iniciar:', err);
        }
      }

      function sendRelayCmd(cmdObj) {
        if (!isMqttConnected || !mqttClient || !currentRoomId) return;
        try {
          const topic = 'bible/room/' + currentRoomId + '/cmd';
          const payload = JSON.stringify(cmdObj);
          const msg = new window.Paho.MQTT.Message(payload);
          msg.destinationName = topic;
          msg.qos = 1;
          mqttClient.send(msg);
        } catch (err) {
          console.warn('[MQTT] Error enviando comando:', err);
        }
      }

      function handleRelayMessage(payload) {
        if (!payload) return;

        // Cancelar timer de espera de autenticación si recibimos cualquier respuesta
        if (authTimeoutTimer) {
          clearTimeout(authTimeoutTimer);
          authTimeoutTimer = null;
        }
        if (pinSubtitle) pinSubtitle.textContent = 'Ingresa el PIN de 4 dígitos de la laptop:';

        // Manejar presencia / pong o actualización de estado de la laptop
        if (payload.type === 'pong' || payload.type === 'presence' || payload.type === 'state') {
          updatePinConnectionStatus(true, 'Laptop BIBLE Conectada');
        }

        // Respuesta a intento de PIN con error
        if (payload.error) {
          hapticVibrate([60, 40, 60]);
          pinErrorMsg.textContent = payload.error;
          pinErrorMsg.classList.add('visible');
          enteredPin = '';
          updatePinDots();
          setTimeout(() => { pinErrorMsg.classList.remove('visible'); }, 4000);
          return;
        }

        // Confirmación de autenticación exitosa
        if (payload.authenticated) {
          if (enteredPin) {
            savedPin = enteredPin;
            localStorage.setItem('bible_remote_pin', savedPin);
            enteredPin = '';
            updatePinDots();
          }
          hapticVibrate(60);
          showMainScreen();
        }

        // Estado de proyección en vivo
        if (payload.projection) {
          applyState(payload.projection, payload);
        }
      }

      function updateConnectionBadge(connected, brokerName = 'WSS') {
        if (connectionStateLabel) {
          if (connected) {
            connectionStateLabel.textContent = 'En Línea (' + brokerName + ')';
            connectionStateLabel.style.color = 'var(--accent-blue)';
          } else {
            connectionStateLabel.textContent = 'Reconectando...';
            connectionStateLabel.style.color = 'var(--accent-amber)';
          }
        }
      }

      // ---------------- PIN LOGIC ----------------
      function updatePinDots() {
        pinDots.forEach((dot, idx) => {
          if (idx < enteredPin.length) {
            dot.classList.add('filled');
          } else {
            dot.classList.remove('filled');
          }
        });
      }

      async function verifyPin() {
        if (enteredPin.length !== 4) return;

        if (pinSubtitle) pinSubtitle.textContent = 'Verificando con la laptop...';

        // Timer de seguridad: si la laptop no responde en 4 segundos, avisar al usuario y limpiar puntos
        if (authTimeoutTimer) clearTimeout(authTimeoutTimer);
        authTimeoutTimer = setTimeout(() => {
          authTimeoutTimer = null;
          hapticVibrate([60, 40, 60]);
          if (pinSubtitle) pinSubtitle.textContent = 'Ingresa el PIN de 4 dígitos de la laptop:';
          pinErrorMsg.textContent = '⚠️ La laptop no responde. Verifica que BIBLE esté abierto en la computadora con la Sala: ' + currentRoomId;
          pinErrorMsg.classList.add('visible');
          enteredPin = '';
          updatePinDots();
          setTimeout(() => { pinErrorMsg.classList.remove('visible'); }, 5000);
        }, 4000);

        // 1. Si tenemos IP local vía URL (?room=...&ip=...), probar primero por Wi-Fi directo
        if (localIpDirect) {
          try {
            const controller = new AbortController();
            const toId = setTimeout(() => controller.abort(), 1500);
            const res = await fetch('http://' + localIpDirect + ':4545/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pin: enteredPin }),
              signal: controller.signal
            });
            clearTimeout(toId);
            const data = await res.json();
            if (data && data.success && data.token) {
              if (authTimeoutTimer) { clearTimeout(authTimeoutTimer); authTimeoutTimer = null; }
              hapticVibrate(60);
              savedPin = enteredPin;
              localStorage.setItem('bible_remote_pin', savedPin);
              localStorage.setItem('bible_remote_token', data.token);
              enteredPin = '';
              updatePinDots();
              showMainScreen();
              return;
            }
          } catch (e) {
            // Wi-Fi local falló, continuar a Cloud Relay
          }
        }

        // 2. Prioridad Cloud Relay MQTT
        if (isMqttConnected) {
          sendRelayCmd({ action: 'auth', pin: enteredPin });
          return;
        }

        // 3. Fallback: Vía Local HTTP si estamos en la misma máquina o IP local
        if (isLocalHost && API_BASE) {
          try {
            const res = await fetch(API_BASE + '/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pin: enteredPin })
            });
            const data = await res.json();
            if (authTimeoutTimer) { clearTimeout(authTimeoutTimer); authTimeoutTimer = null; }
            if (data.success && data.token) {
              hapticVibrate(60);
              savedPin = enteredPin;
              localStorage.setItem('bible_remote_pin', savedPin);
              localStorage.setItem('bible_remote_token', data.token);
              enteredPin = '';
              updatePinDots();
              showMainScreen();
            } else {
              hapticVibrate([50, 50, 50]);
              pinErrorMsg.textContent = data.error || 'PIN incorrecto. Intenta de nuevo.';
              pinErrorMsg.classList.add('visible');
              enteredPin = '';
              updatePinDots();
              setTimeout(() => { pinErrorMsg.classList.remove('visible'); }, 3000);
            }
          } catch (err) {
            if (authTimeoutTimer) { clearTimeout(authTimeoutTimer); authTimeoutTimer = null; }
            pinErrorMsg.textContent = 'No se pudo conectar a la laptop. Verifica que esté en la misma red Wi-Fi.';
            pinErrorMsg.classList.add('visible');
            enteredPin = '';
            updatePinDots();
            setTimeout(() => { pinErrorMsg.classList.remove('visible'); }, 3500);
          }
        }
      }

      document.querySelectorAll('.pin-key[data-num]').forEach(key => {
        key.addEventListener('click', () => {
          hapticVibrate(25);
          if (enteredPin.length < 4) {
            enteredPin += key.dataset.num;
            updatePinDots();
            if (enteredPin.length === 4) {
              // Sincronizar automáticamente la Sala BIB con los 4 dígitos ingresados
              currentRoomId = 'BIB-' + enteredPin;
              localStorage.setItem('bible_remote_room', currentRoomId);
              if (pinRoomLabel) pinRoomLabel.textContent = 'SALA: ' + currentRoomId;
              if (headerRoomBadge) headerRoomBadge.textContent = currentRoomId;

              // Suscribirse inmediatamente a la sala en el broker MQTT
              if (mqttClient && isMqttConnected) {
                try {
                  mqttClient.subscribe('bible/room/' + currentRoomId + '/state', { qos: 1 });
                } catch (e) {}
              }
              setTimeout(verifyPin, 100);
            }
          }
        });
      });

      document.getElementById('btnPinDelete').addEventListener('click', () => {
        hapticVibrate(20);
        if (enteredPin.length > 0) {
          enteredPin = enteredPin.slice(0, -1);
          updatePinDots();
        }
      });

      document.getElementById('btnPinClear').addEventListener('click', () => {
        hapticVibrate(20);
        enteredPin = '';
        updatePinDots();
      });

      if (btnChangeRoom) {
        btnChangeRoom.addEventListener('click', () => {
          const newRoom = prompt('Ingresa el Código de Sala mostrado en la pantalla de la laptop (Ej: BIB-7842):', currentRoomId);
          if (newRoom && newRoom.trim().length >= 4) {
            currentRoomId = newRoom.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
            localStorage.setItem('bible_remote_room', currentRoomId);
            if (pinRoomLabel) pinRoomLabel.textContent = 'SALA: ' + currentRoomId;
            if (headerRoomBadge) headerRoomBadge.textContent = currentRoomId;
            if (mqttClient) {
              try { mqttClient.disconnect(); } catch (e) {}
              isMqttConnected = false;
            }
            connectMqtt();
          }
        });
      }

      // ---------------- PANTALLA PRINCIPAL ----------------
      function showMainScreen() {
        pinScreen.classList.remove('active');
        mainScreen.classList.add('active');
        if (isLocalHost) {
          startPolling();
        }
      }

      function showPinScreen() {
        stopPolling();
        mainScreen.classList.remove('active');
        pinScreen.classList.add('active');
      }

      btnLogout.addEventListener('click', () => {
        hapticVibrate(30);
        if (confirm('¿Cerrar sesión del control remoto?')) {
          localStorage.removeItem('bible_remote_pin');
          localStorage.removeItem('bible_remote_token');
          savedPin = '';
          showPinScreen();
        }
      });

      // Pestañas
      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          hapticVibrate(30);
          modeTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const target = tab.dataset.tab;
          if (target === 'pulpit') {
            tabPulpit.classList.add('active');
            tabMultimedia.classList.remove('active');
          } else {
            tabMultimedia.classList.add('active');
            tabPulpit.classList.remove('active');
          }
        });
      });

      // ---------------- ACCIONES DE CONTROL ----------------
      async function sendAction(action) {
        hapticVibrate(40);

        // 1. Enviar vía Cloud Relay si está conectado
        if (isMqttConnected) {
          sendRelayCmd({
            action,
            pin: savedPin || enteredPin,
            timestamp: Date.now()
          });
          return;
        }

        // 2. Fallback vía Local HTTP REST
        const authToken = localStorage.getItem('bible_remote_token');
        try {
          const res = await fetch(API_BASE + '/api/action', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': authToken || ''
            },
            body: JSON.stringify({ action })
          });
          if (res.status === 401) {
            localStorage.removeItem('bible_remote_token');
            showPinScreen();
            return;
          }
          const data = await res.json();
          if (data && data.state) {
            applyState(data.state);
          }
        } catch (err) {
          console.warn('[Remote] Error enviando acción local:', err);
        }
      }

      // Clickers Predicador (Púlpito)
      btnPulpitNext.addEventListener('click', () => sendAction('next'));
      btnPulpitPrev.addEventListener('click', () => sendAction('prev'));

      // Botones Multimedia
      btnMediaNext.addEventListener('click', () => sendAction('next'));
      btnMediaPrev.addEventListener('click', () => sendAction('prev'));
      panicBlackout.addEventListener('click', () => sendAction('toggle-blackout'));
      panicLogo.addEventListener('click', () => sendAction('toggle-logo'));
      panicClear.addEventListener('click', () => sendAction('toggle-clear-text'));
      panicFreeze.addEventListener('click', () => sendAction('toggle-freeze'));

      // Pánico rápido en púlpito
      pulpitPanicBlackout.addEventListener('click', () => sendAction('toggle-blackout'));
      pulpitPanicLogo.addEventListener('click', () => sendAction('toggle-logo'));
      pulpitPanicClear.addEventListener('click', () => sendAction('toggle-clear-text'));
      pulpitPanicFreeze.addEventListener('click', () => sendAction('toggle-freeze'));

      // ---------------- CRONÓMETRO DE SERMÓN ----------------
      function formatTimerTime(secs) {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }

      function updateTimerDisplay() {
        sermonTimerDisplay.textContent = formatTimerTime(sermonSeconds);
        if (sermonSeconds >= 3000) { // 50 min
          sermonTimerDisplay.className = 'timer-clock danger';
        } else if (sermonSeconds >= 2400) { // 40 min
          sermonTimerDisplay.className = 'timer-clock warning';
        } else {
          sermonTimerDisplay.className = 'timer-clock';
        }
      }

      btnTimerToggle.addEventListener('click', () => {
        hapticVibrate(30);
        if (sermonRunning) {
          sermonRunning = false;
          clearInterval(sermonInterval);
          btnTimerToggle.textContent = 'Reanudar';
          timerStatusLabel.textContent = 'Pausado';
        } else {
          sermonRunning = true;
          btnTimerToggle.textContent = 'Pausar';
          timerStatusLabel.textContent = 'En curso';
          sermonInterval = setInterval(() => {
            sermonSeconds++;
            updateTimerDisplay();
          }, 1000);
        }
      });

      btnTimerReset.addEventListener('click', () => {
        hapticVibrate(30);
        sermonRunning = false;
        clearInterval(sermonInterval);
        sermonSeconds = 0;
        updateTimerDisplay();
        btnTimerToggle.textContent = 'Iniciar';
        timerStatusLabel.textContent = 'Pausado';
      });

      // ---------------- SINCRONIZACIÓN EN TIEMPO REAL ----------------
      function applyState(state, info) {
        if (!state) return;

        // Estado Tally / Pánico
        if (state.isBlackout) {
          panicBlackout.classList.add('active-blackout');
          pulpitPanicBlackout.classList.add('active-state');
          pulpitLiveBadge.textContent = '● EN NEGRO';
          pulpitLiveBadge.style.color = 'var(--accent-red)';
          mediaLiveMode.textContent = 'En Negro (F1)';
        } else {
          panicBlackout.classList.remove('active-blackout');
          pulpitPanicBlackout.classList.remove('active-state');
          pulpitLiveBadge.textContent = '● EN PANTALLA';
          pulpitLiveBadge.style.color = 'var(--accent-green)';
        }

        if (state.isLogo) {
          panicLogo.classList.add('active-logo');
          pulpitPanicLogo.classList.add('active-state');
          mediaLiveMode.textContent = 'Logo Institucional';
        } else {
          panicLogo.classList.remove('active-logo');
          pulpitPanicLogo.classList.remove('active-state');
        }

        if (state.isClearText) {
          panicClear.classList.add('active-clear');
          pulpitPanicClear.classList.add('active-state');
        } else {
          panicClear.classList.remove('active-clear');
          pulpitPanicClear.classList.remove('active-state');
        }

        if (state.isFrozen) {
          panicFreeze.classList.add('active-freeze');
          pulpitPanicFreeze.classList.add('active-state');
          mediaLiveMode.textContent = 'Congelado (F4)';
        } else {
          panicFreeze.classList.remove('active-freeze');
          pulpitPanicFreeze.classList.remove('active-state');
        }

        // Contenido Activo (Diapositiva / Versículo / Corito)
        const content = state.activeContent || state;
        const title = content.slideTitle || content.title || content.reference || 'Emisión Activa';
        const text = content.text || content.notes || '';

        pulpitSlideTitle.textContent = title;
        pulpitSlideSnippet.textContent = text || '—';
        mediaLiveTitle.textContent = title;
        mediaLiveSnippet.textContent = text ? text.slice(0, 100) + '...' : '—';

        if (content.currentSlide && content.totalSlides) {
          pulpitSlideCounter.textContent = 'Diapositiva ' + content.currentSlide + ' de ' + content.totalSlides;
        } else if (content.activeModule === 'bible' || content.module === 'bible') {
          pulpitSlideCounter.textContent = 'Biblia ' + (content.reference || '');
        } else if (content.activeModule === 'choruses' || content.module === 'choruses') {
          pulpitSlideCounter.textContent = 'Alabanza / Corito';
        } else {
          pulpitSlideCounter.textContent = 'En Vivo';
        }

        if (info && info.ip) {
          systemIpLabel.textContent = info.ip + ':' + (info.port || 4545);
        }
      }

      async function fetchStatus() {
        const authToken = localStorage.getItem('bible_remote_token');
        try {
          const res = await fetch(API_BASE + '/api/status', {
            headers: authToken ? { 'X-Auth-Token': authToken } : {}
          });
          if (res.status === 401 && authToken) {
            localStorage.removeItem('bible_remote_token');
            showPinScreen();
            return;
          }
          const data = await res.json();
          if (data.projection) {
            applyState(data.projection, data);
          }
        } catch (err) {}
      }

      function startPolling() {
        stopPolling();
        fetchStatus();
        pollTimer = setInterval(fetchStatus, 1200);
      }

      function stopPolling() {
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      }

      // Iniciar conexión MQTT
      connectMqtt();

      // Auto-login instantáneo si se escaneó código QR con PIN incluido (?room=BIB-7842&pin=7842)
      if (urlPin && /^\d{4}$/.test(urlPin)) {
        enteredPin = urlPin;
        savedPin = urlPin;
        localStorage.setItem('bible_remote_pin', savedPin);
        currentRoomId = urlParams.get('room') || ('BIB-' + urlPin);
        currentRoomId = currentRoomId.trim().toUpperCase();
        localStorage.setItem('bible_remote_room', currentRoomId);
        updatePinDots();
        setTimeout(verifyPin, 250);
      } else if (savedPin && savedPin.length === 4) {
        showMainScreen();
      } else {
        showPinScreen();
      }
    })();
  </script>
</body>
</html>
`;

// Escribir a destinos
const targets = [
  path.join(__dirname, '../src/main/services/remote-client.html'),
  path.join(__dirname, '../docs/remote/index.html'),
  path.join(__dirname, '../docs/index.html')
];

targets.forEach(targetPath => {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, html, 'utf8');
  console.log('Generado:', targetPath, '(' + Buffer.byteLength(html) + ' bytes)');
});
