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
    updateBackground: (background) => ipcRenderer.invoke('projection:update-background', background),
    updateTextColor: (textColor) => ipcRenderer.invoke('projection:update-text-color', textColor),
    updateFontSize: (fontSize) => ipcRenderer.invoke('projection:update-font-size', fontSize),
    updateFontFamily: (fontFamily) => ipcRenderer.invoke('projection:update-font-family', fontFamily),
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
    },
    onMediaCommand: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('projection:media-command', subscription);
      return () => ipcRenderer.removeListener('projection:media-command', subscription);
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
    uploadLogoBase64: (payload) => ipcRenderer.invoke('church:upload-logo-base64', payload),
    downloadLogoUrl: (url) => ipcRenderer.invoke('church:download-logo-url', url),
    deleteLogo: () => ipcRenderer.invoke('church:delete-logo'),
    reset: () => ipcRenderer.invoke('church:reset')
  },

  // Biblia (Multi-versión: RV1909, RVG)
  bible: {
    getVersions: () => ipcRenderer.invoke('bible:get-versions'),
    getBooks: () => ipcRenderer.invoke('bible:get-books'),
    getVersesByChapter: (bookId, chapter, version) => ipcRenderer.invoke('bible:get-verses-by-chapter', { bookId, chapter, version }),
    searchReference: (rawRef, version) => ipcRenderer.invoke('bible:search-reference', typeof rawRef === 'object' ? rawRef : { rawReference: rawRef, version }),
    searchText: (keyword, limit = 50, version) => ipcRenderer.invoke('bible:search-text', { keyword, limit, version }),
    projectVerse: (payload) => ipcRenderer.invoke('bible:project-verse', payload),
    selectBackgroundFile: () => ipcRenderer.invoke('bible:select-background-file'),
    processUrlBackground: (url) => ipcRenderer.invoke('bible:process-url-background', url),
    getBackgroundPresets: () => ipcRenderer.invoke('bible:get-background-presets')
  },

  // Coritos (Pentecostales y Adoración)
  choruses: {
    getAll: (categoryId) => ipcRenderer.invoke('choruses:get-all', categoryId),
    getById: (id) => ipcRenderer.invoke('choruses:get-by-id', id),
    getCategories: () => ipcRenderer.invoke('choruses:get-categories'),
    searchSpontaneous: (query, limit = 30) => ipcRenderer.invoke('choruses:search-spontaneous', { query, limit }),
    searchOnline: (query) => ipcRenderer.invoke('choruses:search-online', query),
    create: (data) => ipcRenderer.invoke('choruses:create', data),
    update: (id, data) => ipcRenderer.invoke('choruses:update', { id, data }),
    delete: (id) => ipcRenderer.invoke('choruses:delete', id),
    projectSlide: (payload) => ipcRenderer.invoke('choruses:project-slide', payload),
    getPlaylists: () => ipcRenderer.invoke('choruses:get-playlists'),
    createPlaylist: (nameOrPayload) => ipcRenderer.invoke('choruses:create-playlist', nameOrPayload),
    getPlaylistItems: (playlistId) => ipcRenderer.invoke('choruses:get-playlist-items', playlistId),
    addToPlaylist: (playlistId, chorusId) => ipcRenderer.invoke('choruses:add-to-playlist', { playlistId, chorusId }),
    removeFromPlaylist: (playlistId, chorusId) => ipcRenderer.invoke('choruses:remove-from-playlist', { playlistId, chorusId }),
    reorderPlaylistItem: (playlistId, chorusId, direction) => ipcRenderer.invoke('choruses:reorder-playlist-item', { playlistId, chorusId, direction }),
    updatePlaylist: (id, data) => ipcRenderer.invoke('choruses:update-playlist', { id, data }),
    deletePlaylist: (playlistId) => ipcRenderer.invoke('choruses:delete-playlist', playlistId)
  },

  // Predicación (Presentaciones PDF y PowerPoint)
  preaching: {
    getAll: () => ipcRenderer.invoke('preaching:get-all'),
    getById: (id) => ipcRenderer.invoke('preaching:get-by-id', id),
    importFile: () => ipcRenderer.invoke('preaching:import-file'),
    createManual: (payload) => ipcRenderer.invoke('preaching:create-manual', payload),
    updateRenderMode: (id, renderMode) => ipcRenderer.invoke('preaching:update-render-mode', { id, renderMode }),
    projectSlide: (preachingId, slideIndex, renderMode) => ipcRenderer.invoke('preaching:project-slide', { preachingId, slideIndex, renderMode }),
    resume: () => ipcRenderer.invoke('preaching:resume'),
    delete: (id) => ipcRenderer.invoke('preaching:delete', id)
  },

  // Spots Multimedia (Videos e Imágenes)
  spots: {
    getAll: (fileType) => ipcRenderer.invoke('spots:get-all', fileType),
    getById: (id) => ipcRenderer.invoke('spots:get-by-id', id),
    importFile: () => ipcRenderer.invoke('spots:import-file'),
    addUrl: (payload) => ipcRenderer.invoke('spots:add-url', payload),
    update: (id, data) => ipcRenderer.invoke('spots:update', { id, data }),
    project: (id, options) => ipcRenderer.invoke('spots:project', id, options),
    delete: (id) => ipcRenderer.invoke('spots:delete', id),
    play: () => ipcRenderer.invoke('spots:play'),
    pause: () => ipcRenderer.invoke('spots:pause'),
    seek: (seconds) => ipcRenderer.invoke('spots:seek', seconds),
    setVolume: (volume, muted) => ipcRenderer.invoke('spots:set-volume', { volume, muted }),
    setLoop: (spotId, loop) => ipcRenderer.invoke('spots:set-loop', { spotId, loop }),
    stop: () => ipcRenderer.invoke('spots:stop'),
    sendTimeUpdate: (timeData) => ipcRenderer.invoke('spots:time-update', timeData),
    onTimeUpdate: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('projection:media-time-update', subscription);
      return () => ipcRenderer.removeListener('projection:media-time-update', subscription);
    },
    onMediaCommand: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('projection:media-command', subscription);
      return () => ipcRenderer.removeListener('projection:media-command', subscription);
    }
  },

  // Ruleta Dinámica
  roulette: {
    getLists: () => ipcRenderer.invoke('roulette:get-lists'),
    getListById: (id) => ipcRenderer.invoke('roulette:get-list-by-id', id),
    createList: (name, items) => ipcRenderer.invoke('roulette:create-list', { name, items }),
    renameList: (id, name) => ipcRenderer.invoke('roulette:rename-list', { id, name }),
    addItem: (listId, label, color) => ipcRenderer.invoke('roulette:add-item', { listId, label, color }),
    addItemsBatch: (listId, labels) => ipcRenderer.invoke('roulette:add-items-batch', { listId, labels }),
    clearItems: (listId) => ipcRenderer.invoke('roulette:clear-items', listId),
    removeItem: (itemId) => ipcRenderer.invoke('roulette:remove-item', itemId),
    deleteList: (id) => ipcRenderer.invoke('roulette:delete-list', id),
    projectWheel: (payload) => ipcRenderer.invoke('roulette:project-wheel', payload),
    projectSpin: (payload) => ipcRenderer.invoke('roulette:project-spin', payload),
    projectWinner: (payload) => ipcRenderer.invoke('roulette:project-winner', payload)
  },

  // Cuenta Regresiva
  countdown: {
    getPresets: () => ipcRenderer.invoke('countdown:get-presets'),
    getState: () => ipcRenderer.invoke('countdown:get-state'),
    start: (payload) => ipcRenderer.invoke('countdown:start', payload),
    setTime: (payload) => ipcRenderer.invoke('countdown:set-time', payload),
    addSeconds: (delta) => ipcRenderer.invoke('countdown:add-seconds', delta),
    pause: () => ipcRenderer.invoke('countdown:pause'),
    resume: () => ipcRenderer.invoke('countdown:resume'),
    reset: () => ipcRenderer.invoke('countdown:reset'),
    project: (payload) => ipcRenderer.invoke('countdown:project', payload)
  },

  // Control Remoto (Vía Wi-Fi / Móvil / Cloud)
  control: {
    getStatus: () => ipcRenderer.invoke('control:get-status'),
    getRoomId: () => ipcRenderer.invoke('control:get-room-id'),
    setRoomId: (roomId) => ipcRenderer.invoke('control:set-room-id', roomId),
    generateNewRoomId: () => ipcRenderer.invoke('control:generate-new-room-id'),
    startServer: () => ipcRenderer.invoke('control:start-server'),
    stopServer: () => ipcRenderer.invoke('control:stop-server'),
    generateNewPin: () => ipcRenderer.invoke('control:generate-new-pin'),
    setPin: (pin) => ipcRenderer.invoke('control:set-pin', pin),
    getQrSvg: (mode = 'cloud') => ipcRenderer.invoke('control:get-qr-svg', mode),
    executeAction: (action) => ipcRenderer.invoke('control:execute-action', action),
    onRemoteAction: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('remote:action', subscription);
      return () => ipcRenderer.removeListener('remote:action', subscription);
    }
  }
});
