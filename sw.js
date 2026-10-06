/* GREEN SEAWEED offline cache: the page keeps working without a network once it has been opened online */
const CACHE='green-seaweed-v1';
const FILES=['./','index.html','manifest.webmanifest','apple-touch-icon.png','favicon-64.png','favicon.ico','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  /* serve from cache immediately; refresh the cached copy in the background when online */
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return res}).catch(()=>null);
    return hit||net.then(r=>r||caches.match('index.html'));
  }));
});
