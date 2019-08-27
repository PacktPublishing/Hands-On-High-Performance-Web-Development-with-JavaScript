import { Transform } from 'stream'
import { encodeString, encodeNumber } from './helper.js'

export default class SimpleSchemaWriter extends Transform {
    #encode = function(data) {
        return typeof data === 'string' ? 
                encodeString(data) :
                typeof data === 'number' ?
                encodeNumber(data) :
                null;
    }

    constructor(opts={}) {
        opts.writableObjectMode = true;
        super(opts);
    }

    _transform(chunk, encoding, callback) {
        console.log(Buffer.from(JSON.stringify(chunk)).byteLength);
        const buf = [];
        buf.push(Buffer.from([0x10]));
        for(const key of Object.keys(chunk)) {
            const item = this.#encode(key);
            if(item === null) {
                return callback(new Error("Unable to parse!"))
            }
            buf.push(item);
        }
        buf.push(Buffer.from([0x10]));
        buf.push(Buffer.from([0x11]));
        for(const val of Object.values(chunk)) {
            const item = this.#encode(val);
            if(item === null) {
                return callback(new Error("Unable to parse!"))
            }
            buf.push(item);
        }
        buf.push(Buffer.from([0x11]));
        console.log(Buffer.concat(buf).byteLength);
        this.push(Buffer.concat(buf));
        callback();
    } 
}