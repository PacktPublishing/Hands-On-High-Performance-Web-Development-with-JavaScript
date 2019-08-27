import { Transform } from 'stream'
import { decodeString, decodeNumber, CONSTANTS } from './helper.js'

export default class SimpleSchemaReader extends Transform {
    #obj = {}
    #inHeaders = false
    #inBody = false
    #keys = []
    #currKey = 0
    #decode = function(chunk, index, type='headers') {
        const item = chunk[index] === CONSTANTS.string ?
            decodeString(chunk.slice(index)) :
            decodeNumber(chunk.slice(index, index + 5));
           
        if( type === 'headers' ) {
            this.#obj[item] = null;
        } else {
            this.#obj[this.#keys[this.#currKey]] = item;
        }
        return chunk[index] === CONSTANTS.string ?
            index + item.length + 5 :
            index + 5;
    }

    constructor(opts={}) {
        opts.readableObjectMode = true;
        super(opts);
    }

    _transform(chunk, encoding, callback) {
        let index = 0;
        while(index <= chunk.byteLength ) {
            const byte = chunk[index];
            if( byte === CONSTANTS.header ) {
                this.#inHeaders = !this.#inHeaders
                index += 1;
                continue;
            } else if( byte === CONSTANTS.body ) {
                this.#inBody = !this.#inBody
                if(!this.#inBody ) {
                    this.push(this.#obj);
                    this.#obj = {};
                    this.#keys = [];
                    this.#currKey = 0;
                    return callback();
                } else {
                    this.#keys = Object.keys(this.#obj);
                }
                index += 1;
                continue;
            }
            if( this.#inHeaders ) {
                index = this.#decode(chunk, index);
            } else if( this.#inBody ) {
                index = this.#decode(chunk, index, 'body');
                this.#currKey += 1;
            } else {
                callback(new Error("Unkown state!"));
            }
        }
    } 
}