const CACHE_NAME = "dulichvn-v1";
const PRECACHE_URLS = ["/", "/offline"];

// Install — cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate — xóa cache cũ
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Bỏ qua API requests
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache static assets
        if (
          response.ok &&
          (event.request.url.includes("/_next/static/") ||
            event.request.url.includes("/icons/"))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match("/")))
  );
});
