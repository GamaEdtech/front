const CACHE_NAME = 'gama-cache-v1';

const ASSETS = self.__WB_MANIFEST;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});

// self.addEventListener('fetch', (event) => {
//     if (event.request.mode === 'navigate') {
//         event.respondWith(
//             caches.match('/')
//                 .then((cachedResponse) => cachedResponse || fetch(event.request))
//                 .catch(() => caches.match('/'))
//         );
//         return;
//     }

//     event.respondWith(
//         caches.match(event.request)
//             .then((cachedResponse) => {
//                 return cachedResponse || fetch(event.request);
//             })
//             .catch(() => caches.match('/'))
//     );
// });

