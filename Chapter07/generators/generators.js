import { Readable } from 'stream'
import { once } from 'events'
import { createWriteStream } from 'fs'

const data = [
    "here is some data",
    "here is some more data",
    "here is some some more data",
    "we are going to finish our data"
]

function* grabData() {
    while(data.length) {
        yield data.shift();
    }
}

function* handleData() {
    let _char = 97;
    while(_char < 123 ) { //char code of 'z'
        yield String.fromCharCode(_char++);
    }
}

const readable = Readable.from(handleData());
readable.on('data', (chunk) => {
    console.log(chunk);
});

(async() => {
    const readable2 = Readable.from(grabData());
    const tempFile = createWriteStream('./temp.txt');
    readable2.pipe(tempFile);
    await once(tempFile, 'finish');
    console.log('all done');
})();
