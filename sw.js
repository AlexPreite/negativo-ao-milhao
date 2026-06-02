const CACHE_NAME = 'dnm-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if(cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(res => {
        if(!res || res.status !== 200) return res;
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return res;
      }).catch(() => caches.match('./'));
    })
  );
});
