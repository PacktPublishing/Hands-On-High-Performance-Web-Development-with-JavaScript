import { Worker } from 'worker_threads';

const data = {what: 'this', huh : 'yeah'};

const worker = new Worker("./worker.js");
worker.postMessage(data);
worker.on('message', (data) => {
    worker.terminate();
});
worker.on('exit', (code) => {
    console.log('our worker stopped with the following code: ', code);
})