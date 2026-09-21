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
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug)) errors.push(`${game.slug}: invalid slug format`);
  if (!game.title.trim() || !game.shortDescription.trim() || !game.description.trim()) errors.push(`${game.slug}: missing player-facing copy`);
  if (!game.seoTitle.trim() || !game.seoDescription.trim()) errors.push(`${game.slug}: missing SEO copy`);
  if (!Array.isArray(game.tags) || game.tags.length < 2) errors.push(`${game.slug}: needs at least two tags`);
  if (!Array.isArray(game.desktopControls) || game.desktopControls.length === 0) errors.push(`${game.slug}: missing desktop controls`);
  if (!Array.isArray(game.mobileControls) || game.mobileControls.length === 0) errors.push(`${game.slug}: missing mobile controls`);
  if (game.engineType === 'pending' || game.orientation === 'pending' || game.difficulty === 'pending' || game.averagePlayTime === 'pending') errors.push(`${game.slug}: contains a placeholder game field`);
  if (!['prototype', 'published'].includes(game.status)) errors.push(`${game.slug}: is not playable`);
  ids.add(game.id); slugs.add(game.slug);
}
for (const game of gameRegistry) for (const slug of game.relatedGames) {
  if (!slugs.has(slug)) errors.push(`${game.slug}: unknown related game ${slug}`);
  if (slug === game.slug) errors.push(`${game.slug}: cannot relate to itself`);
}
for (const category of categories) if (gameRegistry.filter((game) => game.category === category.id).length !== 5) errors.push(`${category.id}: must contain five launch games`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Registry valid: ${gameRegistry.length} games, ${categories.length} categories.`);

