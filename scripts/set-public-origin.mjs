import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Run once the final public domain is known, before publishing on Vercel.
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/set-public-origin.mjs https://your-domain.com');
const url = new URL(input);
if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
  throw new Error('Provide only an HTTPS origin, without a path, query, or credentials.');
}
const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const html = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
const previous = new URL(canonical).origin;
for (const filename of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const target = path.join(directory, filename);
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replaceAll(previous, url.origin));
}
console.log(`Canonical, social metadata, organization URLs and sitemap updated to ${url.origin}`);
