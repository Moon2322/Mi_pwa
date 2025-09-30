const CACHE_NAME = 'mi-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Borrando caché viejo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediatamente
  return self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Si la petición es a /api/datos (nuestra API simulada)
  if (url.pathname === '/api/datos') {
    console.log('Service Worker: Interceptando /api/datos');
    event.respondWith(
      new Response(JSON.stringify({
        mensaje: 'Datos desde Service Worker',
        timestamp: new Date().toISOString(),
        items: [
          { id: 1, nombre: 'Item 1', descripcion: 'Renderizado desde Service Worker' },
          { id: 2, nombre: 'Item 2', descripcion: 'Sin backend real' },
          { id: 3, nombre: 'Item 3', descripcion: 'Todo funciona offline' }
        ]
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Custom-Header': 'Service-Worker'
        }
      })
    );
    return;
  }
  
  // Para todo lo demás, estrategia Cache First
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Solo cachea GET requests exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Si falla todo, devuelve la página principal desde caché
            return caches.match('/');
          });
      })
  );
});

// Escuchar mensajes para mostrar notificaciones
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200]
    });
  }
});