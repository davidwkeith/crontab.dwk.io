interface CollectionItem {
  outputPath?: string;
  url: string;
}

interface BundleItem {
  url: string;
}

interface ServiceWorkerData {
  site: { hash?: string };
  collections: { all: CollectionItem[] };
  bundles?: Record<string, BundleItem[]>;
}

export default class ServiceWorker {
  data() {
    return {
      permalink: '/service-worker.js',
      eleventyExcludeFromCollections: true,
    };
  }

  render(data: ServiceWorkerData) {
    const urlsToCache = [
      '/',
      '/index.html',
      ...data.collections.all
        .filter((item) => item.outputPath && item.outputPath.endsWith('.html'))
        .map((item) => item.url),
      ...(data.bundles
        ? Object.values(data.bundles)
            .flat()
            .map((bundle) => bundle.url)
        : []),
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
