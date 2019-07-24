import quic from 'node-quic'

const port = 3000;
const address = '127.0.0.1';

quic.listen(port, address)
    .then(() => {})
    .onError((err) => console.error(err))
    .onData((data, stream, buffer) => {
        console.log('we received data:', data);
        if( data === 'quit' ) {
            console.log('we are going to stop listening for data');
            quic.stopListening();
        } else {
            stream.write("Thank you for the data!");
        }
    });