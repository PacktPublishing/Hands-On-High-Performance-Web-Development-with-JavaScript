import { Transform } from 'stream';

class GetThe extends Transform {
    #currPos = 0;
    #numberOfThe = 0;

    static chars = Buffer.from('the');
    constructor(options) {
        super(options)
    }
    _transform(chunk, encoding, callback) {
        for(let i = 0; i < chunk.byteLength; i++) {
            const char = chunk[i];
            if(char === GetThe.chars[this.#currPos]) {
                if(this.#currPos === GetThe.chars.byteLength - 1) { //we are at the end so reset
                    this.#numberOfThe += 1;
                    this.#currPos = 0;
                } else {
                    this.#currPos += 1;
                }
            } else {
                this.#currPos = 0;
            }
        }
        callback();
    }
    _flush(callback) {
        callback(null, this.#numberOfThe.toString());
    }
}

export default GetThe;