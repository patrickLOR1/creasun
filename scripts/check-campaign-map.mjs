import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync('dist/index.html','utf8');
assert.ok(!html.includes('id="orbit"'),'Landing must not contain the old carousel');
assert.ok(!html.includes('src="explora/explora.js"'),'Old carousel script must not load on landing');
for(const key of ['summer','neutral','halloween','christmas']){
  assert.ok(html.includes('data-node="'+key+'"'),'Missing map node '+key);
  assert.ok(html.includes('data-line="'+key+'"'),'Missing connection '+key);
  assert.ok(html.includes('data-map-detail="'+key+'"'),'Missing options '+key);
}
assert.ok(html.includes('id="map-brand"'));
assert.ok(html.includes('id="campaign-products"'));
console.log('PASS: campaign map replaces carousel, four connected collections and quote context retained.');
