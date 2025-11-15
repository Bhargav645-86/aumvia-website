// Service Worker for PWA Offline Support
const CACHE_NAME = 'aumvia-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/js/bundle.js', // Adjust based on your build output
  '/static/css/main.css',
  '/manifest.json',
  // Add more static assets or API endpoints for offline caching
];

// Install Event: Cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Fetch Event: Serve from cache if offline, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback for offline: Serve a basic offline page or cached data
        if (event.request.destination === 'document') {
          return caches.match('/dashboard'); // Show dashboard if main page fails
        }
      });
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients
});

// Push Event: Handle push notifications (for alerts)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.message || 'New alert from AUMVIA!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  };
  event.waitUntil(
    self.registration.showNotification('AUMVIA Alert', options)
  );
});

// Notification Click Event: Open app on click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/dashboard') // Redirect to dashboard
  );
});