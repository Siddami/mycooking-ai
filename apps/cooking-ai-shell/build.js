const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, '../../dist/apps/cooking-ai-shell');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.copyFileSync(
  path.join(srcDir, 'index.html'),
  path.join(distDir, 'index.html')
);

console.log('Shell app built successfully!');