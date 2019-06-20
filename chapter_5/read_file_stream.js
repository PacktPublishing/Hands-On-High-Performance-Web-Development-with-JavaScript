import fs from 'fs';
import { PassThrough } from 'stream';
import GetThe from './custom_transform.js';

let numberOfThe = 0;
const chars = Buffer.from('the');
let currPos = 0;
const str = fs.createReadStream('./example.txt');
const pt = new PassThrough();
str.pipe(pt);
pt.on('data', (chunk) => {
    for(let i = 0; i < chunk.byteLength; i++) {
        const char = chunk[i];
        if(char === chars[currPos]) {
            if(currPos === chars.byteLength - 1) { //we are at the end so reset
                numberOfThe += 1;
                currPos = 0;
            } else {
                currPos += 1;
            }
        } else {
            currPos = 0;
        }
    }
});
pt.on('end', () => {
    console.log('the number of THE in the text is: ', numberOfThe);
});

const gt = new GetThe();
gt.on('data', (data) => {
    console.log('the number of THE produced by the custom stream is: ', data.toString('utf8'));
});
const str2 = fs.createReadStream('./example.txt');
str2.pipe(gt);