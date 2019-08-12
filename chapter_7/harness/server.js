import { createServer } from 'net'
import WrappedWritableStream from '../writable/main.js'
import MessageTranslator from '../duplex/main.js'

const server = createServer((con) => {

    console.log('client connected. sending test data');
    const wrapped = new WrappedWritableStream({ socket : con });
    for(let i = 0; i < 100000; i++) {
        wrapped.write(`data${i}\r\n`);
    }
    wrapped.write(Buffer.from([0x00]));
    for(let i = 0; i < 100000; i++) {
        wrapped.write(`more_data${i}\r\n`);
    }
    wrapped.write(Buffer.from([0x00]));
    wrapped.end();
    console.log('finished sending test data');
});
server.listen(3333);

const duplexServer = createServer((con) => {
    console.log('client connected on duplex server. Sending test data');
    const wrapped = new MessageTranslator({ socket : con });
    const buf = Buffer.allocUnsafe(4);
    buf.writeInt32BE(1);
    wrapped.write(buf);
    for(let i = 0; i < 100000; i++) {
        wrapped.write(`duplex${i}\r\n`);
    }
    const endBuf = Buffer.allocUnsafe(4);
    endBuf.writeInt32BE(-1);
    wrapped.write(endBuf);
    wrapped.end();
    console.log('finished sending test data on duplex server');
}).listen(3334)