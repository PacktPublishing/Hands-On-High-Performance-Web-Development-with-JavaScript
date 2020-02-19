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
const add = {id : 1, name : 'bob', description : 'knight', points : 100};
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if( event.request.url.includes('/add') ) {
                return fetch('./row.template')
                .then((res) => res.text())
                .then((template) => {
                    return new Response(new Blob([renderTemplate(template, add)], {type : 'text/html'}), {status : 200});    
                })
            } else if( response ) {
                return response
            } else {
                fetch(event.request);
            }
        })
    )
});

const renderTemplate = function(template, obj) {
    const regex = /\${([a-zA-Z0-9]+)\}/;
    const keys = Object.keys(obj);
    let match = null;
    while(match = regex.exec(template)) {
        const key = match[1];
        console.log(match);
        if( keys.includes(key) ) {
            template = template.replace(match[0], obj[key]);
        } else {
            match = null;
        }
    }
    return template;
}