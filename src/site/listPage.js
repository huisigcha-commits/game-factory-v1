import { gameRegistry } from '../data/gameRegistry.js';
import { categories } from '../data/categories.js';
import { playerStore } from '../core/storage.js';

const root = document.querySelector('#listing');
const view = document.body.dataset.view;
const category = document.body.dataset.category;
const playable = gameRegistry.filter((game) => game.status !== 'planned');
const categoryInfo = categories.find((item) => item.id === category);
const titles = {
  games: ['All Games', '현재 플레이 가능한 모든 게임입니다.'],
  new: ['New Games', '최근 추가된 게임을 먼저 만나보세요.'],
  popular: ['Popular Games', '대표 게임부터 새 기록에 도전해 보세요.'],
  favorites: ['Favorites', '즐겨찾기는 이 브라우저에만 저장됩니다.'],
  category: [categoryInfo?.label || 'Category', categoryInfo?.description || ''],
};

const games = view === 'favorites' ? playable.filter((game) => playerStore.favorites().includes(game.id))
  : view === 'category' ? playable.filter((game) => game.category === category)
    : view === 'new' ? playable.filter((game) => game.new)
      : view === 'popular' ? playable.filter((game) => game.popular || game.featured)
        : playable;
const [title, description] = titles[view] || titles.games;
const card = (game) => `<article class="game-card"><div class="game-art art-${game.category}" aria-hidden="true"><span>${game.id}</span><small>${game.category}</small></div><div class="game-card-body"><p class="eyebrow">${game.category}</p><h3>${game.title}</h3><p>${game.shortDescription}</p><div class="card-actions"><a class="play-link" href="/games/${game.slug}/">Play <span aria-hidden="true">→</span></a></div></div></article>`;

root.innerHTML = `<section class="listing-hero"><a class="back-link" href="/">← Home</a><p class="eyebrow">GAME FACTORY · ${games.length} GAMES</p><h1>${title}</h1><p>${description}</p><nav class="listing-nav" aria-label="게임 탐색"><a href="/games/">전체</a><a href="/new/">새 게임</a><a href="/popular/">대표 게임</a><a href="/favorites/">즐겨찾기</a></nav></section><section class="game-grid">${games.length ? games.map(card).join('') : '<p class="empty-state">표시할 게임이 아직 없습니다. 홈에서 ♡를 눌러 즐겨찾기를 추가해 보세요.</p>'}</section>`;
