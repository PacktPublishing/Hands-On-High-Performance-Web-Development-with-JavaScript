import http2 from 'http2'
import fs from 'fs'
import cluster from 'cluster'
import path from 'path'
import cache from './cache.js'
import os from 'os';
import {PassThrough} from 'stream'
import {LoopingStream} from './template.js'

const ENV_VARS = process.env;

const port = ENV_VARS.npm_package_config_port || 80;
const key  = ENV_VARS.npm_package_config_key || 'key.pem';
const cert = ENV_VARS.npm_package_config_certificate || 'cert.pem';
const templateDirectory = ENV_VARS.npm_package_config_template || 'template';
const publishedDirectory = ENV_VARS.npm_package_config_bodyfiles || 'body';
const developmentMode = ENV_VARS.npm_package_config_development || true;

const FILE_TYPES = new Map([
    ['.css', path.join('.', templateDirectory, 'css')],
    ['.html', path.join('.', templateDirectory, 'html')]
]);
if( cluster.isMaster ) {
    const numCpus = os.cpus().length;
    for(let i = 0; i < numCpus; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const serverCache = new cache();
    const server = http2.createSecureServer({
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert)
    });
    server.on('error', (err) => {
        console.error(err);
        process.exit();
    });
    server.on('stream', (stream, headers) => {
        const p = headers[':path'];
        for(const [fileType, loc] of FILE_TYPES) {
            if( p.endsWith(fileType) ) {
                stream.respondWithFile(
                    path.join(loc, path.posix.basename(p)),
                    {
                        'content-type': `text/${fileType.slice(1)}`,
                        ':status': 200
                    }
                );
                return;
            }        
        }
        try {
            const f = fs.statSync(path.join('.', publishedDirectory, `${p}.md`));
            stream.respond({
                'content-type': 'text/html',
                ':status': 200
            });
            const cacheHit = serverCache.get(p);
            if( cacheHit ) {
                stream.end(cacheHit);
            } else {
                const file = fs.createReadStream('./template/main.html');
                const tStream = new LoopingStream({
                    dir: templateDirectory,
                    publish: publishedDirectory,
                    vars : {
                        articles : [
                            {
                                location : 'temp1',
                                name     : 'article 1'
                            },
                            {
                                location : 'temp2',
                                name     : 'article 2'
                            },
                            {
                                location : 'temp3',
                                name     : 'article 3'
                            },
                            {
                                location : 'temp4',
                                name     : 'article 4'
                            },
                            {
                                location : 'temp5',
                                name     : 'article 5'
                            }
                        ],
                        fileToProcess : `${p}.md`
                    },
                    loopAmount : 2
                });
                file.pipe(tStream);
                tStream.once('data', (data) => {
                    serverCache.add(data, p);
                    stream.end(data);
                });
            }
        } catch(e) {
            stream.respond({
                'content-type': 'text/html',
                ':status' : 404
            });
            stream.end('File Not Found! Turn Back!');
            console.warn('following file requested and not found! ', p);
        }
    });
    console.log('port', port);
    server.listen(port);
}