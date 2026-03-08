const CACHE_NAME = 'nandha-biotech-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// IMPORTANT: Do NOT intercept Firebase API calls — pass them straight to network
self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Skip Firebase, external APIs — let them go directly to network
  if (url.includes('firebasedatabase.app') || url.includes('googleapis.com') || url.includes('firebaseio.com')) {
    return; // Don't call e.respondWith — browser handles it natively
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
