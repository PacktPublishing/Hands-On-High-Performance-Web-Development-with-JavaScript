const add = function(a, b) {
    return function(b) {
        return a + b;
    }
}

console.log(add(2)(5), 'this will be 7');
const add5 = add(5);
console.log(add5(5), 'this will be 10');

const fullFun = function(a, b, c) {
    console.log('a', a);
    console.log('b', b);
    console.log('c', c);
}

const tempFun = fullFun.bind(null, 2);
setTimeout(() => {
    const temp2Fun = tempFun.bind(null, 3);
    setTimeout(() => {
        const temp3Fun = temp2Fun.bind(null, 5);
        setTimeout(() => {
            console.log('temp3Fun');
            temp3Fun();
        }, 1000);
    }, 1000);
    console.log('temp2Fun');
    temp2Fun(5)
}, 1000);
console.log('tempFun');
tempFun(3, 5);

const calculateArbitraryValueWithPrecision = function(prec=0, val) {
    return function(val) {
        return parseFloat((val / 1000).toFixed(prec));
    }
}

const arr = new Array(50000);
for(let i = 0; i < arr.length; i++) {
    arr[i] = i + 1000;
}

console.log(arr.map(calculateArbitraryValueWithPrecision(2)));