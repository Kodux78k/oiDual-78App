self.addEventListener('install', (event) => {
  console.log('[sw] install');
  // skip waiting is intentionally NOT called — gentle install
});

self.addEventListener('activate', (event) => {
  console.log('[sw] activate');
  // claim clients in case you want immediate control
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // network-first for dynamic requests, fallback to cache if offline
  const req = event.request;
  // Bypass non-GET requests and browser extensions
  if (req.method !== 'GET' || req.url.startsWith('chrome-extension://')) return;
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// simple message handler
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SW_SKIP_WAITING') {
    self.skipWaiting();
  }
});
