const CACHE_NAME = 'aether-ios-standalone-v7';
const CORE_ASSETS = [
  './',
  './index.html',
  './aether-data-bundle.js',
  './manifest.json',
  './apple-touch-icon.png',
  './apple-touch-icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

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
      caches.match(req, { ignoreSearch: true }).then((cachedRes) => {
        const netPromise = fetch(req, { cache: 'no-cache' })
          .then((res) => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return res;
          })
          .catch(() => cachedRes || caches.match('./index.html', { ignoreSearch: true }));

        if (!cachedRes) return netPromise;

        const timeoutFallback = new Promise((resolve) =>
          setTimeout(() => resolve(cachedRes), 1400)
        );
        return Promise.race([netPromise, timeoutFallback]);
      })
    );
  }
});
