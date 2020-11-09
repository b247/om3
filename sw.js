const PRECACHE = 'offline-v2.0.4-c5';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/css/vendors/bootstrap.min.css?v=4.1.3',
  '/css/vendors/font-awesome-4.7.0/css/font-awesome.min.css?v=4.7.0',
  '/css/vendors/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0',

  '/css/main.css?v=v2.0.4',
  '/favicons/favicon-32x32.png',
  '/favicons/android-chrome-192x192.png',
  '/favicons/site.webmanifest?v=v2.0.4',
  '/images/android-swipe-down-notification-panel.gif',

  '/jslibs/vendors/jSignature.min.js?v=2.1.3',
  '/jslibs/vendors/jquery.min.js?v=3.4.1',
  '/jslibs/vendors/jspdf.min.js?v=1.5.3',

  'index.html', './',
  '/jslibs/main.js?v=v2.0.4',
  '/jslibs/assets.js?v=v2.0.4'

];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  // const currentCaches = [PRECACHE, RUNTIME];
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // return caches.open(RUNTIME).then(cache => {
        //   return fetch(event.request).then(response => {
        //     // Put a copy of the response in the runtime cache.
        //     return cache.put(event.request, response.clone()).then(() => {
        //       return response;
        //     });
        //   });
        // });
      })
    );
  }
});
