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

// Simple in-memory rate limiter (per-IP)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 200; // max requests per window
const rateMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count++;
  }
  rateMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

// Graceful crash handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // in production consider logging and alerting, then exit
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

function resolveFilePath(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  } catch (error) {
    return null;
  }

  if (pathname.endsWith('/')) pathname += 'index.html';
  else if (pathname === '/') pathname = '/index.html';

  const absolutePath = path.resolve(PUBLIC_DIR, '.' + pathname);
  const relativePath = path.relative(PUBLIC_DIR, absolutePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) return null;
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

// Small helper to set secure headers
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=()');
  // Allow images from same origin and https sources; adjust for production needs
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; object-src 'none'; frame-ancestors 'none';");
  // HSTS - only effective when serving over HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

const server = http.createServer((request, response) => {
  // Basic method filtering
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.end('Method Not Allowed');
    return;
  }

  // Limit URL length to avoid abuses
  if ((request.url || '').length > 2048) {
    response.statusCode = 414; response.end('Request-URI Too Long'); return;
  }

  const ip = request.socket.remoteAddress || request.headers['x-forwarded-for'] || 'unknown';
  if (isRateLimited(ip)) {
    response.statusCode = 429; response.setHeader('Retry-After', '60'); response.end('Too Many Requests'); return;
  }

  const filePath = resolveFilePath(request.url || '/');
  if (!filePath) { sendNotFound(response); return; }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) { sendNotFound(response); return; }

    // Reject huge files
    const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB
    if (stats.size > MAX_FILE_BYTES) { response.statusCode = 413; response.end('File too large'); return; }

    const mimeType = getMimeType(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const cacheControl = CACHE_CONTROL[ext] || 'no-store, no-cache, must-revalidate';
    const acceptEncoding = request.headers['accept-encoding'] || '';
    const compressible = COMPRESSIBLE.has(mimeType.split(';')[0]);

    // Security headers
    setSecurityHeaders(response);
    response.setHeader('Cache-Control', cacheControl);
    response.setHeader('Vary', 'Accept-Encoding');
    if (ext === '.html' || ext === '') response.setHeader('Pragma', 'no-cache');

    response.statusCode = 200;
    response.setHeader('Content-Type', mimeType);

    // Stream the file; use gzip stream when appropriate
    let stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
      console.error('Stream error', err);
      if (!response.headersSent) response.statusCode = 500;
      try { response.end('Internal Server Error'); } catch (e) {}
    });

    if (compressible && acceptEncoding.includes('gzip')) {
      response.setHeader('Content-Encoding', 'gzip');
      // don't set Content-Length when compressing; use chunked transfer
      const gzip = zlib.createGzip({ level: 6 });
      stream.pipe(gzip).pipe(response);
    } else {
      response.setHeader('Content-Length', stats.size);
      if (request.method === 'HEAD') { response.end(); stream.destroy(); return; }
      stream.pipe(response);
    }
  });
});

// reasonable server timeout
server.setTimeout(2 * 60 * 1000);

server.listen(PORT, HOST, () => {
  console.log(`Serving ${PUBLIC_DIR} at http://${HOST}:${PORT}`);
});

// periodic cleanup of rateMap to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap.entries()) {
    if (now - entry.start > RATE_LIMIT_WINDOW_MS * 5) rateMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS);
