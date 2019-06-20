process.on('message', (msg) => {
    switch(msg) {
        case 'DISCONNECT': {
            process.send('DISCONNECT');
            // time to remove ourselved
            process.exit();
            break;
        }
    }
});

process.send('CONNECT');