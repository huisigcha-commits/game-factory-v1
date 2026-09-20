import { categories } from '../data/categories.js';
import { gameRegistry } from '../data/gameRegistry.js';
import { playerStore } from '../core/storage.js';
import { track } from '../core/analytics.js';

const main = document.querySelector('#main');
let selectedCategory = 'all';
let query = '';

function gameCard(game) {
  const favorite = playerStore.favorites().includes(game.id);
  return `<article class="game-card" data-game="${game.id}">
    <div class="game-art art-${game.category}" aria-hidden="true"><span>${game.id}</span></div>
    <div class="game-card-body"><p class="eyebrow">${game.category}</p><h3>${game.title}</h3><p>${game.shortDescription}</p>
      <div class="card-actions"><a class="play-link" href="games/${game.slug}/" data-game-open="${game.slug}">Play <span>→</span></a>
      <button class="favorite-button" type="button" data-favorite="${game.id}" aria-pressed="${favorite}" aria-label="${game.title} 즐겨찾기">${favorite ? '♥' : '♡'}</button></div>
    </div></article>`;
}

function visibleGames() {
  return gameRegistry.filter((game) => game.status !== 'planned' && (selectedCategory === 'all' || game.category === selectedCategory)
    && `${game.title} ${game.shortDescription} ${game.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
}

function render() {
  const featured = gameRegistry.filter((game) => game.featured);
  const games = visibleGames();
  main.innerHTML = `<section class="hero">
    <div><p class="eyebrow hero-label">BROWSER GAMES · NO INSTALL</p><h1>Play now.<br><em>Stay curious.</em></h1>
      <p class="hero-copy">짧은 한 판부터 오래 파고드는 기록 도전까지. 설치 없이, 바로 시작하세요.</p>
      <a class="primary-action" href="#games">게임 둘러보기 <span>↓</span></a></div>
    <aside class="hero-panel"><p>NEXT UP</p><strong>${featured[0].title}</strong><span>${featured[0].averagePlayTime}</span><a href="games/${featured[0].slug}/">Play prototype →</a></aside>
  </section>
  <section id="new" class="feature-section"><div class="section-heading"><div><p class="eyebrow">START HERE</p><h2>대표 게임 5종</h2></div><p>전체 30개 Registry 중 서로 다른 입력과 게임 규칙을 검증하는 첫 Factory 라인업입니다.</p></div>
    <div class="featured-grid">${featured.map(gameCard).join('')}</div></section>
  <aside class="safe-ad-zone" aria-label="광고 영역"><span>SAFE AD ZONE</span><p>게임 조작과 분리된 광고 영역</p></aside>
  <section id="games" class="catalog-section"><div class="section-heading"><div><p class="eyebrow">GAME CATALOG</p><h2>무엇을 플레이할까요?</h2></div><label class="search"><span>⌕</span><input id="game-search" type="search" placeholder="게임 찾기" value="${query}" /></label></div>
    <div class="filters" role="group" aria-label="게임 카테고리"><button class="${selectedCategory === 'all' ? 'is-active' : ''}" data-category="all">전체 <small>${gameRegistry.length}</small></button>${categories.map((category) => `<button class="${selectedCategory === category.id ? 'is-active' : ''}" data-category="${category.id}">${category.label} <small>${gameRegistry.filter((game) => game.category === category.id).length}</small></button>`).join('')}</div>
    <div class="game-grid">${games.length ? games.map(gameCard).join('') : '<p class="empty-state">조건에 맞는 게임이 없습니다.</p>'}</div></section>
  <section id="favorites" class="favorites-section"><p class="eyebrow">YOUR LIBRARY</p><h2>즐겨찾기는 이 기기에 저장됩니다.</h2><p>회원가입 없이도 자주 하는 게임과 최고 점수를 브라우저에 보관합니다.</p></section>`;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { selectedCategory = button.dataset.category; render(); }));
  document.querySelector('#game-search')?.addEventListener('input', (event) => { query = event.target.value; render(); document.querySelector('#game-search')?.focus(); });
  document.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => {
    const game = gameRegistry.find((item) => item.id === button.dataset.favorite);
    const active = playerStore.toggleFavorite(game.id); track('favorite_add', { game_id: game.id, active }); render();
  }));
  document.querySelectorAll('[data-game-open]').forEach((link) => link.addEventListener('click', () => track('game_view', { game_slug: link.dataset.gameOpen })));
}

render();
