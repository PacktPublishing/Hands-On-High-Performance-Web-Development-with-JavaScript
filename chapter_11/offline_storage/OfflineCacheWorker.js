self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.delete('v1').then(() => {
            caches.open('v1').then((cache) => {
                return cache.addAll([
                    '/',
                    './interactions.js',
                    './main.css'
                ]);
            });
        })
    );
});
const controller = new AbortController();
const signal = controller.signal;
const pollTime = 30000;
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if( response ) {
                return response
            } 
            if( event.request.url.includes('/stop') ) {
                controller.abort();
                return new Response(new Blob(["all done"], {type : 'text/plain'}), {status : 200});
            }
            if(!navigator.onLine ) {
                return new Promise((resolve, reject) => {
                    const interval = setInterval(() => {
                        if( navigator.onLine ) {
                            clearInterval(interval);
                            resolve(actualRequestHandler(event));
                        }
                    }, pollTime)
                    signal.addEventListener('abort', () => {
                        reject('aborted');
                    })
                });
            } else {
                return actualRequestHandler(event);
            }
        })
    )
});

let counter = 0;
let name = 65;
const handleRequest = function() {
    const data = {
        id : counter,
        name : String.fromCharCode(name),
        phone : Math.round(Math.random() * 10000)
    }
    counter += 1;
    name += 1;
    return new Response(new Blob([JSON.stringify(data)], {type : 'application/json'}), {status : 200});
}

const handleDelete = function(url) {
    const id = url.split("/")[2];
    return new Response(new Blob([id], {type : 'text/plain'}), {status : 200});
}

const actualRequestHandler = function(req) {
    if( req.request.url.includes('/request') ) {
        return handleRequest();
    }
    if( req.request.url.includes('/delete') ) {
        return handleDelete(req.request.url);
    } 
    fetch(req.request);
}