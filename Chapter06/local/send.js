import net from 'net';
import https from 'https';
import pipeName from './helper.js';

const socket = new net.Socket().connect(pipeName());
socket.on('data', (data) => {
    if( data.toString('utf8') === 'WHOIS' ) {
        return socket.write('send');
    }
    const all = []
    https.get(data.toString('utf8'), (res) => {
        res.on('data', (data) => {
            all.push(data.toString('utf8'));
        });
        res.on('end', () => {
            socket.write('!!!BEGIN!!!');
            socket.write(all.join(''));
            socket.write('!!!END!!!');
        });
    }).on('error', (err) => {
        socket.write('!!!FALSE!!!');
    })
    console.log('we received data from the main application', data.toString('utf8'));
});