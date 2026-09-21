import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gameRegistry } from '../src/data/gameRegistry.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const prototypes = gameRegistry.filter((game) => game.status === 'prototype');
const errors = [];
if (gameRegistry.length !== 30) errors.push(`Registry must contain 30 games; found ${gameRegistry.length}.`);
if (prototypes.length !== 30) errors.push(`Expected 30 playable games; found ${prototypes.length}.`);
const pagePaths = [
  'index.html',
  ...prototypes.map((game) => `games/${game.slug}/index.html`),
  ...['games','new','popular','favorites','about','contact','privacy','terms'].map((page) => `${page}/index.html`),
  ...['skill','puzzle','merge','arcade','idle','brain'].map((category) => `category/${category}/index.html`),
];
for (const pagePath of pagePaths) {
  const absolutePath = `${root}${pagePath}`;
  if (!existsSync(absolutePath)) { errors.push(`${pagePath}: missing page.`); continue; }
  const pageUrl = new URL(`../${pagePath}`, import.meta.url);
  const sourceReferences = [...readFileSync(absolutePath, 'utf8').matchAll(/(?:src|href)="([^\"]*src\/site\/[^\"]+)"/g)].map((match) => match[1]);
  for (const reference of sourceReferences) if (!existsSync(fileURLToPath(new URL(reference, pageUrl)))) errors.push(`${pagePath}: missing asset ${reference}.`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`QA structure passed: ${gameRegistry.length} registry entries, ${prototypes.length} playable prototypes.`);
