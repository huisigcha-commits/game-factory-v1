import { categories } from '../src/data/categories.js';
import { gameRegistry } from '../src/data/gameRegistry.js';

const required = ['id', 'slug', 'title', 'shortDescription', 'description', 'category', 'tags', 'engineType', 'gameVersion', 'desktopControls', 'mobileControls', 'orientation', 'difficulty', 'averagePlayTime', 'seoTitle', 'seoDescription', 'relatedGames', 'status', 'releaseDate', 'updatedDate'];
const categoryIds = new Set(categories.map((category) => category.id));
const slugs = new Set();
const ids = new Set();
const errors = [];

for (const game of gameRegistry) {
  for (const field of required) if (!(field in game)) errors.push(`${game.slug}: missing ${field}`);
  if (ids.has(game.id)) errors.push(`${game.slug}: duplicate id ${game.id}`);
  if (slugs.has(game.slug)) errors.push(`${game.slug}: duplicate slug`);
  if (!categoryIds.has(game.category)) errors.push(`${game.slug}: unknown category ${game.category}`);
  ids.add(game.id); slugs.add(game.slug);
}
for (const game of gameRegistry) for (const slug of game.relatedGames) if (!slugs.has(slug)) errors.push(`${game.slug}: unknown related game ${slug}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Registry valid: ${gameRegistry.length} games, ${categories.length} categories.`);

