import { writeFileSync } from 'node:fs';
import { gameRegistry } from '../src/data/gameRegistry.js';
import { siteConfig } from '../src/data/siteConfig.js';

const base = (process.env.GAME_FACTORY_SITE_URL || siteConfig.siteUrl).replace(/\/$/, '');
const published = gameRegistry.filter((game) => game.status === 'prototype' || game.status === 'published');
const urls = ['/', ...published.map((game) => `/games/${game.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
writeFileSync(new URL('../sitemap.xml', import.meta.url), sitemap);
writeFileSync(new URL('../robots.txt', import.meta.url), robots);
console.log(`SEO generated: ${urls.length} URLs using ${siteConfig.siteUrl}.`);

