import dgram from 'dgram';
import { Socket } from 'net';
const multicastAddress = '239.192.0.0';
const sendMessageBadOutput = 'message needs to be formatted as follows: BUY|SELL <SYMBOL> <NUMBER>';
const recvClient = dgram.createSocket({type : 'udp4', reuseAddr: true });
const sendClient = new Socket().connect(3000, "127.0.0.1");
recvClient.on('connect', () => {
    console.log('client is connected to the server');
});
recvClient.on('message', (msg) => {
    console.log('client received message', msg.toString('utf8'));
});
recvClient.bind(3000, () => {
    recvClient.addMembership(multicastAddress);
});
process.stdin.setEncoding('utf8');
process.stdin.on('data', (msg) => {
    const input = msg.split(' ');
    if( input.length !== 3 ) {
        console.log(sendMessageBadOutput);
    }
    const num = parseInt(input[2]);
    console.log('number is', num);
    if( num.toString() === 'NaN' ) {
        console.log(sendMessageBadOutput);
    }
    sendClient.write(msg);
});
sendClient.on('data', (data) => {
    console.log(data.toString('utf8'));
});