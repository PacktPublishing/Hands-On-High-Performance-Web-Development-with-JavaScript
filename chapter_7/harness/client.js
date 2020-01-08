import { Socket } from 'net';

const socket = new Socket();
socket.on('data', (data) => {
    console.log('data', data);
})
socket.connect({host : 'localhost', port : 3333});