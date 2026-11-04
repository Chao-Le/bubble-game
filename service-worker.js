const APP_VERSION = 'v4';
const CACHE_NAME = 'bubble-game-' + APP_VERSION;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon.png'
];

// Save files to the device when the app is first visited
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Clean up old files if you ever update the game
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Serve saved files when offline
self.addEventListener('fetch', (event) => {
  // Intercept version requests from the main page
  if (event.request.url.includes('__version__')) {
    event.respondWith(new Response(APP_VERSION, { headers: { 'Content-Type': 'text/plain' } }));
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
