// Service Worker for TrackShift PWA
const CACHE_NAME = "trackshift-v1";
const STATIC_CACHE = "trackshift-static-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/auth/login",
  "/dashboard/employee",
  "/dashboard/admin",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip API requests (always use network)
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Network first strategy for navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Fallback to index.html for SPA routing
            return caches.match("/");
          });
        })
    );
    return;
  }

  // Cache first strategy for static assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      });
    })
  );
});

// Background sync for offline actions (future enhancement)
self.addEventListener("sync", (event) => {
  if (event.tag === "clock-in" || event.tag === "clock-out") {
    event.waitUntil(syncClockAction(event.tag));
  }
});

async function syncClockAction(tag) {
  // This would sync queued clock-in/out actions when back online
  // Implementation would depend on IndexedDB queue
  console.log(`Syncing ${tag} action`);
}
