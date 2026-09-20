import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gameRegistry } from '../src/data/gameRegistry.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const prototypes = gameRegistry.filter((game) => game.status === 'prototype');
const errors = [];
if (gameRegistry.length !== 30) errors.push(`Registry must contain 30 games; found ${gameRegistry.length}.`);
if (prototypes.length !== 5) errors.push(`Expected 5 representative prototypes; found ${prototypes.length}.`);
for (const game of prototypes) if (!existsSync(`${root}games/${game.slug}/index.html`)) errors.push(`${game.slug}: missing game detail page.`);
for (const page of ['games','new','popular','favorites']) if (!existsSync(`${root}${page}/index.html`)) errors.push(`${page}: missing listing page.`);
for (const page of ['about','contact','privacy','terms']) if (!existsSync(`${root}${page}/index.html`)) errors.push(`${page}: missing trust page.`);
for (const category of ['skill','puzzle','merge','arcade','idle','brain']) if (!existsSync(`${root}category/${category}/index.html`)) errors.push(`${category}: missing category page.`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`QA structure passed: ${gameRegistry.length} registry entries, ${prototypes.length} playable prototypes.`);
