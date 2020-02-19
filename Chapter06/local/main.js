import { Worker } from 'worker_threads';
import net from 'net';
import tty from 'tty';
import pipeName from './helper.js';

const table = new Map();
let currData = [];
const failure = Buffer.from('!!!FALSE!!!');
const begin = Buffer.from('!!!BEGIN!!!');
const end = Buffer.from('!!!END!!!');
const methodTable = new WeakMap();
const cacheHandler = function(data) {
    if( data.includes(begin) ) {
        currData.push(data.toString('utf8'));
    }
    if( currData.lenght ) {
        currData.push(data.toString('utf8'));
    }
    if( data.includes(end) ) {
        currData.push(data.toString('utf8'));
        const final = currData.join('');
        console.log(currData.join('').substring(begin.byteLength, final.length - end.byteLength));
        currData = [];
    }
}
const sendHandler = function(data) {
    if( data.equals(failure) ) {
        return console.log(false);
    }
    if( data.includes(begin) ) {
        currData.push(data.toString('utf8'));
    }
    if( currData.length ) {
        currData.push(data.toString('utf8'));
    }
    if( data.includes(end) ) {
        table.get('cache').write(currData.join(''));
        currData = [];
    } 
}
const testConnections = function() {
    return table.size === 2;
}
const setupHandlers = function() {
    table.forEach((value, key) => {
        value.on('data', methodTable.get(value).bind(value));
    });
}
const startCLIMode = function() {
    process.stdin.on('data', function(data) {
        const d = data.toString('utf8');
        const instruction  = d.trim().split(/\s/ig);
        switch(instruction[0]) {
            case 'delete': {
                table.get('cache').write(`!!!DELETE!!!${instruction[1] || ''}`);
                break;
            }
            case 'get': {
                if( typeof instruction[1] === 'undefined' ) {
                    return console.log('get needs a number associated with it!');
                }
                table.get('cache').write(`!!!GET!!!${instruction[1]}`);
                break;
            }
            case 'grab': {
                table.get('send').write(instruction[1]);
                break;
            }
            case 'stop': {
                console.log('closing application');
                table.forEach((value, key) => value.end());
                process.exit();
                break;
            }
            default: {
                console.log('This is an unsupported commnad. The following commands are allowed:');
                console.table([{
                    command : 'get',
                    arguments : '<number>',
                    description : 'grabs the data from the cache if available. Will return null if not found'
                }, {
                    command : 'grab',
                    arguments : '<url>',
                    description : 'grabs the webpage and stores it into the cache. Returns a boolean'
                }, {
                    command : 'delete',
                    arguments : '<url>|all',
                    description : 'delete a specific record or all of the records. Returns nothing'
                }, {
                    command : 'stop',
                    arguments : 'none',
                    description : 'shuts down the threads and then the entire application'
                }]);
                break;
            }
        }
    });
}

// start up the local server so everyone can connect to us
const server = net.createServer().listen(pipeName());
server.on('connection', (socket) => {
    // we are setting up a simple lookup for the type
    socket.once('data', (data) => {
        const type = data.toString('utf8');
        table.set(type, socket);
        switch(type) {
            case 'cache': {
                methodTable.set(socket, cacheHandler);
                break;
            }
            case 'send': {
                methodTable.set(socket, sendHandler);
                break;
            }
            default: {
                console.error('UNSUPPORTED SUB SYSTEM TYPE!');
                break;
            }
        }
        if( testConnections() ) {
            setupHandlers();
            startCLIMode();
        }
    });
    socket.once('close', () => {
        table.delete(type)
    });
    socket.write('WHOIS');
});

// startup our two helpers
const cache = new Worker('./cache.js');
const send = new Worker('./send.js');