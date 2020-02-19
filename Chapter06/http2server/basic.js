import http2 from 'http2';
import fs from 'fs';

const server = http2.createSecureServer({
    key : fs.readFileSync('server.key.pem'),
    cert : fs.readFileSync('server.crt.pem')
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
    stream.respond({
        'content-type': 'text/plain',
        ':status' : 200
    });
    stream.end('Hello from Http2 server');
});
server.listen(8081, '127.0.0.1');