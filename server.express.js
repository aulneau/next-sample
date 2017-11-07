const express = require('express');
const next = require('next');
const LRUCache = require('lru-cache');

const {parse} = require('url');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dir: '.', dev});
const handle = app.getRequestHandler();
const {join} = require('path');


const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

app.prepare().then(() => {
  const server = express();

  server.use(
    '/service-worker.js',
    express.static(join(__dirname, '.next', '/service-worker.js'))
  );

  server.use('/static', express.static('static'));

  server.get('/', (req, res) => {
    renderAndCache(req, res, '/');
  });

  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);

    const rootStaticFiles = [
      '/robots.txt',
      '/manifest.json',
      '/sitemap.xml',
      '/android-chrome-192x192.png',
      '/apple-touch-icon-57x57.png',
      '/apple-touch-icon-60x60.png',
      '/apple-touch-icon-72x72.png',
      '/apple-touch-icon-76x76.png',
      '/apple-touch-icon-114x114.png',
      '/apple-touch-icon-120x120.png',
      '/apple-touch-icon-144x144.png',
      '/apple-touch-icon-152x152.png',
      '/apple-touch-icon-180x180.png',
      '/favicon-16x16.png',
      '/favicon-32x32.png',
      '/favicon-96x96.png',
      '/icon.png',
      '/largetile.png',
      '/mediumtile.png',
      '/smalltile.png',
      '/widetile.png',
      '/favicon.ico'
    ];
    if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
      const path = join(__dirname, 'static', parsedUrl.pathname);
      res.sendFile(path);
    } else {
      return handle(req, res);
    }
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
  return `${req.url}`;
}

function renderAndCache(req, res, pagePath, queryParams) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (!dev && ssrCache.has(key)) {
    console.log(`CACHE HIT: ${key}`);
    res.send(ssrCache.get(key));
    return;
  }

  // If not let's render the page into HTML
  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      console.log(`CACHE MISS: ${key}`);
      ssrCache.set(key, html);

      res.send(html);
    })
    .catch(err => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
}
