import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root='dist/explora',html=fs.readFileSync(`${root}/index.html`,'utf8');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'One main heading');
assert.equal((html.match(/data-story-copy="\d"/g)||[]).length,5,'Five chapters');
assert.match(html,/name="robots" content="noindex"/,'Prototype is not indexed');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^(?:https?:|mailto:)/.test(m[1]))continue;
  const asset=m[1].split('#')[0].split('?')[0];
  assert.ok(fs.existsSync(path.resolve(root,asset)),`Missing ${asset}`);
}
for(const name of ['vessel-480.webp','vessel-960.webp','office-800.webp','office-1600.webp','coast-800.webp','coast-1600.webp'])assert.ok(fs.statSync(`${root}/assets/${name}`).size>0,name);
assert.match(fs.readFileSync(`${root}/story.css`,'utf8'),/prefers-reduced-motion/);
console.log('PASS: five story chapters, one H1, prototype noindex, local links/assets, reduced-motion styles.');
