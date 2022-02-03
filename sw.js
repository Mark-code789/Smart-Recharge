let cacheName = "Smart-RechargeV288";
let appShellFiles = [
    "./src/Images/menu.png",
    "./src/Images/edit.png",
    "./src/Images/tick.png",
    "./src/Images/gallery.png",
    "./src/Images/contact.png",
    "./src/Images/recharge icon (512x512).png", 
    "./src/Images/rescan.png",
    "./src/Images/flashlight on.png",
    "./src/Images/flashlight off.png",
    "./src/Images/safaricom.png",
    "./src/Images/airtel.png",
    "./src/Images/telkom.png", 
    "https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js", 
    "index.js",
    "index.css",
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
        caches.match(e.request, {ignoreSearch: true}).then((res1) => {
            if(navigator.onLine && /(?<!min).(html|css|js)(.*?)$/g.test(e.request.url) || !res1) {
                return fetch(e.request).then((res2) => {
                    return caches.open(cacheName).then((cache) => {
                        cache.put(e.request, res2.clone());
                        return res2;
                    })
                }).catch((error) => {
                	return res1;
                });
             }
             else {
             	return res1;
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

self.addEventListener("message", (e) => {
	self.clients.matchAll({includeUncontrolled: true, type: 'window'}).
	then((clients) => {
		if(clients && clients.length) {
			if(e.data && e.data.type == "get-version") 
				clients[0].postMessage({
					type: 'version', 
					version: 288
				});
		} 
	});
});