import { playerStore } from './storage.js';

export function createGameSdk({ game, onEvent = () => {} }) {
  const cleanups = new Set();
  let firstAction = false;
  let paused = document.hidden;

  const event = (name, params = {}) => onEvent(name, { game_id: game.id, game_slug: game.slug, ...params });
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.add(() => target.removeEventListener(type, handler, options));
  };
  const timeout = (handler, delay) => {
    const id = window.setTimeout(handler, delay);
    cleanups.add(() => window.clearTimeout(id));
    return id;
  };

  const visibility = () => {
    const nextPaused = document.hidden;
    if (paused === nextPaused) return;
    paused = nextPaused;
    event(paused ? 'game_pause' : 'game_resume');
  };
  listen(document, 'visibilitychange', visibility);

  return Object.freeze({
    event,
    listen,
    timeout,
    firstAction() { if (!firstAction) { firstAction = true; event('game_first_action'); } },
    setScore(score) { return playerStore.setBestScore(game.id, score); },
    bestScore() { return playerStore.bestScore(game.id); },
    rememberPlay() { playerStore.rememberPlay(game.id); },
    destroy() { for (const cleanup of cleanups) cleanup(); cleanups.clear(); },
  });
}

