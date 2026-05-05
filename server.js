const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT || 5000);
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const COMPRESSIBLE = new Set([
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'application/json',
  'image/svg+xml',
  'text/plain'
]);

const CACHE_CONTROL = {
  '.jpg': 'public, max-age=2592000',
  '.jpeg': 'public, max-age=2592000',
  '.png': 'public, max-age=2592000',
  '.gif': 'public, max-age=2592000',
  '.webp': 'public, max-age=2592000',
  '.svg': 'public, max-age=86400',
  '.css': 'public, max-age=86400',
  '.js': 'public, max-age=86400',
  '.html': 'no-store, no-cache, must-revalidate',
  '.ico': 'public, max-age=604800'
};

function resolveFilePath(requestUrl) {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  } catch (error) {
    return null;
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  } else if (pathname === '/') {
    pathname = '/index.html';
  }

  const absolutePath = path.resolve(PUBLIC_DIR, '.' + pathname);
  const relativePath = path.relative(PUBLIC_DIR, absolutePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  return absolutePath;
}

function getMimeType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function sendNotFound(response) {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Not Found');
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.end('Method Not Allowed');
    return;
  }

  const filePath = resolveFilePath(request.url || '/');

  if (!filePath) {
    sendNotFound(response);
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendNotFound(response);
      return;
    }

    const mimeType = getMimeType(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const cacheControl = CACHE_CONTROL[ext] || 'no-store, no-cache, must-revalidate';
    const acceptEncoding = request.headers['accept-encoding'] || '';
    const compressible = COMPRESSIBLE.has(mimeType.split(';')[0]);

    fs.readFile(filePath, (readError, fileContents) => {
      if (readError) {
        response.statusCode = 500;
        response.end('Internal Server Error');
        return;
      }

      response.setHeader('Cache-Control', cacheControl);
      response.setHeader('Vary', 'Accept-Encoding');

      if (ext === '.html' || ext === '') {
        response.setHeader('Pragma', 'no-cache');
      }

      if (compressible && acceptEncoding.includes('gzip')) {
        const compressed = zlib.gzipSync(fileContents, { level: 6 });
        response.statusCode = 200;
        response.setHeader('Content-Type', mimeType);
        response.setHeader('Content-Encoding', 'gzip');
        response.setHeader('Content-Length', compressed.length);
        response.end(request.method === 'HEAD' ? undefined : compressed);
        return;
      }

      response.statusCode = 200;
      response.setHeader('Content-Type', mimeType);
      response.setHeader('Content-Length', fileContents.length);
      response.end(request.method === 'HEAD' ? undefined : fileContents);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Serving ${PUBLIC_DIR} at http://${HOST}:${PORT}`);
});