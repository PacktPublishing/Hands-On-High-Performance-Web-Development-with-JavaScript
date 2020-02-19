const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((req, res) => {
    return handler(req, res, {
        public : 'offline_storage'
    });
});

server.listen(3000, () => {
    console.log('listening at 3000');
})
