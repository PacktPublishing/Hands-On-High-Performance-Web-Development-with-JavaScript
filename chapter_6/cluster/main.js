import cluster from 'cluster';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const numWorkers = 2;
const CACHE = 0;
const SEND = 1;
const location = 'http://127.0.0.1';
const port = 3000;

if( cluster.isMaster ) {
    let count = 1;
    const cache = new Map();
    for(let i = 0; i < numWorkers; i++) {
        const worker = cluster.fork();
        worker.on('message', (msg) => {
            switch(msg.cmd) {
                case 'STOP': {
                    process.exit();
                    break;
                }
                case 'DELETE': {
                    if( msg.opt !== 'all' ) {
                        cache.delete(parseInt(msg.opt));
                    } else {
                        cache.clear();
                    }
                    worker.send({cmd : 'GOOD' });
                    break;
                }
                case 'GET': {
                    worker.send(cache.get(parseInt(msg.opt)) || 'nada');
                    break;
                }
                case 'GRAB': {
                    const buf = [];
                    https.get(msg.opt, (res) => {
                        res.on('data', (data) => {
                            buf.push(data.toString('utf8'));
                        });
                        res.on('end', () => {
                            const final = buf.join('');
                            cache.set(count, final);
                            count += 1;
                            worker.send({cmd : 'GOOD' });
                        });
                    })
                }
            }
        })
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died because of: ${code}`);
    });
} else {
    const handleCommand = function(res, command, params=null) {
        switch(command) {
            case 'grab': {
                if(!params) {
                    res.writeHead(200, { 'Content-Type' : 'text/plain' });
                    res.end('Cannot grab this url!');
                } else {
                    process.send({cmd : 'GRAB', opt : params});
                    process.once('message', (msg) => {
                        res.writeHead(200, { 'Content-Type' : 'text/plain' });
                        res.end('Cached url');
                    })
                }
                break;
            }
            case 'get': {
                if(!params) {
                    res.writeHead(200, { 'Content-Type' : 'text/plain' });
                    res.end('no record to get!');
                } else {
                    process.send({cmd : 'GET', opt : params });
                    process.once('message', (msg) => {
                        res.writeHead(200, { 'Content-Type' : 'text/plain'});
                        res.end(msg);
                    });
                }
                break;
            }
            case 'delete': {
                process.send({cmd : 'DELETE', opt : params || 'all' });
                process.once('message', (msg) => {
                    res.writeHead(200, { 'Content-Type' : 'text/plain' });
                    res.end('deleting record(s)');
                });
                break;
            }
            case 'stop': {
                res.writeHead(200, { 'Content-Type' : 'text/plain' });
                res.end('cache server shutting down');
                process.send({cmd : 'STOP'});
                break;
            }
        }
    }

    http.Server((req, res) => {
        const search = new URL(`${location}${req.url}`).searchParams;
        const command = search.get('command');
        if(!command) {
            res.writeHead(404, { 'Content-Type' : 'text/plain' });
            res.end('command not found!');
        } else {
            const params = search.get('options');
            handleCommand(res, command, params);
        }
    }).listen(port);
}