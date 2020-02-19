import net from 'net';
import path from 'path';
import os from 'os';

const pipeName = (os.platform() === 'win32') ?
    path.join('\\\\?\\pipe', process.cwd(), 'temp') :
    path.join(process.cwd(), "temp");

const server = net.createServer().listen(pipeName)
server.on('connection', (socket) => {
    debugger;
    console.log('a socket has joined the party!');
    socket.write("DISCONNECT");
    socket.on('close', () => {
        console.log('socket has been closed!');
    });
});