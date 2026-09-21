import { mkdirSync, writeFileSync } from 'node:fs';
import { categories } from '../src/data/categories.js';

const root = new URL('../', import.meta.url);
const shell = ({ title, attributes, script, depth }) => {
  const prefix = '../'.repeat(depth);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | GAME FACTORY</title><link rel="stylesheet" href="${prefix}src/site/styles.css"></head><body ${attributes}><a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="site-header"><a class="brand" href="/" aria-label="GAME FACTORY 홈">GAME<span>FACTORY</span></a><nav aria-label="주 메뉴"><a href="/games/">게임</a><a href="/new/">새 게임</a><a href="/favorites/">즐겨찾기</a></nav></header><main id="main"></main><footer class="site-footer"><p>© GAME FACTORY · 개발 중인 임시 명칭입니다.</p><nav aria-label="푸터 메뉴"><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer><script type="module" src="${prefix}src/site/${script}.js"></script></body></html>\n`;
};

const listingPages = [
  ['games', 'All Games', 'data-view="games"'], ['new', 'New Games', 'data-view="new"'],
  ['popular', 'Popular Games', 'data-view="popular"'], ['favorites', 'Favorites', 'data-view="favorites"'],
];
for (const [path, title, attributes] of listingPages) {
  mkdirSync(new URL(`${path}/`, root), { recursive: true });
  writeFileSync(new URL(`${path}/index.html`, root), shell({ title, attributes, script: 'listPage', depth: 1 }));
}
for (const category of categories) {
  const directory = new URL(`category/${category.id}/`, root);
  mkdirSync(directory, { recursive: true });
  writeFileSync(new URL('index.html', directory), shell({ title: category.label, attributes: `data-view="category" data-category="${category.id}"`, script: 'listPage', depth: 2 }));
}
for (const [path, title] of [['about', 'About'], ['contact', 'Contact'], ['privacy', 'Privacy'], ['terms', 'Terms']]) {
  mkdirSync(new URL(`${path}/`, root), { recursive: true });
  writeFileSync(new URL('index.html', new URL(`${path}/`, root)), shell({ title, attributes: `data-page="${path}"`, script: 'staticPage', depth: 1 }));
}
console.log(`Site pages generated: ${listingPages.length + categories.length + 4}.`);
