import net from 'net';
import pipeName from './helper.js';

let count = 0;
let cacheTable = new Map();
const begin = Buffer.from('!!!BEGIN!!!');
const end = Buffer.from('!!!END!!!');
const get = Buffer.from('!!!GET!!!');
const del = Buffer.from('!!!DELETE!!!');
let currData = [];

const socket = new net.Socket().connect(pipeName());
socket.on('data', (data) => {
    if( data.toString('utf8') === 'WHOIS' ) {
        return socket.write('cache');
    }
    if( data.includes(get) ) {
        const loc = parseInt(data.slice(get.byteLength).toString('utf8'));
        const d = cacheTable.get(loc);
        if( typeof d !== 'undefined' ) {
            socket.write(begin.toString('utf8') + d + end.toString('utf8'));
        }
    }
    if( data.includes(del) ) {
        if( data.byteLength === del.byteLength ) {
            cacheTable.clear();
        } else {
            const loc = parseInt(data.slice(del.byteLength).toString('utf8'));
            console.log('location', loc);
            cacheTable.delete(loc);
        }
        return console.log('size of cache is now', cacheTable.size);
    }

    if( data.includes(begin) ) {
        currData.push(data.slice(begin.byteSize).toString('utf8'));
    }
    if( currData.length ) {
        currData.push(data.toString('utf8'));
    } 
    if( data.includes(end) ) {
        currData.push(data.slice(0, data.byteLength - end.byteLength).toString('utf8'));
        cacheTable.set(count, currData.join(''));
        currData = [];
    }
});