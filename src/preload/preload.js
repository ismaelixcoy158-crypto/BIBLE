const { contextBridge, ipcRenderer } = require('electron');

/**
 * BIBLE — Preload Script
 * Expone un API estrictamente tipado y seguro mediante contextBridge.
 * El código del navegador (Renderer) NUNCA accede a Node ni a Electron directamente.
 */
contextBridge.exposeInMainWorld('bibleAPI', {
  // Servicio de Proyección
  projection: {
    project: (payload) => ipcRenderer.invoke('projection:project', payload),
    toggleBlackout: (force) => ipcRenderer.invoke('projection:toggle-blackout', force),
    toggleLogo: (force) => ipcRenderer.invoke('projection:toggle-logo', force),
    toggleClearText: (force) => ipcRenderer.invoke('projection:toggle-clear-text', force),
    toggleFreeze: (force) => ipcRenderer.invoke('projection:toggle-freeze', force),
    getState: () => ipcRenderer.invoke('projection:get-state'),

    // Eventos recibidos desde el proceso principal
    onStateUpdate: (callback) => {
      const subscription = (_event, state) => callback(state);
      ipcRenderer.on('projection:update', subscription);
      return () => ipcRenderer.removeListener('projection:update', subscription);
    },
    onPreviewUpdate: (callback) => {
      const subscription = (_event, state) => callback(state);
      ipcRenderer.on('projection:preview-update', subscription);
      return () => ipcRenderer.removeListener('projection:preview-update', subscription);
    }
  },

  // Base de datos y configuración
  db: {
    getSetting: (key) => ipcRenderer.invoke('db:get-setting', key),
    setSetting: (key, value) => ipcRenderer.invoke('db:set-setting', { key, value }),
    getHistory: (limit) => ipcRenderer.invoke('db:get-history', limit),
    recordHistory: (entry) => ipcRenderer.invoke('db:record-history', entry)
  },

  // Pantallas y hardware
  system: {
    getDisplays: () => ipcRenderer.invoke('system:get-displays')
  }
});
