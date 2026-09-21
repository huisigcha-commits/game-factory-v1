import { mkdirSync, writeFileSync } from 'node:fs';
import { gameRegistry } from '../src/data/gameRegistry.js';
import { siteConfig } from '../src/data/siteConfig.js';

const root = new URL('../games/', import.meta.url);
const baseUrl = (process.env.GAME_FACTORY_SITE_URL || siteConfig.siteUrl).replace(/\/$/, '');
for (const game of gameRegistry.filter((item) => item.status === 'prototype' || item.status === 'published')) {
  const directory = new URL(`${game.slug}/`, root);
  mkdirSync(directory, { recursive: true });
  const canonical = `${baseUrl}/games/${game.slug}/`;
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'VideoGame', name: game.title, description: game.seoDescription, genre: game.category, gamePlatform: 'Web browser', url: canonical, inLanguage: siteConfig.locale });
  const page = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${game.seoDescription}"><link rel="canonical" href="${canonical}"><script type="application/ld+json">${schema}</script><link rel="stylesheet" href="../../src/site/styles.css"><title>${game.seoTitle}</title></head><body data-game="${game.slug}"><a class="skip-link" href="#game-detail">본문으로 건너뛰기</a><header class="site-header"><a class="brand" href="/" aria-label="GAME FACTORY 홈">GAME<span>FACTORY</span></a><nav aria-label="주 메뉴"><a href="/games/">게임</a><a href="/new/">새 게임</a><a href="/favorites/">즐겨찾기</a></nav></header><main id="game-detail"></main><footer class="site-footer"><p>© GAME FACTORY · 개발 중인 임시 명칭입니다.</p><nav aria-label="푸터 메뉴"><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer><script type="module" src="../../src/site/gamePage.js"></script></body></html>\n`;
  writeFileSync(new URL('index.html', directory), page);
}
console.log(`Game pages generated: ${gameRegistry.length}.`);
