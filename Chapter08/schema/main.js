import encoder from './encoder.js'
import decoder from './decoder.js'
import json from './test.json'

const enc = new encoder();
const dec = new decoder();
enc.pipe(dec);
dec.on('data', (obj) => {
    console.log(obj);
});
enc.write(json);