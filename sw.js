const CACHE = 'flo-v1';
const ASSETS = ['/Flo/', '/Flo/index.html', '/Flo/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const c = res.clone();
        caches.open(CACHE).then(ch => ch.put(e.request, c));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
