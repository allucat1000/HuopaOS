self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("huopaos-cache").then((cache) =>
      cache.addAll([
        "/HuopaOS/",
        "/HuopaOS/index.html",
        "/HuopaOS/main.js",
        "/HuopaOS/manifest.json",
        "/HuopaOS/icon-192.png",
        "/HuopaOS/icon-512.png"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
