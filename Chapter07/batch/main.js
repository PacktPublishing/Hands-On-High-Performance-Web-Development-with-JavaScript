import { readFileSync, createReadStream } from 'fs'
import { Readable } from 'stream'

const count = readFileSync('./input.txt', {encoding : 'utf8'})
                .split(/\n|\r\n/g).length;
console.timeEnd('full_file');

const newLine = 0x0A;
const readStream = createReadStream('./input.txt');
let counter = 1; 
readStream.on('data', (chunk) => {
    for(const byte of chunk) {
        if( newLine === byte ) counter += 1;
    }
}).on('end', () => {
    console.log('number of line in our file is', counter);
});