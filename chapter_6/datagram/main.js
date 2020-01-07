import dgram from 'dgram';
import net from 'net';

const multicastAddress = '239.192.0.0';
const badListingNumMessage = 'to list a new ticker the following format needs to be followed <SYMBOL>|<NUMBER>';
const symbolTable = new Map();
const clientTable = new Map();
const server = dgram.createSocket({type : 'udp4', reuseAddr : true}).bind(3000);
const recvServer = net.createServer().listen(3000, '127.0.0.1');
recvServer.on('connection', (socket) => {
    const temp = new Map();
    const availableSymbols = Object.keys(symbolTable);
    console.log(availableSymbols);
    for(let i = 0; i < availableSymbols.length; i++) {
        temp.set(availableSymbols[i], 0);
    }
    clientTable.set(socket, temp);
    socket.on('data', (msg) => {
        // logic to say if we are able to actually process request
        const input = msg.toString('utf8').split(' ');
        if( input.length !== 3 ) {
            console.log('wrong number of arguments');
            socket.write('ERROR!');
            return;
        }
        if( input[0] !== 'SELL' &&
            input[0] !== 'BUY' ) {
            console.log('this is not a command');
            socket.write('ERROR!');
            return;
        }
        const buyOrSell = input[0];
        const tickerSymbol = input[1];
        const num = parseInt(input[2]);
        if( typeof num === 'NaN' ) {
            console.log('the amount that the client wants to buy or sell is not a number');
            socket.write('ERROR!');
            return;
        }
        // number held by server
        const numHeld = symbolTable.get(input[1]);
        if( typeof numHeld === 'undefined' ||
            (buyOrSell === 'BUY' && (
                num <= 0 ||
                numHeld - num <= 0
            ))) {
            console.log('there is not that many shares currently held by the reserve');
            socket.write('ERROR!');
            return;
        }
        // check to make sure the client has that amount in their book
        const clientBook = clientTable.get(socket);
        const clientAmount = clientBook.get(tickerSymbol);
        console.log(clientAmount);
        if( buyOrSell === 'SELL' &&
            clientAmount - num < 0 ) {
            console.log('the client does not hold that amount in their book');
            socket.write('ERROR!');
            return;
        }
        // process the request
        if(  buyOrSell === 'BUY' ) {
            clientBook.set(tickerSymbol, clientAmount + num);
            symbolTable.set(tickerSymbol, numHeld - num);
        } else if( buyOrSell === 'SELL' ) {
            clientBook.set(tickerSymbol, clientAmount - num);
            symbolTable.set(tickerSymbol, numHeld + num);
        } else {
            return;
        }
        const m = Buffer.from(`${tickerSymbol} ${symbolTable.get(tickerSymbol)}`);
        server.send(m, 0, m.byteLength, 3000, multicastAddress);
        socket.write(`successfully processed request, you now hold ${clientBook.get(tickerSymbol)} of ${tickerSymbol}`);
        console.log('processed request', tickerSymbol, symbolTable.get(tickerSymbol));
    });
    socket.on('error', (err) => console.log('client removed from list'));
});
server.on('message', (msg, info) => {
    console.log('we received a msg', msg, info);
});
server.on('error', (err) => {
    console.error(`server err: ${err.stack}`);
    server.close();
});
server.on('listening', () => {
    console.log(`udp server listening on ${JSON.stringify(server.address())}`);
});
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    const input = data.split(' ');
    if( input.length !== 2 ) {
        console.log(badListingNumMessage);
        return;
    }
    const num = parseInt(input[1]);
    if( num.toString() === 'NaN' ) {
        console.log(badListingNumMessage);
        return;
    }
    symbolTable.set(input[0], num);
    for( const client of clientTable ) {
        client[1].set(input[0], 0);
    }
    server.send(Buffer.from(data), 0, data.length, 3000, multicastAddress);
});