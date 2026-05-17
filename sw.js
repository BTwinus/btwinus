const CACHE = 'btwinus-v9';

const ASSETS = [
  '/',
  '/index.html',
  '/fr/',
  '/fr/index.html',
  '/ln/',
  '/ln/index.html',
  '/chat.html',
  '/blog/',
  '/blog/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-icon-180x180.png',
  '/android-icon-192x192.png',
  '/ms-icon-144x144.png',
  '/css/style.css',
  '/css/blog.css',
  '/js/theme.js',
  '/js/home.js',
  '/js/matrix.js',
  '/js/demo.js',
  '/js/qr.js',
  '/js/app.js',
  '/js/i18n.js',
  '/js/consent.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // HTML pages: network-first so users always get fresh content
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => {
        const path = url.pathname;
        if (path.startsWith('/fr/')) return caches.match('/fr/index.html');
        if (path.startsWith('/ln/')) return caches.match('/ln/index.html');
        if (path.startsWith('/blog/')) return caches.match('/blog/index.html');
        return caches.match('/index.html');
      })
    );
    return;
  }

  // CSS and JS: network-first so version bumps always reach users immediately
  // Falls back to cache only when offline
  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else (images, icons, manifest): cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
