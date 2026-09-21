import { categories } from '../data/categories.js';
import { gameRegistry } from '../data/gameRegistry.js';
import { playerStore } from '../core/storage.js';
import { track } from '../core/analytics.js';

const main = document.querySelector('#main');
let selectedCategory = 'all';
let query = '';
const playableGames = gameRegistry.filter((game) => game.status !== 'planned');

function gameCard(game) {
  const favorite = playerStore.favorites().includes(game.id);
  return `<article class="game-card" data-game="${game.id}">
    <div class="game-art art-${game.category}" aria-hidden="true"><span>${game.id}</span><small>${game.category}</small></div>
    <div class="game-card-body"><p class="eyebrow">${game.category}</p><h3>${game.title}</h3><p>${game.shortDescription}</p>
      <div class="card-actions"><a class="play-link" href="games/${game.slug}/" data-game-open="${game.slug}">Play <span aria-hidden="true">→</span></a>
      <button class="favorite-button" type="button" data-favorite="${game.id}" aria-pressed="${favorite}" aria-label="${game.title} 즐겨찾기">${favorite ? '♥' : '♡'}</button></div>
    </div></article>`;
}

function matchingGames() {
  const normalizedQuery = query.trim().toLowerCase();
  return playableGames.filter((game) => (selectedCategory === 'all' || game.category === selectedCategory)
    && `${game.title} ${game.shortDescription} ${game.tags.join(' ')}`.toLowerCase().includes(normalizedQuery));
}

function libraryGames(ids) {
  return ids.map((id) => playableGames.find((game) => game.id === id)).filter(Boolean);
}

function render() {
  const featured = playableGames.filter((game) => game.featured);
  const games = matchingGames();
  const recent = libraryGames(playerStore.recent());
  const favorites = libraryGames(playerStore.favorites());
  const recentSection = recent.length ? `<section class="library-section"><div class="section-heading"><div><p class="eyebrow">CONTINUE PLAYING</p><h2>방금 하던 게임</h2></div><p>이 브라우저에서 최근 플레이한 게임입니다.</p></div><div class="game-grid">${recent.map(gameCard).join('')}</div></section>` : '';
  main.innerHTML = `<section class="hero">
    <div><p class="eyebrow hero-label">BROWSER GAMES · NO INSTALL</p><h1>Play now.<br><em>Stay curious.</em></h1>
      <p class="hero-copy">짧은 한 판부터 오래 파고드는 기록 도전까지. 설치 없이, 바로 시작하세요.</p>
      <div class="hero-actions"><a class="primary-action" href="#games">게임 둘러보기 <span aria-hidden="true">↓</span></a><button class="random-action" type="button" data-random-game>랜덤 게임 <span aria-hidden="true">↗</span></button><a class="text-action" href="games/">전체 게임 보기</a></div>
      <dl class="hero-stats"><div><dt>${playableGames.length}</dt><dd>PLAYABLE GAMES</dd></div><div><dt>${categories.length}</dt><dd>CATEGORIES</dd></div><div><dt>0</dt><dd>INSTALLS NEEDED</dd></div></dl>
    </div>
    <aside class="hero-panel"><p>NEXT UP</p><strong>${featured[0].title}</strong><span>${featured[0].averagePlayTime} · ${featured[0].difficulty}</span><a href="games/${featured[0].slug}/">Play now →</a></aside>
  </section>
  <section id="new" class="feature-section"><div class="section-heading"><div><p class="eyebrow">START HERE</p><h2>대표 게임 5종</h2></div><p>각기 다른 조작과 규칙을 가진 게임으로 GAME FACTORY를 시작해 보세요.</p></div>
    <div class="featured-grid">${featured.map(gameCard).join('')}</div></section>
  <aside class="safe-ad-zone" aria-label="광고 영역"><span>SAFE AD ZONE</span><p>게임 조작과 분리된 광고 영역</p></aside>
  ${recentSection}
  <section id="games" class="catalog-section"><div class="section-heading"><div><p class="eyebrow">GAME CATALOG</p><h2>무엇을 플레이할까요?</h2></div><label class="search"><span aria-hidden="true">⌕</span><input id="game-search" type="search" placeholder="제목·태그로 게임 찾기" value="${query}" /></label></div>
    <div class="filters" role="group" aria-label="게임 카테고리"><button class="${selectedCategory === 'all' ? 'is-active' : ''}" data-category="all">전체 <small>${playableGames.length}</small></button>${categories.map((category) => `<button class="${selectedCategory === category.id ? 'is-active' : ''}" data-category="${category.id}">${category.label} <small>${playableGames.filter((game) => game.category === category.id).length}</small></button>`).join('')}</div>
    <p class="result-count" aria-live="polite">${games.length}개 게임</p><div class="game-grid">${games.length ? games.map(gameCard).join('') : '<p class="empty-state">조건에 맞는 게임이 없습니다.</p>'}</div></section>
  <section id="favorites" class="favorites-section"><div class="section-heading"><div><p class="eyebrow">YOUR LIBRARY</p><h2>즐겨찾기</h2></div><p>회원가입 없이 이 브라우저에만 저장됩니다.</p></div>${favorites.length ? `<div class="game-grid">${favorites.map(gameCard).join('')}</div>` : '<p class="empty-state">마음에 드는 게임의 ♡를 누르면 이곳에 모입니다.</p>'}</section>`;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { selectedCategory = button.dataset.category; render(); }));
  document.querySelector('#game-search')?.addEventListener('input', (event) => { query = event.target.value; render(); document.querySelector('#game-search')?.focus(); });
  document.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => {
    const game = playableGames.find((item) => item.id === button.dataset.favorite);
    const active = playerStore.toggleFavorite(game.id); track('favorite_add', { game_id: game.id, active }); render();
  }));
  document.querySelectorAll('[data-game-open]').forEach((link) => link.addEventListener('click', () => track('game_view', { game_slug: link.dataset.gameOpen })));
  document.querySelector('[data-random-game]')?.addEventListener('click', () => {
    const game = playableGames[Math.floor(Math.random() * playableGames.length)];
    track('random_game_open', { game_id: game.id, game_slug: game.slug });
    window.location.assign(`games/${game.slug}/`);
  });
}

render();
