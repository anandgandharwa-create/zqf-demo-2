const CACHE_NAME = "zqf-v84";  // <-- हर update पर सिर्फ यही बदलना

const urlsToCache = [
  "/zero-quantum-frequency/",
  "/zero-quantum-frequency/index.html",
  "/zero-quantum-frequency/manifest.json",
  "/zero-quantum-frequency/images/icon-192.png",
  "/zero-quantum-frequency/images/icon-512.png",

  // 🔥 NEW PAGES
  "/zero-quantum-frequency/pages/maun-chakra.html",
  "/zero-quantum-frequency/pages/antar-darpan.html",
  "/zero-quantum-frequency/pages/gyan-game.html",
  "/zero-quantum-frequency/pages/mind-witness-quiz.html",

  // existing
  "/zero-quantum-frequency/pages/mindos.html",
  "/zero-quantum-frequency/pages/prashn.html",
  "/zero-quantum-frequency/pages/uttar.html",
  "/zero-quantum-frequency/pages/meditation.html",
  "/zero-quantum-frequency/pages/mindgym.html",
   "/zero-quantum-frequency/pages/privacy.html",
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // नया SW तुरंत तैयार
});


// ACTIVATE (पुराने cache delete + control ले)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH (offline + auto update cache)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // नया data cache में भी डाल दो
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // net fail → cache से दिखाओ
        return caches.match(event.request);
      })
  );
});
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
