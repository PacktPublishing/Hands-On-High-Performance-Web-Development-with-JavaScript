const ports = [];
let data = null;
const buf = new SharedArrayBuffer(4);

const add = function(a, b) {
    return a + b;
}

const mult = function(a, b) {
    return a * b;
}

const divide = function(a, b) {
    return a / b;
}

const subtract = function(a, b) {
    return a - b;
}

onconnect = function(e) {
    let port = e.ports[0];
    port.onmessage = function(e) {
        console.log(e);
        if( typeof e.data === 'object' ) {
            console.log('was this hit?');
            data = new Int32Array(e.data);
        }
        console.log(e.data);
        const _d = e.data.split(' ');
        const in1 = parseInt(_d[1]);
        const in2 = parseInt(_d[2]);
        switch(_d[0]) {
            case 'add': {
                Atomics.store(data,0 ,add(in1, in2));
                //port.postMessage(add(in1, in2));
                break;
            }
            case 'subtract': {
                Atomics.store(data,0 , subtract(in1, in2));
                //port.postMessage(subtract(in1, in2));
                break;
            }
            case 'multiply': {
                Atomics.store(data,0 ,multiply(in1, in2));
                //port.postMessage(mult(in1, in2));
                break;
            }
            case 'divide': {
                Atomics.store(data,0 ,divide(in1, in2));
                //port.postMessage(divide(in1, in2));
                break;
            }
        }
    }
    console.log(buf);
    port.postMessage('here is data');
    ports.push(port);
}