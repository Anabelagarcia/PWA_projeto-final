import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

const pageCache = new CacheFirst({
  cacheName: 'pwa-cam',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30 dias
  ],
});

warmStrategyCache({
  urls: [
    '/', '/index.html', '/offline.html',
    '/js/main.js', '/js/db.js', '/css/style.css',
    '/images/pwa-icon-256.png', '/images/pwa-icon-512.png',
    '/favicon.ico'
  ],
  strategy: pageCache,
});

// Cache de navegação (páginas)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  pageCache
);

// Cache de scripts, estilos e workers
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// Cache de imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
);

// Página offline
offlineFallback({ pageFallback: '/offline.html' });

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado!');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado!');
  clients.claim();
});
