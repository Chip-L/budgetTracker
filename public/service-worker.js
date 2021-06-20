const FILES_TO_CACHE = [
  "/",
  "/index.html",
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting)
  );
});

// retrieve assets from cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
