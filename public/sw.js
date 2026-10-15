const CACHE = 'gwy-v3';
const PRECACHE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isHashedAsset(url) {
  return url.pathname.includes('/assets/');
}

function isShell(url) {
  return (
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.endsWith('.png')
  );
}

async function store(request, response) {
  if (!response || !response.ok || response.type !== 'basic') return response;
  try {
    const body = await response.clone().blob();
    const stable = new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    const cache = await caches.open(CACHE);
    await cache.put(request, stable);
  } catch {
    /* 缓存写失败时仍返回网络结果 */
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!isSameOrigin(url) || url.pathname.endsWith('/sw.js')) return;
  if (!isHashedAsset(url) && !isShell(url)) return;

  if (isHashedAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => store(request, response));
      }),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => store(request, response))
      .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html'))),
  );
});
