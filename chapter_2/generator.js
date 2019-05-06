const simpleGenerator = function* () {
    let it = 0;
    for(;;) {
        yield it;
        it++;
    }
}

const sg = simpleGenerator();
for(let i = 0; i < 10; i++) {
    console.log(sg.next().value);
}
sg.return();

console.log(sg.next().value);

const timing = function*(time) {
    yield Date.now() - time;
}

const time = timing(Date.now());
let sum  = 0;
for(let i = 0; i < 1000000; i++) {
    sum = sum + i;
}
console.log(time.next().value);

const nums = function*(fn=null) {
    let i = 0;
    for(;;) {
        yield i;
        if( fn ) {
            i += fn(i);
        } else {
            i += 1;
        }
    }
}

const data = [];
for(let i in nums()) {
    if( i > 100 ) {
        break;
    }
    data.push(i);
}

console.log('data', data);

const nums = function*(fn=null) {
    let i = 0;
    for(;;) {
        yield i;
        if( fn ) {
            i += fn(i);
        } else {
            i += 1;
        }
    }
}

const data = [];
const gen = nums();
for(let i of gen) {
    console.log(i);
    if( i > 100 ) {
        break;
    }
    data.push(i);
}

const fakestream = function*(data) {
    const chunkSize = 10;
    const dataLength = data.length;
    let i = 0;
    while(i < dataLength ) {
        const outData = [];
        for(let j = 0; j < chunkSize; j++) {
            outData.push(data[i]);
            i+=1;        
        }
        yield outData;
    }
}

for(let i of fakestream(data)) {
    console.log(i);
}

const trampoline = fun => {
    return (...arguments) => {
        let result = fun(...arguments);
        while( typeof result === 'function' ) {
            result = result();
        }

        return result;
    }
}

const _d = new Array(100000);
for(let i = 0; i < _d.length; i++) {
    _d[i] = i;
}

const recurseSummer = function(data, sum=0) {
    if(!data.length) {
        return sum;
    } 
    return () => recurseSummer(data.slice(1), sum + data[0]);
}

const recurseFilter = function(data, con, filtered=[]) {
    if(!data.length) {
        return filtered;
    }
    return () => recurseFilter(data.slice(1),con, con(data[0]) ? filtered.length ? new Array(...filtered, data[0]) : [data[0]] : filtered);
}

const finalFilter = trampoline(recurseFilter);
console.log(finalFilter(_d, item => item % 2 === 0));