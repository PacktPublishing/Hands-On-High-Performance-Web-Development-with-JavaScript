import quic from 'node-quic'
import { StringDecoder } from 'string_decoder';

const port = 3000;
const address = '127.0.0.1';

process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    quic.send(port, address, data.trim())
        .onData((data) => {
            console.log('we received the following back: ', data);
        })
})