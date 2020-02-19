import net from 'net';
import path from 'path';
import os from 'os';

const pipeName = (os.platform() === 'win32') ?
    path.join('\\\\?\\pipe', process.cwd(), 'temp') :
    path.join(process.cwd(), "temp");

const socket = new net.Socket().connect(pipeName);
socket.on('connect', () => {
    console.log('we have connected');
})
socket.on('data', (data) => {
    if( data.toString('utf8') === 'DISCONNECT') {
        socket.destroy();
    }
});