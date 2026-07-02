const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publishDir = path.join(rootDir, 'public');
const indexFile = path.join(publishDir, 'index.html');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(publishDir)) {
  fail('Missing public/ directory. Netlify must publish the static site from public/.');
}

if (!fs.existsSync(indexFile)) {
  fail('Missing public/index.html. Netlify cannot deploy the site without a homepage.');
}

console.log('Static site verified: public/index.html is present and ready for Netlify.');