/* Service Worker — LATENTE Revista Digital
   Estrategia: cache-first para assets estáticos, network-first para HTML */

const CACHE_NAME = 'latente-v3';
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.json',
  /* Imágenes hero (prioritarias para offline) */
  './assets/images/portada/portada-bg.jpg',
  './assets/images/portada/portada-bg.webp',
  './assets/images/chicha/intro-chica-revistadigital.png',
  './assets/images/chicha/intro-chica-revistadigital.webp',
  './assets/images/chicha/chicha-hero.jpg',
  './assets/images/chicha/chicha-hero.webp',
  './assets/images/expresiones/expresiones-hero.jpg',
  './assets/images/expresiones/expresiones-hero.webp',
  './assets/images/rolo/rolo-hero.jpg',
  './assets/images/rolo/rolo-hero.webp',
  './assets/images/bogota2050/bogota2050-hero.jpg',
  './assets/images/bogota2050/bogota2050-hero.webp',
  './assets/images/subterranea/subterranea-hero.jpg',
  './assets/images/subterranea/subterranea-hero.webp',
  './assets/images/barrios/barrios-hero.jpg',
  './assets/images/barrios/barrios-hero.webp',
  /* Imágenes de contenido */
  './assets/images/chicha/señora-chicha.png',
  './assets/images/chicha/señora-chicha.webp',
  './assets/images/expresiones/expresiones-pag12.jpg',
  './assets/images/expresiones/expresiones-pag12.webp',
  './assets/images/rolo/que-significa-ser-rolo.png',
  './assets/images/rolo/que-significa-ser-rolo.webp',
  './assets/images/rolo/calle-rolo.png',
  './assets/images/rolo/calle-rolo.webp',
  './assets/images/bogota2050/bogota2050-pag24.jpg',
  './assets/images/bogota2050/bogota2050-pag24.webp',
  './assets/images/subterranea/Subterranea3.png',
  './assets/images/subterranea/Subterranea3.webp',
  './assets/images/barrios/portadilla-barrios-rolos.png',
  './assets/images/barrios/portadilla-barrios-rolos.webp',
  './assets/images/barrios/barrios-iglesia.jpg',
  './assets/images/barrios/barrios-iglesia.webp',
  /* Lightbox timeline chicha */
  './assets/images/chicha/ritual-muisca.png',
  './assets/images/chicha/ritual-muisca.webp',
  './assets/images/chicha/chicherias-santafe.jpg',
  './assets/images/chicha/cerveza-chicha.png',
  './assets/images/chicha/cerveza-chicha.webp',
  './assets/images/chicha/festival-chicha.jpeg',
  './assets/images/chicha/panoramica_laperseverancia_mural.jpg',
  './assets/images/chicha/panoramica_laperseverancia_mural.webp',
  './assets/images/chicha/tl-bogotazo.jpg',
  './assets/images/chicha/tl-bogotazo.webp',
  './assets/images/chicha/tl-bolivar.jpg',
  './assets/images/chicha/tl-bolivar.webp',
  /* Audios */
  './assets/audio/chicha/chicha-ambient.mp3',
  './assets/audio/expresiones/expresiones-bogotanas.mp3',
  './assets/audio/expresiones/flautas.mp3',
  './assets/audio/rolo/rolo.mp3',
  './assets/audio/bogota2050/metro.mp3',
  './assets/audio/barrios/barrios-con-raices.mp3',
  './assets/audio/barrios/señorhablando1.mp3',
  /* Íconos */
  './assets/images/portada/icon-192.png',
  './assets/images/portada/icon-512.png',
];

/* Instalación: precachear el shell */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

/* Activación: limpiar cachés antiguas */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch: cache-first para assets, network-first para navegación */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* No interceptar peticiones a dominios externos (YouTube, CDN fonts, etc.) */
  if (url.origin !== self.location.origin) return;

  /* Para el PDF: solo network (muy grande para cachear) */
  if (url.pathname.endsWith('.pdf')) return;

  /* Para navegación (HTML): network-first con fallback a caché */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Para todo lo demás: cache-first */
  event.respondWith(
    caches.match(request).then(
      (cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
    )
  );
});
