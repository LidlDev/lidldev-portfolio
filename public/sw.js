const CACHE_NAME = 'lidldev-portfolio-v2';
const STATIC_CACHE_NAME = 'lidldev-static-v2';
const DYNAMIC_CACHE_NAME = 'lidldev-dynamic-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/harry-profile.png',
  '/static/js/bundle.js',
  '/static/css/main.css',
  // Add other critical assets
];

// Assets to cache on first request
const DYNAMIC_ASSETS = [
  '/agent',
  '/#projects',
  '/#about',
  '/#contact',
  '/#skills'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip development files and hot reload
  if (url.pathname.includes('/@vite/') ||
      url.pathname.includes('/@react-refresh') ||
      url.pathname.includes('?t=') ||
      url.pathname.includes('.tsx') ||
      url.pathname.includes('.ts') ||
      url.pathname.includes('node_modules') ||
      url.hostname === 'localhost') {
    // For development, always fetch from network
    return;
  }

  event.respondWith(
    // Network first strategy for better development experience
    fetch(request)
      .then((response) => {
        // Check if response is valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Only cache static assets in production
        if (STATIC_ASSETS.includes(url.pathname)) {
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
        }

        return response;
      })
      .catch((error) => {
        console.log('Service Worker: Network failed, trying cache', request.url);

        // Fallback to cache only when network fails
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Service Worker: Serving from cache (offline)', request.url);
              return cachedResponse;
            }

            // Return offline fallback for navigation requests
            if (request.destination === 'document') {
              return caches.match('/');
            }

            // Return a generic offline response for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/harry-profile.png',
    badge: '/harry-profile.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/harry-profile.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/harry-profile.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LidlDev Portfolio', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for syncing contact form
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingForms = await getPendingForms();
    
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });

        if (response.ok) {
          await removePendingForm(form.id);
          console.log('Service Worker: Form synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Form sync failed', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// IndexedDB helpers (simplified)
async function getPendingForms() {
  // Implementation would use IndexedDB to get pending forms
  return [];
}

async function removePendingForm(id) {
  // Implementation would use IndexedDB to remove synced form
  console.log('Removing form', id);
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded');
