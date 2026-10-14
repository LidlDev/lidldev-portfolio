// Retirement worker: replace the old cache-first worker at its original URL.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
 const keys = await caches.keys(); await Promise.all(keys.filter(k => /^lidldev-(portfolio|static|dynamic)-/.test(k)).map(k => caches.delete(k)));
 await self.clients.claim(); const clients = await self.clients.matchAll({ type: 'window' }); await self.registration.unregister();
 await Promise.all(clients.map(client => client.navigate(client.url)));
})()));
