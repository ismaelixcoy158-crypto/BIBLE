/**
 * BIBLE — ChorusesRepository
 * Repositorio de persistencia y búsqueda FTS5 para el módulo de Coritos.
 */
class ChorusesRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Divide automáticamente la letra en diapositivas legibles
   * @param {string} lyrics Letra completa
   * @returns {string[]} Arreglo de diapositivas
   */
  static splitIntoSlides(lyrics) {
    if (!lyrics || typeof lyrics !== 'string') return [];
    
    // Normalizar posibles saltos literales escapados
    const normalized = lyrics.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');

    // División por dobles saltos de línea (párrafos / estrofas)
    const paragraphs = normalized
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const slides = [];

    for (const paragraph of paragraphs) {
      const lines = paragraph.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      // Si el párrafo tiene más de 4 líneas, subdividirlo en bloques de 2-4 líneas
      if (lines.length > 4) {
        for (let i = 0; i < lines.length; i += 4) {
          slides.push(lines.slice(i, i + 4).join('\n'));
        }
      } else {
        slides.push(lines.join('\n'));
      }
    }

    return slides.length > 0 ? slides : [lyrics.trim()];
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getAllCategories() {
    return this.db.prepare('SELECT * FROM chorus_categories ORDER BY id ASC').all();
  }

  /**
   * Obtiene la biblioteca de coritos con filtro opcional de categoría
   */
  getAll(categoryId = null) {
    let sql = `
      SELECT c.id, c.title, c.lyrics, c.category_id, cat.name as category_name, 
             cat.color as category_color, c.background, c.updated_at
      FROM choruses c
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
    `;
    const params = [];

    if (categoryId) {
      sql += ' WHERE c.category_id = ?';
      params.push(categoryId);
    }

    sql += ' ORDER BY c.title COLLATE NOCASE ASC';
    return this.db.prepare(sql).all(...params);
  }

  /**
   * Obtiene un corito por ID junto con sus diapositivas calculadas
   */
  getById(id) {
    const chorus = this.db.prepare(`
      SELECT c.*, cat.name as category_name, cat.color as category_color
      FROM choruses c
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE c.id = ?
    `).get(id);

    if (!chorus) return null;

    let slides = [];
    if (chorus.custom_slides_json) {
      try {
        slides = JSON.parse(chorus.custom_slides_json);
      } catch {
        slides = ChorusesRepository.splitIntoSlides(chorus.lyrics);
      }
    } else {
      slides = ChorusesRepository.splitIntoSlides(chorus.lyrics);
    }

    return {
      ...chorus,
      slides
    };
  }

  /**
   * Búsqueda en Modo Espontáneo en tiempo real (FTS5 + Coincidencias en Título y Letra)
   */
  searchSpontaneous(queryText, limit = 50) {
    const clean = (queryText || '').trim();
    if (!clean) return this.getAll().slice(0, limit);

    // Separar palabras clave para búsqueda flexible
    const words = clean
      .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length === 0) return this.getAll().slice(0, limit);

    // Estrategia 1: Consulta FTS5 con comodín en cada término
    // Ponderación bm25(10.0, 1.0): prioriza coincidencias en título sobre letra, pero busca en ambos
    const ftsQuery = words.map(w => `"${w}"*`).join(' ');

    const sqlFTS = `
      SELECT c.id, c.title, c.lyrics, c.category_id, cat.name as category_name, 
             cat.color as category_color, c.background,
             snippet(choruses_fts, 1, '<mark class="search-match">', '</mark>', '...', 12) as match_snippet
      FROM choruses_fts
      JOIN choruses c ON c.id = choruses_fts.rowid
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE choruses_fts MATCH ?
      ORDER BY bm25(choruses_fts, 10.0, 1.0) ASC
      LIMIT ?
    `;

    try {
      const results = this.db.prepare(sqlFTS).all(ftsQuery, limit);
      if (results.length > 0) return results;
    } catch {
      // Fallback si la sintaxis FTS falló
    }

    // Estrategia 2: Si con AND estricto no hubo resultados y hay múltiples palabras, intentar con OR
    if (words.length > 1) {
      try {
        const ftsOrQuery = words.map(w => `"${w}"*`).join(' OR ');
        const orResults = this.db.prepare(sqlFTS).all(ftsOrQuery, limit);
        if (orResults.length > 0) return orResults;
      } catch {}
    }

    // Estrategia 3: Fallback estándar con LIKE en título Y en letra para tolerancia máxima
    const likeConditions = words.map(() => '(c.title LIKE ? OR c.lyrics LIKE ?)').join(' AND ');
    const params = [];
    words.forEach(w => params.push(`%${w}%`, `%${w}%`));
    const firstWord = `%${words[0]}%`;

    return this.db.prepare(`
      SELECT c.id, c.title, c.lyrics, c.category_id, cat.name as category_name, 
             cat.color as category_color, c.background
      FROM choruses c
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE ${likeConditions}
      ORDER BY 
        CASE WHEN c.title LIKE ? THEN 1 ELSE 2 END,
        c.title ASC
      LIMIT ?
    `).all(...params, firstWord, limit);
  }

  /**
   * Crea un nuevo corito
   */
  create({ title, lyrics, category_id = 1, background = null, custom_slides = null }) {
    const trimmedTitle = (title || '').trim();
    const trimmedLyrics = (lyrics || '').trim();

    if (!trimmedTitle) throw new Error('El título del corito es obligatorio');
    if (!trimmedLyrics) throw new Error('La letra del corito es obligatoria');

    const slidesJson = custom_slides ? JSON.stringify(custom_slides) : null;

    const info = this.db.prepare(`
      INSERT INTO choruses (title, lyrics, category_id, background, custom_slides_json)
      VALUES (?, ?, ?, ?, ?)
    `).run(trimmedTitle, trimmedLyrics, category_id, background, slidesJson);

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Actualiza un corito existente
   */
  update(id, { title, lyrics, category_id, background, custom_slides }) {
    const current = this.getById(id);
    if (!current) throw new Error('Corito no encontrado');

    const newTitle = title !== undefined ? title.trim() : current.title;
    const newLyrics = lyrics !== undefined ? lyrics.trim() : current.lyrics;
    const newCategory = category_id !== undefined ? category_id : current.category_id;
    const newBackground = background !== undefined ? background : current.background;
    const newSlidesJson = custom_slides !== undefined ? JSON.stringify(custom_slides) : current.custom_slides_json;

    this.db.prepare(`
      UPDATE choruses 
      SET title = ?, lyrics = ?, category_id = ?, background = ?, custom_slides_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newTitle, newLyrics, newCategory, newBackground, newSlidesJson, id);

    return this.getById(id);
  }

  /**
   * Elimina un corito
   */
  delete(id) {
    this.db.prepare('DELETE FROM choruses WHERE id = ?').run(id);
    return true;
  }

  // --- REPERTORIO / LISTAS DE CULTO ---

  getPlaylists() {
    return this.db.prepare(`
      SELECT p.*, COUNT(pi.id) as total_items
      FROM chorus_playlists p
      LEFT JOIN chorus_playlist_items pi ON pi.playlist_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all();
  }

  createPlaylist(name, serviceDate = null) {
    const clean = (name || '').trim();
    if (!clean) throw new Error('El nombre del repertorio es obligatorio');
    const info = this.db.prepare(`
      INSERT INTO chorus_playlists (name, service_date) 
      VALUES (?, ?)
    `).run(clean, serviceDate || null);
    return { id: info.lastInsertRowid, name: clean, service_date: serviceDate };
  }

  getPlaylistItems(playlistId) {
    return this.db.prepare(`
      SELECT pi.position, c.id, c.title, c.lyrics, c.background,
             cat.name as category_name, cat.color as category_color
      FROM chorus_playlist_items pi
      JOIN choruses c ON c.id = pi.chorus_id
      LEFT JOIN chorus_categories cat ON cat.id = c.category_id
      WHERE pi.playlist_id = ?
      ORDER BY pi.position ASC
    `).all(playlistId);
  }

  addChorusToPlaylist(playlistId, chorusId) {
    // Si ya existe en la lista, no duplicar
    const existing = this.db.prepare(
      'SELECT id FROM chorus_playlist_items WHERE playlist_id = ? AND chorus_id = ?'
    ).get(playlistId, chorusId);
    if (existing) {
      return this.getPlaylistItems(playlistId);
    }

    const maxPos = this.db.prepare(
      'SELECT COALESCE(MAX(position), 0) as max_pos FROM chorus_playlist_items WHERE playlist_id = ?'
    ).get(playlistId).max_pos;

    this.db.prepare(`
      INSERT INTO chorus_playlist_items (playlist_id, chorus_id, position)
      VALUES (?, ?, ?)
    `).run(playlistId, chorusId, maxPos + 1);

    return this.getPlaylistItems(playlistId);
  }

  removeChorusFromPlaylist(playlistId, chorusId) {
    this.db.prepare(`
      DELETE FROM chorus_playlist_items 
      WHERE playlist_id = ? AND chorus_id = ?
    `).run(playlistId, chorusId);

    // Reordenar posiciones secuenciales sin violar UNIQUE (playlist_id, position)
    const remaining = this.db.prepare(
      'SELECT id FROM chorus_playlist_items WHERE playlist_id = ? ORDER BY position ASC'
    ).all(playlistId);

    const updatePos = this.db.prepare('UPDATE chorus_playlist_items SET position = ? WHERE id = ?');
    const transaction = this.db.transaction((items) => {
      items.forEach((item, index) => {
        updatePos.run(-(index + 1), item.id);
      });
      items.forEach((item, index) => {
        updatePos.run(index + 1, item.id);
      });
    });
    transaction(remaining);

    return this.getPlaylistItems(playlistId);
  }

  updatePlaylist(id, { name, serviceDate }) {
    const current = this.db.prepare('SELECT * FROM chorus_playlists WHERE id = ?').get(id);
    if (!current) throw new Error('Repertorio no encontrado');

    const newName = name !== undefined && name !== null ? name.trim() : current.name;
    const newDate = serviceDate !== undefined ? serviceDate : current.service_date;

    if (!newName) throw new Error('El nombre del repertorio es obligatorio');

    this.db.prepare(`
      UPDATE chorus_playlists
      SET name = ?, service_date = ?
      WHERE id = ?
    `).run(newName, newDate, id);

    return { id, name: newName, service_date: newDate };
  }

  reorderPlaylistItem(playlistId, chorusId, direction) {
    const plId = parseInt(playlistId, 10);
    const chId = parseInt(chorusId, 10);
    const items = this.getPlaylistItems(plId);
    const index = items.findIndex(it => Number(it.id) === chId);
    if (index === -1) return items;

    if (direction === 'up' && index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    } else if (direction === 'down' && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    } else {
      return items;
    }

    const updatePos = this.db.prepare('UPDATE chorus_playlist_items SET position = ? WHERE playlist_id = ? AND chorus_id = ?');
    const transaction = this.db.transaction((reordered) => {
      // Fase 1: Desplazar a índices negativos para evitar colisiones UNIQUE
      reordered.forEach((item, idx) => {
        updatePos.run(-(idx + 1), plId, item.id);
      });
      // Fase 2: Asignar índices secuenciales 1..N
      reordered.forEach((item, idx) => {
        updatePos.run(idx + 1, plId, item.id);
      });
    });
    transaction(items);

    return this.getPlaylistItems(plId);
  }

  deletePlaylist(playlistId) {
    this.db.prepare('DELETE FROM chorus_playlist_items WHERE playlist_id = ?').run(playlistId);
    this.db.prepare('DELETE FROM chorus_playlists WHERE id = ?').run(playlistId);
    return true;
  }

  /**
   * Búsqueda híbrida en línea de letras de alabanzas y cantos cristianos en internet
   * Funciona tanto por NOMBRE/TÍTULO como por cualquier FRASE DE LA LETRA.
   * Retorna una lista de cantos encontrados con letra completa formateada en diapositivas.
   */
  async searchOnline(query) {
    const q = (query || '').trim();
    if (!q) return [];

    const seen = new Set();
    const results = [];

    const addResult = (item) => {
      if (!item.title || !item.lyrics) return;
      const key = `${item.title.toLowerCase().trim()}::${(item.artist || '').toLowerCase().trim()}`;
      if (seen.has(key)) return;
      seen.add(key);

      const lines = item.lyrics.split('\n').map(l => l.trim()).filter(Boolean);
      const snippet = lines.slice(0, 3).join(' / ');
      const slides = ChorusesRepository.splitIntoSlides(item.lyrics);

      results.push({
        title: item.title.trim(),
        artist: (item.artist || '').trim(),
        album: (item.album || '').trim(),
        lyrics: item.lyrics.trim(),
        slides,
        match_snippet: snippet,
        isOnline: true
      });
    };

    // 1. Búsqueda directa en LRCLIB (ideal para títulos y artistas)
    try {
      const lrcUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(q)}`;
      const lrcRes = await fetch(lrcUrl, {
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'BIBLE-Church-Media-System/1.0' }
      });
      if (lrcRes.ok) {
        const data = await lrcRes.json();
        if (Array.isArray(data)) {
          for (const it of data) {
            if (!it.plainLyrics && !it.syncedLyrics) continue;
            const lyrics = (it.plainLyrics || it.syncedLyrics.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '')).trim();
            if (lyrics) {
              addResult({
                title: it.trackName,
                artist: it.artistName,
                album: it.albumName,
                lyrics
              });
            }
            if (results.length >= 12) break;
          }
        }
      }
    } catch (err) {
      console.warn('[ChorusesRepository] LRCLIB error:', err.message);
    }

    // 2. Búsqueda por frase de la letra en Genius (identifica el título a partir de versos/estrofas)
    if (results.length < 8) {
      try {
        const geniusUrl = `https://genius.com/api/search/multi?q=${encodeURIComponent(q)}`;
        const genRes = await fetch(geniusUrl, {
          signal: AbortSignal.timeout(5000),
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (genRes.ok) {
          const genData = await genRes.json();
          const candidateTracks = [];
          (genData.response?.sections || []).forEach(sec => {
            (sec.hits || []).forEach(h => {
              if (h.result?.title) {
                candidateTracks.push({
                  title: h.result.title,
                  artist: h.result.primary_artist?.name || ''
                });
              }
            });
          });

          // Para los títulos descubiertos por la letra, consultar sus letras completas en LRCLIB
          for (const cand of candidateTracks.slice(0, 5)) {
            let lrcTrackUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(cand.title)}`;
            if (cand.artist) {
              lrcTrackUrl += `&artist_name=${encodeURIComponent(cand.artist)}`;
            }
            try {
              let trRes = await fetch(lrcTrackUrl, {
                signal: AbortSignal.timeout(3000),
                headers: { 'User-Agent': 'BIBLE-Church-Media-System/1.0' }
              });
              let trData = trRes.ok ? await trRes.json() : [];
              if ((!Array.isArray(trData) || trData.length === 0) && cand.artist) {
                // Reintentar solo por el título de la canción si falló con el artista
                const fallbackUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(cand.title)}`;
                const fbRes = await fetch(fallbackUrl, {
                  signal: AbortSignal.timeout(3000),
                  headers: { 'User-Agent': 'BIBLE-Church-Media-System/1.0' }
                });
                if (fbRes.ok) trData = await fbRes.json();
              }

              if (Array.isArray(trData)) {
                for (const it of trData) {
                  if (!it.plainLyrics && !it.syncedLyrics) continue;
                  const lyrics = (it.plainLyrics || it.syncedLyrics.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '')).trim();
                  if (lyrics) {
                    addResult({
                      title: it.trackName,
                      artist: it.artistName,
                      album: it.albumName,
                      lyrics
                    });
                    break;
                  }
                }
              }
            } catch (e) {}
            if (results.length >= 12) break;
          }
        }
      } catch (err) {
        console.warn('[ChorusesRepository] Genius lyric search error:', err.message);
      }
    }

    // 3. Respaldo para coritos tradicionales y pentecostales (Letras.com vía motor público)
    if (results.length === 0) {
      try {
        const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q + ' letra cristiana')}`;
        const ddgRes = await fetch(ddgUrl, {
          signal: AbortSignal.timeout(5000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html',
            'Accept-Language': 'es-ES,es;q=0.9'
          }
        });
        if (ddgRes.ok) {
          const html = await ddgRes.text();
          const urlMatches = [...html.matchAll(/class="result__url"[^>]*href="([^"]+)"/g)];
          for (const um of urlMatches.slice(0, 3)) {
            let rawUrl = um[1];
            const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
            const targetUrl = uddgMatch ? decodeURIComponent(uddgMatch[1]) : rawUrl;
            if (targetUrl.includes('letras.com')) {
              try {
                const lRes = await fetch(targetUrl, {
                  signal: AbortSignal.timeout(4000),
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });
                if (lRes.ok) {
                  const lHtml = await lRes.text();
                  const h1Match = lHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
                  const title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : q;
                  const pMatches = [...lHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)];
                  let lyrics = pMatches.map(p => p[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim()).filter(Boolean).join('\n\n');
                  lyrics = lyrics
                    .replace(/Paga una vez[\s\S]*$/i, '')
                    .replace(/Enviada por[\s\S]*$/i, '')
                    .replace(/¿Viste algún error\?[\s\S]*$/i, '')
                    .trim();
                  if (lyrics) {
                    addResult({
                      title,
                      artist: 'Letras.com',
                      album: '',
                      lyrics
                    });
                  }
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.warn('[ChorusesRepository] Fallback search error:', err.message);
      }
    }

    return results;
  }
}

module.exports = ChorusesRepository;
