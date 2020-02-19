import MessagePack from 'what-the-pack';
import json from '../schema/test.json';

const { encode, decode } = MessagePack.initialize(2**22);

const encoded = encode(json);
const decoded = decode(encoded);

console.log(encoded.byteLength, Buffer.from(JSON.stringify(decoded)).byteLength);

console.log(encoded, decoded);