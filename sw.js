let version = "8";
let cacheName = "Smart-Recharge-v:" + version;
let appShellFiles = [
    "./src/Images/menu.png",
    "./src/Images/edit.png",
    "./src/Images/tick.png",
    "./src/Images/gallery.png",
    "./src/Images/contact.png",
    "./src/Images/rescan.png",
    "./src/Images/flashlight on.png",
    "./src/Images/flashlight off.png",
    "./src/Images/safaricom.png",
    "./src/Images/airtel.png",
    "./src/Images/telkom.png", 
    "./src/Images/recharge icon (16x16).png", 
    "./src/Images/recharge icon (32x32).png", 
    "./src/Images/recharge icon (48x48).png", 
    "./src/Images/recharge icon (96x96).png", 
    "./src/Images/recharge icon (144x144).png", 
    "./src/Images/recharge icon (192x192).png", 
    "./src/Images/recharge icon (256x256).png", 
    "./src/Images/recharge icon (512x512).png", 
    "./src/Images/recharge icon.ico", 
    "./index.js",
    "./index.css",
    "./index.html",
    "./manifest.webmanifest",
    "https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js", 
    "https://unpkg.com/tesseract.js@v2.1.0/dist/worker.min.js", 
    "https://unpkg.com/tesseract.js-core@v2.2.0/dist/tesseract-core.wasm.js", 
    "./"
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
        caches.match(e.request, {ignoreSearch: true}).then((res) => {
            if(res) {
            	return res;
            }
            else {
            	console.log(e.request.url);
            } 
            
            return fetch(e.request).then((res2) => {
            	if(!res2 || res2.status != 200) {
            		return res2;
            	} 
            	
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request, res2.clone());
                    console.log("cached: ", e.request);
                    return res2;
                }).catch((error) => {
					console.log("Put Error", error);
					return res2;
				});
            }).catch((error) => {
            	console.log("Fetch Error", error);
            	return res;
            });
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
	if(e.data && e.data.type == "skip-waiting") {
		self.skipWaiting();
	} 
});