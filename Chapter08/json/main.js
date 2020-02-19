import json from './jsonformat.json';
import { gzipSync } from 'zlib';

const send = new Array(100);
send.fill(json);
console.log('size of over the wire buffer is: ', Buffer.from(JSON.stringify(send)).byteLength);
console.log('size of gzipped version is: ', gzipSync(Buffer.from(JSON.stringify(send))).byteLength);

const send2 = new Array(500);
send2.fill(json);
console.log('size of over the wire buffer is: ', Buffer.from(JSON.stringify(send2)).byteLength);
console.log('size of gzipped version is: ', gzipSync(Buffer.from(JSON.stringify(send2))).byteLength);