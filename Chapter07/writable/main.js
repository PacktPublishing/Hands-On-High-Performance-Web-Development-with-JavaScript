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
        if(!this.#writing) {
            this.#writing = true;
            this.#socket.write("!!!START!!!");
        }
        let i = -1;
        let numCount = 0;
        let prevI = 0;
        while((i = chunk.indexOf(0x00, i)) !== -1) {
            const buf = chunk.slice(prevI, i);
            this.#socket.write(buf);
            this.#socket.write("!!!END!!!");
            if( i !== chunk.byteLength - 1) { // we are not at the end of the chunk start new frame
                this.#socket.write("!!!START!!!");
            } else {
                return callback();
            }
            numCount += 1;
        } 
        if(!numCount ) {
            this.#socket.write(chunk);
        }
        return callback();
    }
}