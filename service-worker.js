const APP_VERSION = "1.0"; // Subimos versión por el cambio estructural
const CACHE_NAME = `ecolnk-app-cache-v${APP_VERSION}`;

// --- LÓGICA DE NOTIFICACIONES SIMPLIFICADA ---

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./", // 🔄 Corregido: ruta raíz relativa
        "./index.html", // 🔄 Corregido: ruta raíz relativa
        "./css/home.css", // 🔄 Corregido: ruta raíz relativa
        "./js/main.js", // 🔄 Corregido: ruta raíz relativa
        "./componentes/index.js", // 🔄 Corregido: ruta raíz relativa
      ]);
    }),
  );
});

self.addEventListener("activate", (e) => {
  console.log("SW activado - versión", APP_VERSION);
  e.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
  self.clients.claim();
});

// ESCUCHA DE PUSH (Ya no valida admin, confía en el servidor)
self.addEventListener("push", (event) => {
  event.waitUntil(procesarNotificacionPush(event));
});

async function procesarNotificacionPush(event) {
  let data = { title: "SISTEMA", body: "Novedad" };
  try {
    data = event.data ? event.data.json() : data;
  } catch (e) {
    console.error(e);
  }

  const options = {
    body: data.body,
    icon: "./assets/icon_push-192x192.png", // 🔄 Corregido a ruta relativa
    badge: "./assets/badge.png", // 🔄 Corregido a ruta relativa
    tag: "reporte-asistencia",
    renotify: true,
    data: {
      url: data.url || "./index.html", // 🔄 Corregido a ruta relativa
    },
  };

  return self.registration.showNotification(data.title, options);
}

// CLICK EN NOTIFICACIÓN - Versión Corregida para Dominio Raíz
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Obtenemos la URL de destino o por defecto la raíz de la app
  const urlDestino = event.notification.data?.url || "./index.html"; // 🔄 Corregido

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si la app ya está abierta en alguna pestaña
        for (const client of clientList) {
          // 🔄 Corregido: Ya no buscamos "/checkin/", sino que valide la URL actual
          if (client.url.includes(location.origin) && "navigate" in client) {
            client.navigate(urlDestino);
            return client.focus();
          }
        }
        // Si la app no estaba abierta, la abre desde cero
        if (clients.openWindow) {
          return clients.openWindow(urlDestino);
        }
      }),
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request)
        .then((networkRes) => {
          if (
            !networkRes ||
            networkRes.status !== 200 ||
            networkRes.type === "opaque"
          ) {
            return networkRes;
          }
          const responseClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
          return networkRes;
        })
        .catch(() => cachedResponse);
      return cachedResponse || fetchPromise;
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "GET_VERSION") {
    event.source.postMessage({ type: "VERSION", version: APP_VERSION });
  }
  if (event.data?.action === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
