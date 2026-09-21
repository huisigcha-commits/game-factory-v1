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
    root.innerHTML = `<a class="back-link" href="/">← 모든 게임</a><section class="detail-hero"><div><p class="eyebrow">${game.category} · ${game.averagePlayTime}</p><h1>${game.title}</h1><p>${game.description}</p></div><button class="detail-favorite" type="button" data-favorite aria-pressed="${favorite}">${favorite ? '♥ 즐겨찾기됨' : '♡ 즐겨찾기에 추가'}</button></section><section class="game-stage"><div class="game-toolbar"><div><span>Score</span><strong id="score">0</strong></div><div><span>Best</span><strong id="best">${playerStore.bestScore(game.id)}</strong></div><div class="game-actions"><button class="play-button" data-start>Play</button><button class="secondary-button" data-restart>Restart</button></div></div><div id="game-host" class="game-host"></div></section><aside class="safe-ad-zone detail-ad"><span>SAFE AD ZONE</span><p>게임 조작 영역에서 분리된 광고 영역</p></aside><section class="game-information"><div><h2>How to play</h2><p>${game.shortDescription}</p></div><div><h2>Controls</h2><p><b>Desktop</b> ${game.desktopControls.join(' · ')}<br><b>Mobile</b> ${game.mobileControls.join(' · ')}</p></div><div><h2>Difficulty</h2><p>${game.difficulty}</p></div></section><section class="related-section"><p class="eyebrow">KEEP PLAYING</p><h2>${game.category} 게임 더 보기</h2><div class="related-grid">${related.map(relatedCard).join('')}</div></section>`;
    bind();
  };
  const load = async () => {
    instance?.destroy();
    const file = moduleBySlug[game.slug] || 'miniGames';
    const { mountGame } = await import(`../games/${file}.js`);
    instance = mountGame({ container: document.querySelector('#game-host'), sdk, game, onScore: (value) => {
      document.querySelector('#score').textContent = value;
      document.querySelector('#best').textContent = sdk.setScore(value);
    }});
  };
  const bind = () => {
    document.querySelector('[data-start]').onclick = async () => { await load(); instance?.start(); };
    document.querySelector('[data-restart]').onclick = async () => { await load(); instance?.restart(); };
    document.querySelector('[data-favorite]').onclick = () => { instance?.destroy(); instance = undefined; const active = playerStore.toggleFavorite(game.id); track('favorite_add', { game_id: game.id, active }); render(); };
  };
  render();
  track('game_view', { game_id: game.id });
  window.addEventListener('beforeunload', () => { instance?.destroy(); sdk.destroy(); }, { once: true });
}
