const CACHE_NAME = 'zynch-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/zynchito.png',
    '/assets/favicon.ico',
    '/assets/icon-any.png',
    '/assets/icon-maskable.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
