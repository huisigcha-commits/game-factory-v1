import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { categories } from '../src/data/categories.js';
import { gameRegistry, gameBySlug, publicGames } from '../src/data/gameRegistry.js';

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
