const CACHE_NAME = 'aether-ios-standalone-v4';
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

  // API istekleri: Önce ağdan canlı çekip önbelleğe yaz, sunucu kapalıysa anında önbellekten dön
  if (url.pathname.endsWith('/api/market-data')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Uygulama kabuğu (index.html, aether-data-bundle.js): Önce cihaz önbelleğinden 0.02 sn'de anında aç, arka planda güncelle (Stale-While-Revalidate)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const networkFetch = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return res;
          })
          .catch(() => cachedRes || caches.match('./index.html'));
        return cachedRes || networkFetch;
      })
    );
  }
});
