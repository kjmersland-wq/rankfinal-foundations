const CACHE_NAME = "rankfinal-shell-v2";
const SEARCH_CACHE = "rankfinal-last-searches-v1";
const SHELL_ASSETS = ["/", "/offline.html", "/manifest.json", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![CACHE_NAME, SEARCH_CACHE].includes(key)).map((key) => caches.delete(key)))));
  self.clients.claim();
});

async function trimSearchCache() {
  const cache = await caches.open(SEARCH_CACHE);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - 5)).map((request) => cache.delete(request)));
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (url.pathname === "/search") {
    event.respondWith(fetch(event.request).then(async (response) => {
      const cache = await caches.open(SEARCH_CACHE);
      await cache.put(event.request, response.clone());
      await trimSearchCache();
      return response;
    }).catch(async () => (await caches.match(event.request)) || caches.match("/offline.html")));
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("/offline.html"))));
});
