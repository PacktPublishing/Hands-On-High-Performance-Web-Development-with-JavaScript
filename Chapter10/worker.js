let sharedPort = null;

function calculatePrimes(val) {
    let numForPrimes = val;
    const primes = [];
    while( numForPrimes % 2 === 0 ) {
        primes.push(2);
        numForPrimes /= 2;
    }
    for(let i = 3; i <= Math.sqrt(numForPrimes); i+=2) {
        while( numForPrimes % i === 0 ) {
            primes.push(i);
            numForPrimes /= i;
        }
    }
    if( numForPrimes > 2 ) {
        primes.push(numForPrimes);
    }
    return primes;
}
onmessage = function(ev) {
    const data = ev.data;
    if( typeof data === 'string' ) {
        if( data === 'quit' ) {
            return close();
        } else {
            sharedPort.postMessage(data);
        }
    }
    if( typeof data === 'number' ) {
        const result = calculatePrimes(data);
        const send = new Int32Array(result);
        return postMessage(send, [send.buffer]);
    }
    // handle the port
    sharedPort = data;
    console.log(sharedPort);
    sharedPort.onmessage = function(ev) {
        console.log('data', ev.data);
    } 
}
// const mainChannelName = name.includes("odd") ? "odd" : "even";
// const mainChannel = new BroadcastChannel(mainChannelName);
// mainChannel.onmessage = function(ev) {
//     if( typeof ev.data === 'number' ) {
//         const result = calculatePrimes(ev.data);
//         const send = new Int32Array(result);
//         this.postMessage(result, [result.buffer]);
//     }
// }
// const globalChannel = new BroadcastChannel('global');
// globalChannel.onmessage = function(ev) {
//     if( ev.data === 'quit' ) {
//         close();
//     }
// }

