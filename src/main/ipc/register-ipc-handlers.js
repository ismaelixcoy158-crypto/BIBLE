const { ipcMain } = require('electron');
const dbManager = require('../../database/database.js');
const projectionService = require('../services/projection-service.js');
const windowManager = require('../windows/window-manager.js');

/**
 * Registra todos los manejadores IPC con validación estricta de parámetros
 */
function registerIpcHandlers() {
  const db = dbManager.getInstance();

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
}

module.exports = registerIpcHandlers;
