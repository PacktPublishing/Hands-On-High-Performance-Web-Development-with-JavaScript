import { readFileSync, createReadStream } from 'fs'

const file = readFileSync('./input.txt', {encoding : 'utf8'});
const re = /lorem/g;
const matches = file.match(re);
console.log('the number of matches is', matches.length);

const stream = createReadStream('./input.txt');
const buf = Buffer.from('lorem');
let found = 0;
let count = 0;
stream.on('data', (chunk) => {
    for(const byte of chunk) {
        if( byte === buf[found] ) {
            found += 1;
        } else {
            found = 0;
        }
        if( found === buf.byteLength ) {
            count += 1;
            found = 0;
        }
    }
}).on('end', () => {
    console.log('the number of matches is', count)
});