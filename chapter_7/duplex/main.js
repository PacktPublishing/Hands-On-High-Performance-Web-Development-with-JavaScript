import { createConnection } from 'net'
import { Duplex } from 'stream'
import { createWriteStream } from 'fs'

export default class MessageTranslator extends Duplex {
    #socket = null;
    #internalWriteBuf = new Map();
    #internalReadHoldBuf = [];
    #internalPacketNum = 0;
    #readSize = 0;
    #writeCounter = 0;
    constructor(opts) {
        if(!opts.socket ) {
            throw new Error("MessageTranslator stream needs a socket!");
        }
        super(opts);
        this.#socket = opts.socket;
        // we are assuming single message for each chunk
        this.#socket.on('data', (chunk) => {
            if(!this.#readSize ) {
                this.#internalPacketNum = chunk.readInt32BE();
                this.#readSize = chunk.readInt32BE(4);
                this.#internalReadHoldBuf.push(chunk.slice(8));
                this.#readSize -= chunk.byteLength - 8
            } else {
                this.#internalReadHoldBuf.push(chunk);
                this.#readSize -= chunk.byteLength;
            }
            // reached end of message
            if(!this.#readSize ) {
                this.push(Buffer.concat(this.#internalReadHoldBuf));
                this.#internalReadHoldBuf = [];
            }
        });
    }
    #processChunkHelper = function(chunk) {
        if(chunk.readInt32BE() === -1) {        
            this.#internalWriteBuf.get(this.#writeCounter).done = true;
            this.#writeCounter += 1;
            this.#internalWriteBuf.set(this.#writeCounter, {buf : [], done : false});
        } else {
            if(!this.#internalWriteBuf.has(this.#writeCounter)) {
                this.#internalWriteBuf.set(this.#writeCounter, {buf : [], done : false});                
            }
            this.#internalWriteBuf.get(this.#writeCounter).buf.push(chunk);
        }
    }
    #writeHelper = function(cb) {
        const writeOut = [];
        for(const [key, val] of this.#internalWriteBuf) {
            if( val.done ) {
                const cBuf = Buffer.allocUnsafe(4);
                const valBuf = Buffer.concat(val.buf);
                const sizeBuf = Buffer.allocUnsafe(4);
                cBuf.writeInt32BE(valBuf.readInt32BE());
                sizeBuf.writeInt32BE(valBuf.byteLength - 4);
                writeOut.push(Buffer.concat([cBuf, sizeBuf, valBuf.slice(4)]));
                val.buf = [];
            }
        }
        if( writeOut.length ) {
            this.#socket.write(Buffer.concat(writeOut));
        } 
        cb();
    }
    _writev(chunks, cb) {
        for(const chunk of chunks) {
           this.#processChunkHelper(chunk);
        }
        this.#writeHelper(cb);
    }
    _write(chunk, encoding, cb) {
        this.#processChunkHelper(chunk);
        this.#writeHelper(cb);
    }
    _read() {
        this.#socket.resume();
    }
    _final(cb) {
        cb(); // nothing to do since it all should be consumed at this point
    }
}
const socket = createConnection(3334);
const writer = createWriteStream('./output.txt');
const OneHelper = new MessageTranslator({ socket });
OneHelper.pipe(writer);