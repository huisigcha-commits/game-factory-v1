import { gameRegistry } from '../data/gameRegistry.js';
import { categories } from '../data/categories.js';
import { playerStore } from '../core/storage.js';
const root=document.querySelector('#listing'),view=document.body.dataset.view,category=document.body.dataset.category;
const playable=gameRegistry.filter(game=>game.status!=='planned');
const titles={games:['All Games','현재 플레이 가능한 모든 게임입니다.'],new:['New Games','새로 공개한 게임을 먼저 만나보세요.'],popular:['Popular Games','인기 게임은 실제 플레이 데이터가 쌓인 뒤 표시됩니다.'],favorites:['Favorites','즐겨찾기는 이 브라우저에만 저장됩니다.'],category:[categories.find(item=>item.id===category)?.label||'Category',categories.find(item=>item.id===category)?.description||'']};
let games=view==='favorites'?playable.filter(game=>playerStore.favorites().includes(game.id)):view==='category'?playable.filter(game=>game.category===category):view==='popular'?playable.filter(game=>game.popular):playable;
const [title,description]=titles[view]||titles.games;const card=game=>`<article class="game-card"><div class="game-art art-${game.category}"><span>${game.id}</span></div><div class="game-card-body"><p class="eyebrow">${game.category}</p><h3>${game.title}</h3><p>${game.shortDescription}</p><div class="card-actions"><a class="play-link" href="/games/${game.slug}/">Play <span>→</span></a></div></div></article>`;
root.innerHTML=`<section class="listing-hero"><a class="back-link" href="/">← Home</a><p class="eyebrow">GAME FACTORY</p><h1>${title}</h1><p>${description}</p></section><section class="game-grid">${games.length?games.map(card).join(''):'<p class="empty-state">표시할 게임이 아직 없습니다.</p>'}</section>`;

