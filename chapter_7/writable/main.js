import { Writable } from 'stream'

export default class WriteMessagePassStream extends Writable {
    #socket = null;
    #writing = false;
    constructor(options) {
        if( options.objectMode ) { //make sure we do not turn on object mode
            options.objectMode = false;
        }
        if(!options.socket ) {
            throw new Error("A socket is required to contruct this stream!");
        }
        super(options);
        this.#socket = options.socket;
    }
    _write(chunk, encoding, callback) {
        if( this.#writing ) {
            let i = -1;
            if((i = chunk.indexOf(0x00)) !== -1) {
                const buf = chunk.slice(0, i);
                this.#socket.write(buf);
                this.#socket.write("!!!END!!!");
                if( i !== chunk.byteLength - 1) { // we are not at the end of the chunk start new frame
                    this.#socket.write("!!!START!!!");
                    const buf2 = chunk.slice(i, chunk.byteLength - 1);
                    this.#socket.write(buf2);
                } else {
                    this.#writing = false;
                }
            } else {
                this.#socket.write(chunk);
            }
            return callback();
        }
        if(!this.#writing) {
            this.#writing = true;
            this.#socket.write("!!!START!!!");
            this.#socket.write(chunk);
            return callback();
        }
    }
}