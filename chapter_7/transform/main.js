import { Transform } from 'stream'

// implemented in stream form from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export default class StreamHashCreator extends Transform {
    #currHash = 0;
    constructor(options={}) {
        if( options.objectMode ) {
            throw new Error("This stream does not support object mode!");
        }
        options.decodeStrings = true;
        super(options);
    }
    _transform(chunk, encoding, callback) {
        if( Buffer.isBuffer(chunk) ) {
            const str = chunk.toString('utf8');
            for(let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                this.#currHash = ((this.#currHash << 5) - this.#currHash ) + char;
                this.#currHash |= 0;
            }
        }
        callback();
    }
    _flush(callback) {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(this.#currHash);
        this.push(buf);
        callback(null);
    }
}

const hasher = new StreamHashCreator();
hasher.on('data', (data) => {
    console.log('our hash is', data.readInt32BE());
})
hasher.write("Here is some data");
hasher.write("Here is some more data");
hasher.end();

const hasher2 = new StreamHashCreator();
hasher2.on('data', (data) => {
    console.log('our has is', data.readInt32BE());
});
hasher2.write("Here is some more data");
hasher2.write("Here is also some more data");
hasher2.end();

const hasher3 = new StreamHashCreator();
hasher3.on('data', (data) => {
    console.log('out hash is', data.readInt32BE());
});
hasher3.write("Here is some more data");
hasher3.write("Here is some data");
hasher3.end();

const hasher4 = new StreamHashCreator();
hasher4.on('data', (data) => {
    console.log('our hash is', data.readInt32BE());
});
hasher4.write("Here is some data");
hasher4.write("Here is some more data");
hasher4.end();