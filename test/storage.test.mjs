import test from 'node:test';
import assert from 'node:assert/strict';

const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
};

const { playerStore } = await import('../src/core/storage.js');

test('best score never decreases', () => {
  assert.equal(playerStore.setBestScore('G01', 12), 12);
  assert.equal(playerStore.setBestScore('G01', 4), 12);
  assert.equal(playerStore.bestScore('G01'), 12);
});

test('favorites can be added and removed', () => {
  assert.equal(playerStore.toggleFavorite('G02'), true);
  assert.deepEqual(playerStore.favorites(), ['G02']);
  assert.equal(playerStore.toggleFavorite('G02'), false);
  assert.deepEqual(playerStore.favorites(), []);
});

test('recent games are unique and retain the latest twelve entries', () => {
  for (let index = 1; index <= 13; index += 1) playerStore.rememberPlay(`G${index}`);
  playerStore.rememberPlay('G07');
  assert.equal(playerStore.recent().length, 12);
  assert.equal(playerStore.recent()[0], 'G07');
  assert.equal(playerStore.recent().includes('G01'), false);
});
