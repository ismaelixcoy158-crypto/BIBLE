const { ipcMain } = require('electron');
const dbManager = require('../../database/database.js');
const projectionService = require('../services/projection-service.js');
const churchService = require('../services/church-service.js');
const preachingService = require('../services/preaching-service.js');
const spotsService = require('../services/spots-service.js');
const BibleRepository = require('../../database/repositories/bible.repository.js');
const ChorusesRepository = require('../../database/repositories/choruses.repository.js');
const RouletteRepository = require('../../database/repositories/roulette.repository.js');
const windowManager = require('../windows/window-manager.js');

/**
 * Registra todos los manejadores IPC con validación estricta de parámetros
 */
function registerIpcHandlers() {
  const db = dbManager.getInstance();
  const bibleRepo = new BibleRepository(db);
  const chorusesRepo = new ChorusesRepository(db);
  const rouletteRepo = new RouletteRepository(db);

  // Sincronizar identidad inicial con el servicio de proyección
  try {
    projectionService.setChurchIdentity(churchService.getIdentity());
  } catch (err) {
    console.warn('[IPC] No se pudo cargar identidad inicial para proyección:', err);
  }

  // --- 1. PROYECCIÓN ---
  ipcMain.handle('projection:project', async (_event, payload) => {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload inválido para proyección');
    }
    const state = projectionService.project(payload);

    // Registrar en el historial si es contenido válido
    if (payload.module && payload.title) {
      try {
        db.prepare(
          'INSERT INTO projection_history (module, title, content) VALUES (?, ?, ?)'
        ).run(payload.module, payload.title, payload.text || '');
      } catch (err) {
        console.error('[IPC] Error al registrar historial:', err);
      }
    }

    return state;
  });

  ipcMain.handle('projection:toggle-blackout', async (_event, force) => {
    return projectionService.toggleBlackout(typeof force === 'boolean' ? force : null);
  });

  ipcMain.handle('projection:toggle-logo', async (_event, force) => {
    return projectionService.toggleLogo(typeof force === 'boolean' ? force : null);
  });

  ipcMain.handle('projection:toggle-clear-text', async (_event, force) => {
    return projectionService.toggleClearText(typeof force === 'boolean' ? force : null);
  });

  ipcMain.handle('projection:toggle-freeze', async (_event, force) => {
    return projectionService.toggleFreeze(typeof force === 'boolean' ? force : null);
  });

  ipcMain.handle('projection:get-state', async () => {
    return projectionService.getState();
  });

  // --- 2. BASE DE DATOS Y CONFIGURACIÓN ---
  ipcMain.handle('db:get-setting', async (_event, key) => {
    if (typeof key !== 'string') return null;
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    if (!row) return null;
    try {
      return JSON.parse(row.value);
    } catch {
      return row.value;
    }
  });

  ipcMain.handle('db:set-setting', async (_event, { key, value }) => {
    if (typeof key !== 'string') throw new Error('Clave de configuración inválida');
    const jsonValue = JSON.stringify(value);
    db.prepare(`
      INSERT INTO settings (key, value, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(key, jsonValue);
    return true;
  });

  ipcMain.handle('db:get-history', async (_event, limit = 50) => {
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    return db.prepare(
      'SELECT * FROM projection_history ORDER BY projected_at DESC LIMIT ?'
    ).all(safeLimit);
  });

  // --- 3. PANTALLAS ---
  ipcMain.handle('system:get-displays', async () => {
    return windowManager.getDisplays();
  });

  // --- 4. IDENTIDAD DE LA IGLESIA ---
  ipcMain.handle('church:get-identity', async () => {
    return churchService.getIdentity();
  });

  ipcMain.handle('church:update-name', async (_event, name) => {
    const updated = churchService.updateName(name);
    projectionService.setChurchIdentity(updated);
    return updated;
  });

  ipcMain.handle('church:select-local-logo', async (event) => {
    const parentWin = windowManager.getWindows().operatorWindow;
    const updated = await churchService.selectLocalLogo(parentWin);
    if (updated) {
      projectionService.setChurchIdentity(updated);
    }
    return updated;
  });

  ipcMain.handle('church:download-logo-url', async (_event, url) => {
    const updated = await churchService.downloadLogoUrl(url);
    projectionService.setChurchIdentity(updated);
    return updated;
  });

  ipcMain.handle('church:delete-logo', async () => {
    const updated = churchService.deleteLogo();
    projectionService.setChurchIdentity(updated);
    return updated;
  });

  ipcMain.handle('church:reset', async () => {
    const updated = churchService.reset();
    projectionService.setChurchIdentity(updated);
    return updated;
  });

  // --- 5. BIBLIA ---
  ipcMain.handle('bible:get-books', async () => {
    return bibleRepo.getAllBooks();
  });

  ipcMain.handle('bible:get-verses-by-chapter', async (_event, { bookId, chapter }) => {
    return bibleRepo.getVersesByChapter(parseInt(bookId, 10), parseInt(chapter, 10));
  });

  ipcMain.handle('bible:search-reference', async (_event, rawReference) => {
    return bibleRepo.searchReference(rawReference);
  });

  ipcMain.handle('bible:search-text', async (_event, { keyword, limit }) => {
    return bibleRepo.searchByText(keyword, limit);
  });

  ipcMain.handle('bible:project-verse', async (_event, payload) => {
    const { title, text, reference, refPosition, background, customStyles } = payload;
    return projectionService.project({
      module: 'bible',
      title: title || reference,
      text,
      reference,
      refPosition: refPosition || 'bottom',
      background: background || null,
      customStyles: customStyles || null
    });
  });

  // --- 6. CORITOS ---
  ipcMain.handle('choruses:get-all', async (_event, categoryId) => {
    return chorusesRepo.getAll(categoryId || null);
  });

  ipcMain.handle('choruses:get-by-id', async (_event, id) => {
    return chorusesRepo.getById(id);
  });

  ipcMain.handle('choruses:get-categories', async () => {
    return chorusesRepo.getAllCategories();
  });

  ipcMain.handle('choruses:search-spontaneous', async (_event, { query, limit }) => {
    return chorusesRepo.searchSpontaneous(query, limit);
  });

  ipcMain.handle('choruses:create', async (_event, data) => {
    return chorusesRepo.create(data);
  });

  ipcMain.handle('choruses:update', async (_event, { id, data }) => {
    return chorusesRepo.update(id, data);
  });

  ipcMain.handle('choruses:delete', async (_event, id) => {
    return chorusesRepo.delete(id);
  });

  ipcMain.handle('choruses:project-slide', async (_event, { title, slideText, background }) => {
    return projectionService.project({
      module: 'choruses',
      title,
      text: slideText,
      reference: title,
      refPosition: 'top',
      background: background || null
    });
  });

  ipcMain.handle('choruses:get-playlists', async () => {
    return chorusesRepo.getPlaylists();
  });

  ipcMain.handle('choruses:create-playlist', async (_event, name) => {
    return chorusesRepo.createPlaylist(name);
  });

  ipcMain.handle('choruses:get-playlist-items', async (_event, playlistId) => {
    return chorusesRepo.getPlaylistItems(playlistId);
  });

  ipcMain.handle('choruses:add-to-playlist', async (_event, { playlistId, chorusId }) => {
    return chorusesRepo.addChorusToPlaylist(playlistId, chorusId);
  });

  ipcMain.handle('choruses:delete-playlist', async (_event, playlistId) => {
    return chorusesRepo.deletePlaylist(playlistId);
  });

  // --- 7. PREDICACIÓN (PRESENTACIONES Y DOCUMENTOS) ---
  ipcMain.handle('preaching:get-all', async () => {
    return preachingService.getAll();
  });

  ipcMain.handle('preaching:get-by-id', async (_event, id) => {
    return preachingService.getById(id);
  });

  ipcMain.handle('preaching:import-file', async () => {
    const parentWin = windowManager.getWindows().operatorWindow;
    return preachingService.selectAndImportPresentation(parentWin);
  });

  ipcMain.handle('preaching:project-slide', async (_event, { preachingId, slideIndex }) => {
    return preachingService.projectSlide(preachingId, slideIndex);
  });

  ipcMain.handle('preaching:resume', async () => {
    return preachingService.resumeActivePreaching();
  });

  ipcMain.handle('preaching:delete', async (_event, id) => {
    return preachingService.delete(id);
  });

  // --- 8. SPOTS MULTIMEDIA (IMÁGENES Y VIDEOS) ---
  ipcMain.handle('spots:get-all', async (_event, fileType) => {
    return spotsService.getAll(fileType || null);
  });

  ipcMain.handle('spots:get-by-id', async (_event, id) => {
    return spotsService.getById(id);
  });

  ipcMain.handle('spots:import-file', async () => {
    const parentWin = windowManager.getWindows().operatorWindow;
    return spotsService.selectAndImportSpot(parentWin);
  });

  ipcMain.handle('spots:project', async (_event, id) => {
    return spotsService.projectSpot(id);
  });

  ipcMain.handle('spots:delete', async (_event, id) => {
    return spotsService.delete(id);
  });

  // --- 9. RULETA ---
  ipcMain.handle('roulette:get-lists', async () => {
    return rouletteRepo.getAllLists();
  });

  ipcMain.handle('roulette:get-list-by-id', async (_event, id) => {
    return rouletteRepo.getListById(id);
  });

  ipcMain.handle('roulette:create-list', async (_event, { name, items }) => {
    return rouletteRepo.createList(name, items);
  });

  ipcMain.handle('roulette:add-item', async (_event, { listId, label, color }) => {
    return rouletteRepo.addItem(listId, label, color);
  });

  ipcMain.handle('roulette:remove-item', async (_event, itemId) => {
    return rouletteRepo.removeItem(itemId);
  });

  ipcMain.handle('roulette:delete-list', async (_event, id) => {
    return rouletteRepo.deleteList(id);
  });

  ipcMain.handle('roulette:project-spin', async (_event, payload) => {
    const { items, winningIndex, durationMs, winnerLabel } = payload;
    return projectionService.project({
      module: 'roulette',
      title: 'Ruleta en Vivo',
      text: winnerLabel || '',
      reference: 'Ruleta Dinámica',
      items,
      winningIndex,
      durationMs: durationMs || 5000,
      isSpinning: true
    });
  });

  ipcMain.handle('roulette:project-winner', async (_event, { winnerLabel, color }) => {
    return projectionService.project({
      module: 'roulette',
      title: '¡Elemento Seleccionado!',
      text: winnerLabel,
      reference: '¡Ganador!',
      customStyles: { color: color || '#FCD34D' },
      isSpinning: false
    });
  });
}

module.exports = registerIpcHandlers;
