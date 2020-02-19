import { createConnection } from 'net'
import { Readable } from 'stream'
import { createWriteStream } from 'fs'

export default class ReadMessagePassStream extends Readable {
    #socket = null
    #bufBegin = Buffer.from("!!!START!!!")
    #bufEnd = Buffer.from("!!!END!!!")
    #internalBuffer = [];
    #size = 0;
    #data = function(chunk) {
        let i = -1
        if((i = chunk.indexOf(this.#bufBegin)) !== -1) {
            const tempBuf = chunk.slice(i + this.#bufBegin.byteLength);
            this.#size += tempBuf.byteLength;
            this.#internalBuffer.push(tempBuf);
            
        }
        else if((i = chunk.indexOf(this.#bufEnd)) !== -1) {
            const tempBuf = chunk.slice(0, i);
            this.#size += tempBuf.byteLength;
            this.#internalBuffer.push(tempBuf);
            const final = Buffer.concat(this.#internalBuffer);
            this.#internalBuffer = [];
            if(!this.push(final)) {
                this.#socket.pause();
            }
        } else {
            this.#size += chunk.byteLength;
            this.#internalBuffer.push(chunk);
        }
    }
    constructor(options) {
        if( options.objectMode ) {
            options.objectMode = false //we don't want it on
        }
        super(options);
        if(!options.socket ) {
            throw "Need a socket to attach to!"
        }
        this.#socket = options.socket;
        this.#socket.on('data', this.#data.bind(this));
        this.#socket.on('end', () => this.push(null));
    }
    _read(size) {
        this.#socket.resume();
    }
}

const socket = createConnection(3333);
const write = createWriteStream('./output.txt');
const messageStream = new ReadMessagePassStream({ socket });
messageStream.pipe(write);