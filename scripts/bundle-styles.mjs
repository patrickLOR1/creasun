import fs from 'node:fs';
import crypto from 'node:crypto';
const files = ['styles.css','animations.css','choreography.css','immersive.css','accessible.css','motion.css','studio.css','concept.css'];
const css = files.map(file => fs.readFileSync(`dist/${file}`, 'utf8')).join('\n');
const hash = crypto.createHash('sha256').update(css).digest('hex').slice(0, 12);
// Keep authoring files separate; serve one stylesheet in their original cascade order.
fs.writeFileSync('dist/site.css', css);
const html = fs.readFileSync('dist/index.html','utf8');
const links = /  <link rel="stylesheet" href="(?:styles|animations|choreography|immersive|accessible|site)\.css(?:\?v=[a-f0-9]+)?">\r?\n/g;
let first = true;
fs.writeFileSync('dist/index.html', html.replace(links, () => {
  if (!first) return '';
  first = false;
  return `  <link rel="stylesheet" href="site.css?v=${hash}">\n`;
}));
console.log(`Stylesheets: ${files.length} → 1 (${Buffer.byteLength(css)} bytes, version ${hash})`);
