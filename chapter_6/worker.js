import { parentPort } from 'worker_threads';

parentPort.on('message', (msg) => {
    console.log('we received a message from our parent', msg);
    parentPort.postMessage({RECEIVED : true});
});

