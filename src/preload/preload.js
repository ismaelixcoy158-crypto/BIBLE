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
  },

  // Identidad de la iglesia
  church: {
    getIdentity: () => ipcRenderer.invoke('church:get-identity'),
    updateName: (name) => ipcRenderer.invoke('church:update-name', name),
    selectLocalLogo: () => ipcRenderer.invoke('church:select-local-logo'),
    downloadLogoUrl: (url) => ipcRenderer.invoke('church:download-logo-url', url),
    deleteLogo: () => ipcRenderer.invoke('church:delete-logo'),
    reset: () => ipcRenderer.invoke('church:reset')
  },

  // Biblia (RV1909)
  bible: {
    getBooks: () => ipcRenderer.invoke('bible:get-books'),
    getVersesByChapter: (bookId, chapter) => ipcRenderer.invoke('bible:get-verses-by-chapter', { bookId, chapter }),
    searchReference: (rawRef) => ipcRenderer.invoke('bible:search-reference', rawRef),
    searchText: (keyword, limit = 50) => ipcRenderer.invoke('bible:search-text', { keyword, limit }),
    projectVerse: (payload) => ipcRenderer.invoke('bible:project-verse', payload)
  }
});
