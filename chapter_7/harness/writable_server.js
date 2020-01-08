import { createServer } from 'net'
import WrappedWritableStream from '../writable/main.js'
const server = createServer((con) => {
    console.log('client connected. sending test data');
    const wrapped = new WrappedWritableStream({ socket : con });
    for(let i = 0; i < 100000; i++) {
        wrapped.write(`data${i}\r\n`);
    }
    wrapped.write(Buffer.from([0x00]));
    wrapped.end();
    console.log('finished sending test data');
});
server.listen(3333);