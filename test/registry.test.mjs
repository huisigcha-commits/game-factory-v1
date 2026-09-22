import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { categories } from '../src/data/categories.js';
import { gameRegistry, gameBySlug, publicGames } from '../src/data/gameRegistry.js';
import { miniGameConfigs } from '../src/games/miniGames.js';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the launch catalog has 30 unique playable games', () => {
  assert.equal(gameRegistry.length, 30);
  assert.equal(new Set(gameRegistry.map((game) => game.id)).size, 30);
  assert.equal(new Set(gameRegistry.map((game) => game.slug)).size, 30);
  assert.ok(gameRegistry.every((game) => game.status === 'prototype' || game.status === 'published'));
  assert.equal(publicGames().length, 30);
});

test('every category has five playable games and game pages', () => {
  for (const category of categories) {
    const games = gameRegistry.filter((game) => game.category === category.id);
    assert.equal(games.length, 5, `${category.id} must have five games`);
    for (const game of games) {
      const pagePath = `${root}games/${game.slug}/index.html`;
      assert.ok(existsSync(pagePath), `${game.slug} page is missing`);
      const page = readFileSync(pagePath, 'utf8');
      assert.match(page, /rel="canonical"/);
      assert.match(page, /application\/ld\+json/);
    }
  }
});

test('lookup works for every registered slug and rejects unknown games', () => {
  for (const game of gameRegistry) assert.equal(gameBySlug(game.slug)?.id, game.id);
  assert.equal(gameBySlug('not-a-game'), undefined);
});

test('every shared-engine game has a valid game mode and instruction', () => {
  const dedicatedGames = new Set(['orbit-tap', 'perfect-drop', 'number-fold', 'merge-garden', 'lane-dodge', 'memory-grid']);
  const sharedGames = gameRegistry.filter((game) => !dedicatedGames.has(game.slug));
  assert.equal(sharedGames.length, 24);
  assert.deepEqual(Object.keys(miniGameConfigs).sort(), sharedGames.map((game) => game.slug).sort());
  for (const game of sharedGames) {
    const [mode, instruction] = miniGameConfigs[game.slug];
    assert.ok(['timing', 'puzzle', 'merge', 'dodge', 'idle', 'quiz'].includes(mode), `${game.slug} has an unsupported mode`);
    assert.ok(instruction.length > 5, `${game.slug} needs a player instruction`);
  }
});

test('the generated sitemap includes discovery and trust routes', () => {
  const sitemap = readFileSync(`${root}sitemap.xml`, 'utf8');
  const expectedPaths = ['/', '/games/', '/new/', '/popular/', '/favorites/', '/about/', '/contact/', '/privacy/', '/terms/'];
  for (const path of expectedPaths) assert.match(sitemap, new RegExp(`<loc>https://YOUR-DOMAIN\\.example${path}`));
  for (const category of categories) assert.match(sitemap, new RegExp(`/category/${category.id}/`));
  assert.equal((sitemap.match(/<url>/g) || []).length, 45);
});

test('category pages use their two-level asset paths', () => {
  for (const category of categories) {
    const page = readFileSync(`${root}category/${category.id}/index.html`, 'utf8');
    assert.match(page, /\.\.\/\.\.\/src\/site\/styles\.css/);
    assert.match(page, /\.\.\/\.\.\/src\/site\/listPage\.js/);
  }
});
