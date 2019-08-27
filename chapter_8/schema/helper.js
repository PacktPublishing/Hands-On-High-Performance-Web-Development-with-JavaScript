export const CONSTANTS = {
    object : 0x04,
    number : 0x01,
    floating : 0x02,
    string : 0x03,
    header : 0x10,
    body : 0x11
}

export const encodeString = function(str) {
    const buf = Buffer.from(str);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(buf.byteLength);
    return Buffer.concat([Buffer.from([0x03]), len, buf]);
}

export const decodeString = function(buf) {
    if(buf[0] !== CONSTANTS.string) {
        return false;
    }
    const len = buf.readUInt32BE(1);
    return buf.slice(5, 5 + len).toString('utf8');
}

export const encodeNumber = function(num) {
    const type = Math.abs(num) === num ? 0x01 : 0x02;
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(num);
    return Buffer.concat([Buffer.from([type]), buf]);  
}

export const decodeNumber = function(buf) {
    return buf.readInt32BE(1);
}