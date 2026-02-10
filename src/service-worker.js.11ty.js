export default class {
  data() {
    return {
      permalink: '/service-worker.js',
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const urlsToCache = [
      '/',
      '/index.html',
      // Add all HTML pages
      ...data.collections.all
        .filter((item) => item.outputPath && item.outputPath.endsWith('.html'))
        .map((item) => item.url),
      // Add bundled CSS and JS
      ...(data.bundles
        ? Object.values(data.bundles)
            .flat()
            .map((bundle) => bundle.url)
        : []),
      // Add static assets
      '/img/favicon.svg',
      '/img/favicons/favicon-192.png',
      '/img/favicons/favicon-512.png',
      '/manifest.webmanifest',
    ];

    return `
const CACHE_VERSION = '${data.site.hash ?? 'dev'}';
const STATIC_CACHE = 'crontab-static-' + CACHE_VERSION;
const RUNTIME_CACHE = 'crontab-runtime-' + CACHE_VERSION;
const urlsToCache = ${JSON.stringify(urlsToCache, null, 2)};

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const acceptsHtml =
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (acceptsHtml) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        const copy = networkResponse.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, copy));
        return networkResponse;
      });
    })
  );
});
`;
  }
}
