import { gameBySlug, gameRegistry } from '../data/gameRegistry.js';
import { track } from '../core/analytics.js';
import { createGameSdk } from '../core/gameSdk.js';
import { playerStore } from '../core/storage.js';

const game = gameBySlug(document.body.dataset.game);
const root = document.querySelector('#game-detail');
const moduleBySlug = {
  'orbit-tap': 'orbitTap', 'perfect-drop': 'perfectDrop', 'number-fold': 'numberFold',
  'merge-garden': 'mergeGarden', 'lane-dodge': 'laneDodge', 'memory-grid': 'memoryGrid',
};

function relatedCard(item) {
  return `<a class="related-card" href="/games/${item.slug}/"><span>${item.category}</span><strong>${item.title}</strong><small>${item.averagePlayTime}</small><b aria-hidden="true">→</b></a>`;
}

if (!game) {
  root.innerHTML = '<p class="empty-state">게임을 찾을 수 없습니다.</p>';
} else {
  let instance;
  const sdk = createGameSdk({ game, onEvent: track });
  const related = gameRegistry.filter((item) => item.status !== 'planned' && item.id !== game.id && item.category === game.category).slice(0, 3);
  document.title = game.seoTitle;
  const render = () => {
    const favorite = playerStore.favorites().includes(game.id);
    root.innerHTML = `<a class="back-link" href="/">← 모든 게임</a><section class="detail-hero"><div><p class="eyebrow">${game.category} · ${game.averagePlayTime}</p><h1>${game.title}</h1><p>${game.description}</p></div><button class="detail-favorite" type="button" data-favorite aria-pressed="${favorite}">${favorite ? '♥ 즐겨찾기됨' : '♡ 즐겨찾기에 추가'}</button></section><section class="game-stage" aria-label="${game.title} 게임 영역"><div class="game-toolbar"><div><span>Score</span><strong id="score" aria-live="polite">0</strong></div><div><span>Best</span><strong id="best" aria-live="polite">${playerStore.bestScore(game.id)}</strong></div><div class="game-actions"><button class="play-button" data-start>Play</button><button class="secondary-button" data-restart>Restart</button><button class="icon-button" type="button" data-fullscreen aria-label="게임 화면 크게 보기" title="전체 화면">↗</button></div></div><div id="game-host" class="game-host" tabindex="-1"></div></section><aside class="safe-ad-zone detail-ad"><span>SAFE AD ZONE</span><p>게임 조작 영역에서 분리된 광고 영역</p></aside><section class="game-information"><div><h2>How to play</h2><p>${game.shortDescription}</p></div><div><h2>Controls</h2><p><b>Desktop</b> ${game.desktopControls.join(' · ')}<br><b>Mobile</b> ${game.mobileControls.join(' · ')}</p></div><div><h2>Difficulty</h2><p>${game.difficulty}</p></div></section><section class="related-section"><p class="eyebrow">KEEP PLAYING</p><h2>${game.category} 게임 더 보기</h2><div class="related-grid">${related.map(relatedCard).join('')}</div></section>`;
    bind();
  };
  const setLoading = (loading) => {
    const host = document.querySelector('#game-host');
    host?.setAttribute('aria-busy', String(loading));
    document.querySelectorAll('[data-start], [data-restart]').forEach((button) => { button.disabled = loading; });
  };
  const showLoadError = () => {
    const host = document.querySelector('#game-host');
    if (host) host.innerHTML = '<p class="game-load-error" role="alert">게임을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
  };
  const load = async () => {
    setLoading(true);
    try {
      instance?.destroy();
      const file = moduleBySlug[game.slug] || 'miniGames';
      const { mountGame } = await import(`../games/${file}.js`);
      instance = mountGame({ container: document.querySelector('#game-host'), sdk, game, onScore: (value) => {
        document.querySelector('#score').textContent = value;
        document.querySelector('#best').textContent = sdk.setScore(value);
      }});
      return true;
    } catch (error) {
      console.error('Unable to load game', error);
      track('game_load_error', { game_id: game.id });
      showLoadError();
      return false;
    } finally {
      setLoading(false);
    }
  };
  const bind = () => {
    document.querySelector('[data-start]').onclick = async () => { if (await load()) instance?.start(); };
    document.querySelector('[data-restart]').onclick = async () => { if (await load()) instance?.restart(); };
    document.querySelector('[data-fullscreen]').onclick = async () => {
      const stage = document.querySelector('.game-stage');
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await stage?.requestFullscreen();
      } catch (error) {
        console.warn('Fullscreen is unavailable', error);
      }
    };
    document.querySelector('[data-favorite]').onclick = () => { instance?.destroy(); instance = undefined; const active = playerStore.toggleFavorite(game.id); track('favorite_add', { game_id: game.id, active }); render(); };
  };
  render();
  track('game_view', { game_id: game.id });
  window.addEventListener('beforeunload', () => { instance?.destroy(); sdk.destroy(); }, { once: true });
}
