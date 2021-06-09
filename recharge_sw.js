let cacheName = "recharger.V.1";
let appShellFiles = [
    "menu.png",
    "edit.png",
    "tick.png",
    "gallery.png",
    "contact.png",
    "recharge icon (512x512).png", 
    "rescan.png",
    "flashlight on.png",
    "flashlight off.png",
    "safaricom.png",
    "airtel.png",
    "telkom.png", 
    "recharge.js",
    "https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js", 
    "index.html"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(appShellFiles);
        })
    )
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res1) => {
            if(res1) {
                if(navigator.onLine && (e.request.url.includes(".js") || e.request.url.includes(".css") || e.request.url.includes(".html"))) {
                    return fetch(e.request).then((res2) => {
                   	    return caches.open(cacheName).then((cache) => {
                            cache.put(e.request, res2.clone());
                            return res2;
                        })
                    }).catch((error) => {
                        return res1;
                    })
                } 
                return res1;
            }
            else {
                return fetch(e.request).then((res2) => {
                    return caches.open(cacheName).then((cache) => {
                        cache.put(e.request, res2.clone());
                        return res2;
                    })
                })
             }
        })
    )
});

self.addEventListener("activate", (e) => {
    const keepList = [cacheName];
    
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(keepList.indexOf(key) === -1) {
                    return caches.delete(key);
                } 
            }))
        })
    )
});