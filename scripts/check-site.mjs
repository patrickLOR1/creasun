import fs from 'node:fs';
import assert from 'node:assert/strict';
const html = fs.readFileSync('dist/index.html', 'utf8');
assert.equal((html.match(/<h1>/g) || []).length, 1);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema['@type'], 'Organization');
const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
assert.ok(fs.readFileSync('dist/sitemap.xml','utf8').includes(`<loc>${canonical}</loc>`));
assert.ok(fs.readFileSync('dist/robots.txt','utf8').includes(`${canonical}sitemap.xml`));
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(?:https?:|mailto:|tel:)/.test(match[1])) continue;
  assert.ok(fs.existsSync(`dist/${match[1].split('?')[0]}`), `Missing asset ${match[1]}`);
}
assert.equal((html.match(/<details(?: open)?>/g) || []).length, 5);
console.log('PASS: one H1, valid JSON-LD, consistent canonical/sitemap/robots, local assets and visible FAQ.');
