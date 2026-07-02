const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publishDir = path.join(rootDir, 'public');

const baseUrl = String(
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  process.env.DEPLOY_URL ||
  'https://YOUR-DOMAIN-HERE.com'
).replace(/\/$/, '');

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const today = new Date().toISOString().slice(0, 10);

writeFile(
  path.join(publishDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`
);

writeFile(
  path.join(publishDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${baseUrl}/</loc>\n` +
    `    <lastmod>${today}</lastmod>\n` +
    `    <changefreq>weekly</changefreq>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>\n`
);

console.log(`SEO files generated using base URL: ${baseUrl}`);