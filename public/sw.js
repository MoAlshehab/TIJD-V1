// =============================================
// TIJD PWA SERVICE WORKER
// =============================================

const CACHE_NAME = 'tijd-offline-v3';
const OFFLINE_URL = '/offline.html';


// =============================================
// INSTALL
// =============================================

self.addEventListener('install', (event) => {
    console.log('✅ Service Worker installed');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.add(OFFLINE_URL))
            .catch((error) => {
                console.warn('Offline pagina kon niet worden gecachet:', error);
            })
    );

    self.skipWaiting();
});


// =============================================
// ACTIVATE
// =============================================

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activated');

    event.waitUntil(
        Promise.all([
            // Oude caches verwijderen
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => caches.delete(cacheName))
                );
            }),

            // Nieuwe service worker meteen controle geven
            self.clients.claim(),
        ])
    );
});


// =============================================
// FETCH / OFFLINE
// =============================================

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Alleen GET requests behandelen
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Geen chrome-extension:// etc.
    if (
        url.protocol !== 'http:' &&
        url.protocol !== 'https:'
    ) {
        return;
    }

    // Alleen requests van onze eigen website
    if (url.origin !== self.location.origin) {
        return;
    }

    // Offline fallback alleen bij pagina-navigatie
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(async () => {
                const cache = await caches.open(CACHE_NAME);

                return cache.match(OFFLINE_URL);
            })
        );
    }
});


// =============================================
// PUSH NOTIFICATION
// =============================================

self.addEventListener('push', (event) => {
    console.log('🔔 Push ontvangen');

    event.waitUntil(
        (async () => {
            let payload = {
                title: 'Nieuwe melding',
                body: 'Je hebt een nieuwe melding.',
                data: {
                    url: '/',
                },
            };

            // Push bevat data
            if (event.data) {
                const rawData = event.data.text();

                try {
                    // Laravel WebPush verstuurt normaal JSON
                    payload = JSON.parse(rawData);

                    console.log('✅ JSON push payload:', payload);
                } catch (error) {
                    // Chrome DevTools "Push" test verstuurt gewone tekst
                    console.log('ℹ️ Push bevat gewone tekst:', rawData);

                    payload = {
                        title: 'Test melding',
                        body: rawData,
                        data: {
                            url: '/',
                        },
                    };
                }
            }

            const title =
                payload.title ||
                'Nieuwe melding';

            const options = {
                body:
                    payload.body ||
                    'Je hebt een nieuwe melding.',

                icon:
                    payload.icon ||
                    '/icon-192.png',

                badge:
                    payload.badge ||
                    '/icon-192.png',

                tag:
                    payload.tag ||
                    'tijd-notification',

                data:
                    payload.data || {
                        url: '/',
                    },

                // Als dezelfde tag opnieuw komt:
                // opnieuw melding geven
                renotify: true,
            };

            console.log('🔔 Notification tonen:', title, options);

            await self.registration.showNotification(
                title,
                options
            );

            console.log('✅ Notification succesvol getoond');
        })()
    );
});


// =============================================
// KLIK OP NOTIFICATION
// =============================================

self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification aangeklikt');

    event.notification.close();

    const targetUrl =
        event.notification.data?.url || '/';

    event.waitUntil(
        (async () => {
            const clientList = await self.clients.matchAll({
                type: 'window',
                includeUncontrolled: true,
            });

            // Als app al open staat
            for (const client of clientList) {
                if ('navigate' in client) {
                    await client.navigate(targetUrl);
                }

                if ('focus' in client) {
                    return client.focus();
                }
            }

            // App staat niet open
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })()
    );
});