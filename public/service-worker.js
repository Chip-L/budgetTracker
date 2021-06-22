const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // JS
  "/index.js",
  "/indexedDB.js",
  // CSS
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "/styles.css",
  // icons
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const CACHE = "static-v1";
const DATA_CACHE_NAME = "data-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting)
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE, DATA_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// retrieve assets from cache - first check cache - then check online (expecting the online DB to be fairly static)
/*
self.addEventListener("fetch", async (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      const cache = await caches.open(DATA_CACHE_NAME);
      const response = await      fetch(event.request);
      await cache.put(event.request, response.clone());
      return response;
    })
  );
});
*/
/*
self.addEventListener("fetch", (event) => {
  // if (event.request.url.startsWith(self.location.origin)) {
  //<== IF start on this page
  event.respondWith(
    caches
      .match(event.request) //<== check the cache for the response then sends it back as the response
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; //<== return the cached response and end
        }
        // not in the cache -- then do this: (get data from server and store it in cache)
        return caches.open(DATA_CACHE_NAME).then((cache) => {
          return fetch(event.request).then((response) => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
  );
  // }
});
*/

self.addEventListener("fetch", function (evt) {
  // cache successful requests to the API
  //(this will only catch if we are doing API routes, change if data is captured in other routes)
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request) // <== try to go online and fetch the data
            .then((response) => {
              console.log("response:", response);
              console.log("evt.request:", evt.request);
              // If the response was good, clone it and store it in the cache -- but only if it was a get (we want to keep all of the "get" data)
              if (response.status === 200 && evt.request.method === "GET") {
                cache.put(evt.request.url, response.clone()); // <== update the cache with current data
              }

              return response;
            })
            .catch(async (err) => {
              console.log("no network:", err);
              console.log("request:", evt.request);
              response = await cache.match(evt.request);
              console.log("response:", response);
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request); //<== try to get the data to/from cache
            });
        })
        .catch((err) => console.log(err))
    );

    return;
  }

  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    })
  );
});
