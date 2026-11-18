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
    getDisplays: () => ipcRenderer.invoke('system:get-displays'),
    getModuleHtml: (moduleName) => ipcRenderer.invoke('system:get-module-html', moduleName)
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
  },

  // Coritos (Pentecostales y Adoración)
  choruses: {
    getAll: (categoryId) => ipcRenderer.invoke('choruses:get-all', categoryId),
    getById: (id) => ipcRenderer.invoke('choruses:get-by-id', id),
    getCategories: () => ipcRenderer.invoke('choruses:get-categories'),
    searchSpontaneous: (query, limit = 30) => ipcRenderer.invoke('choruses:search-spontaneous', { query, limit }),
    create: (data) => ipcRenderer.invoke('choruses:create', data),
    update: (id, data) => ipcRenderer.invoke('choruses:update', { id, data }),
    delete: (id) => ipcRenderer.invoke('choruses:delete', id),
    projectSlide: (payload) => ipcRenderer.invoke('choruses:project-slide', payload),
    getPlaylists: () => ipcRenderer.invoke('choruses:get-playlists'),
    createPlaylist: (name) => ipcRenderer.invoke('choruses:create-playlist', name),
    getPlaylistItems: (playlistId) => ipcRenderer.invoke('choruses:get-playlist-items', playlistId),
    addToPlaylist: (playlistId, chorusId) => ipcRenderer.invoke('choruses:add-to-playlist', { playlistId, chorusId }),
    deletePlaylist: (playlistId) => ipcRenderer.invoke('choruses:delete-playlist', playlistId)
  },

  // Predicación (Presentaciones PDF y PowerPoint)
  preaching: {
    getAll: () => ipcRenderer.invoke('preaching:get-all'),
    getById: (id) => ipcRenderer.invoke('preaching:get-by-id', id),
    importFile: () => ipcRenderer.invoke('preaching:import-file'),
    projectSlide: (preachingId, slideIndex) => ipcRenderer.invoke('preaching:project-slide', { preachingId, slideIndex }),
    resume: () => ipcRenderer.invoke('preaching:resume'),
    delete: (id) => ipcRenderer.invoke('preaching:delete', id)
  },

  // Spots Multimedia (Videos e Imágenes)
  spots: {
    getAll: (fileType) => ipcRenderer.invoke('spots:get-all', fileType),
    getById: (id) => ipcRenderer.invoke('spots:get-by-id', id),
    importFile: () => ipcRenderer.invoke('spots:import-file'),
    project: (id) => ipcRenderer.invoke('spots:project', id),
    delete: (id) => ipcRenderer.invoke('spots:delete', id)
  },

  // Ruleta Dinámica
  roulette: {
    getLists: () => ipcRenderer.invoke('roulette:get-lists'),
    getListById: (id) => ipcRenderer.invoke('roulette:get-list-by-id', id),
    createList: (name, items) => ipcRenderer.invoke('roulette:create-list', { name, items }),
    addItem: (listId, label, color) => ipcRenderer.invoke('roulette:add-item', { listId, label, color }),
    removeItem: (itemId) => ipcRenderer.invoke('roulette:remove-item', itemId),
    deleteList: (id) => ipcRenderer.invoke('roulette:delete-list', id),
    projectSpin: (payload) => ipcRenderer.invoke('roulette:project-spin', payload),
    projectWinner: (payload) => ipcRenderer.invoke('roulette:project-winner', payload)
  },

  // Cuenta Regresiva
  countdown: {
    getPresets: () => ipcRenderer.invoke('countdown:get-presets'),
    getState: () => ipcRenderer.invoke('countdown:get-state'),
    start: (payload) => ipcRenderer.invoke('countdown:start', payload),
    pause: () => ipcRenderer.invoke('countdown:pause'),
    resume: () => ipcRenderer.invoke('countdown:resume'),
    reset: () => ipcRenderer.invoke('countdown:reset')
  }
});
