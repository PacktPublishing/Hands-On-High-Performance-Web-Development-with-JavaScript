import https from 'https';

https.get('https://en.wikipedia.org/wiki/Surprise_(emotion)', (res) => {
    if( res.statusCode === 200 ) {
        res.on('data', (data) => {
            console.log(data.toString('utf8'));
        });
        res.on('end', () => {
            console.log('no more information');
        });
    } else {
        console.error('bad error code!', res.statusCode);
    }
});
