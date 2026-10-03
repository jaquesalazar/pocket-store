const CACHE_NAME =
    "pocket-store-v3";


const APP_SHELL = [

    "./",

    "./index.html",

    "./styles.css",

    "./app.js",

    "./manifest.json"

];

self.addEventListener(
    "install",
    (event) => {

        console.log(
            "Service Worker: instalando..."
        );


        event.waitUntil(

            caches
                .open(CACHE_NAME)

                .then((cache) => {

                    console.log(
                        "Guardando App Shell"
                    );

                    return cache.addAll(
                        APP_SHELL
                    );

                })

        );


        self.skipWaiting();

    }
);

self.addEventListener(
    "activate",
    (event) => {

        console.log(
            "Service Worker: activado"
        );


        event.waitUntil(

            caches
                .keys()

                .then((cacheNames) => {

                    return Promise.all(

                        cacheNames.map(
                            (cache) => {

                                if (
                                    cache !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cache
                                    );

                                }

                            }
                        )

                    );

                })

        );


        self.clients.claim();

    }
);

self.addEventListener(
    "fetch",
    (event) => {
        if (
            event.request.method !== "GET"
        ) {
            return;
        }


        event.respondWith(

            caches
                .match(event.request)

                .then(
                    async (cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        try {

                            const networkResponse =
                                await fetch(
                                    event.request
                                );

                            if (
                                networkResponse.ok
                            ) {

                                const cache =
                                    await caches.open(
                                        CACHE_NAME
                                    );

                                cache.put(
                                    event.request,
                                    networkResponse.clone()
                                );

                            }

                            return networkResponse;
                        }

                        catch (error) {
                            console.error(
                                "Recurso no disponible:",
                                event.request.url
                            );
                            throw error;
                        }
                    }
                )
        );
    }
);