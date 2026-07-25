/* Treasure Hunt service worker — offline app shell that still self-updates.
   Bump VERSION on release to force a clean cache swap. Paths are relative to the
   worker's location, so this works under a subpath (e.g. GitHub Pages). */
const VERSION = "v2";
const CACHE = "treasure-hunt-" + VERSION;
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/vendor/three.min.js",
  "./js/sprites.js",
  "./js/themes.js",
  "./js/maze.js",
  "./js/audio.js",
  "./js/input.js",
  "./js/render2d.js",
  "./js/render3d.js",
  "./js/game.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon.svg",
];

self.addEventListener("install", (e) => {
  self.skipWaiting(); // activate the new worker as soon as it's ready
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  // HTML navigations: network-first, so a fresh deploy shows up; cache is the
  // offline fallback.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          cachePut(req, res.clone());
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  // Everything else: stale-while-revalidate — instant from cache, refreshed in
  // the background so the next load has the newest asset.
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          cachePut(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

function cachePut(req, res) {
  if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res)).catch(() => {});
}
