const CACHE_NAME = 'aether-1m-native-v15-1-r4';
const CORE_ASSETS = [
  './',
  './index.html',
  './million-sim.css',
  './aether-data-bundle.js',
  './aether-kernel-v10.js',
  './real-investment-guide.js',
  './million-sim-app.js',
  './manifest.json',
  './apple-touch-icon.png',
  './apple-touch-icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        for (const client of clients) {
          client.postMessage({ type: 'AETHER_SW_UPDATED', version: CACHE_NAME });
        }
      })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.pathname.endsWith('/api/family-hub')) return;

  if (url.pathname.endsWith('/api/market-data')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./api/market-data', clone));
          }
          return res;
        })
        .catch(() => caches.match('./api/market-data'))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true }).then((cached) => cached || caches.match('./index.html', { ignoreSearch: true }))
        )
    );
  }
});
