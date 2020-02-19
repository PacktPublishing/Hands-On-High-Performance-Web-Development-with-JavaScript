import http2 from 'http2'
import fs from 'fs'
import path from 'path'

const basePath = process.env.npm_package_config_static;
const supportedTypes = new Set(['.ico', '.html', '.css', '.js']);

const server = http2.createSecureServer({
    key : fs.readFileSync(process.env.npm_package_config_key),
    cert : fs.readFileSync(process.env.npm_package_config_cert),
    allowHTTP1 : true
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, header) => {
    const fileLoc = header[':path'];
    const extension = path.extname(fileLoc);
    if(!supportedTypes.has(extension)) {
        stream.respond({
            ':status' : 400,
            'content-type' : 'application/json'
        });
        stream.end(JSON.stringify({
            error : 'unsupported data type!',
            extension
        }));
        return;
    }
    stream.respondWithFile(
        path.join(process.cwd(), basePath, fileLoc),
        {
            ':status' : 200,
            'content-type' : 
                extension === ".html" ?
                'text/html' :
                extension === ".css" ?
                'text/css' :
                'text/javascript'
        },
        {
            onError : (err) => {
                if( err.code === 'ENOENT') {
                    stream.respond({ ':status' : 404 });
                } else {
                    stream.respond({ ':status' : 500 });
                }
                stream.end();
            }
        }
    )
});

server.listen(80, '127.0.0.1');