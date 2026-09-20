const prefix = 'game-factory:';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try { localStorage.setItem(prefix + key, JSON.stringify(value)); } catch { /* storage is optional */ }
}

export const playerStore = {
  bestScore(gameId) { return read(`best:${gameId}`, 0); },
  setBestScore(gameId, score) { const best = Math.max(this.bestScore(gameId), score); write(`best:${gameId}`, best); return best; },
  favorites() { return read('favorites', []); },
  toggleFavorite(gameId) {
    const favorites = new Set(this.favorites());
    favorites.has(gameId) ? favorites.delete(gameId) : favorites.add(gameId);
    const next = [...favorites]; write('favorites', next); return next.includes(gameId);
  },
  rememberPlay(gameId) {
    const recent = read('recent', []).filter((id) => id !== gameId);
    write('recent', [gameId, ...recent].slice(0, 12));
  },
};

