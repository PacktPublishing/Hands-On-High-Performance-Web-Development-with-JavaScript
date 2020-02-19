import { fork } from 'child_process';

const child = fork('child.js');
child.on('message', (msg) => {
    switch(msg) {
        case 'CONNECT': {
            console.log('our child is connected to us. Tell it to dispose of itself');
            setTimeout(() => {
                child.send('DISCONNECT');
            }, 15000);
            break;
        }
        case 'DISCONNECT': {
            console.log('our child is disposing of itself. Time for us to do the same');
            process.exit();
            break;
        }
    }
});