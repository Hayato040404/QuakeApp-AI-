const CACHE_NAME = 'quakevision-cache-v1';
const API_URLS = [
  'https://api.p2pquake.net/v2/history?codes=551&limit=10',
  'https://files.nakn.jp/earthquake/code/PointSeismicIntensityLocation.json',
  'https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson',
];

const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install: Cache static assets and initial API data
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      const assetsToCache = [...STATIC_ASSETS, ...API_URLS];
      return cache.addAll(assetsToCache).catch(err => {
          console.error("Failed to cache assets during install:", err);
      });
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Network-first for API, Cache-first for others
self.addEventListener('fetch', (event) => {
  const isApiUrl = API_URLS.some(url => event.request.url.startsWith(url));
  const isCdnUrl = event.request.url.includes('cdn') || event.request.url.includes('unpkg') || event.request.url.includes('aistudiocdn');

  if (isApiUrl) {
    // Network first strategy for API data
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, serve from cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache first strategy for static assets and CDN scripts
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then(fetchResponse => {
            // For CDN scripts, cache them if fetched successfully
            if (isCdnUrl) {
                const responseToCache = fetchResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
            }
            return fetchResponse;
        });
      })
    );
  }
});
