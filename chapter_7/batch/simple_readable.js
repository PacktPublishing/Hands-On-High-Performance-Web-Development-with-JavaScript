import { Readable } from 'stream'
import { createReadStream, createWriteStream } from 'fs'

class LoremFinder extends Readable {
    #lorem = Buffer.from('lorem')
    #found = 0
    #totalCount = 0
    #startByteLoc = -1
    #file = null

    #data = function(chunk) {
        for(let i = 0; i < chunk.byteLength; i++) {
            const byte = chunk[i];
            if( byte === this.#lorem[this.#found] ) {
                if(!this.#found ) {
                    this.#startByteLoc = this.#totalCount + i;  
                }
                this.#found += 1;
            } else {
                this.#found = 0;
            }
            if( this.#found === this.#lorem.byteLength ) {
                const buf = Buffer.alloc(4);
                buf.writeUInt32BE(this.#startByteLoc);
                this.push(this.#startByteLoc.toString() + "\r\n");
                this.#found = 0;
            }
        }
        this.#totalCount += chunk.byteLength;
    }
    constructor(opts) {
        super(opts);
        if(!opts.stream ) {
            throw new Error("This stream needs a stream to be provided!");
        }
        this.#file = opts.stream;
        this.#file.on('data', this.#data.bind(this));
        this.#file.on('end', () => this.push(null));
    }

    _read(size) {
        this.#file.resume();
    }
}

const locs = new Set();
const loremFinder = new LoremFinder({
    stream : createReadStream('./input.txt')
});
const writeable = createWriteStream('./output.txt');
loremFinder.pipe(writeable)
// loremFinder.on('data', (chunk) => {
//     const num = chunk.readUInt32BE();
//     locs.add(num);
// });
// loremFinder.on('end', () => {
//     console.log('here are all of the locations:');
//     for(const val of locs) {
//         console.log('location: ', val);
//     }
//     console.log('number of lorems found is', locs.size);
// });