const fun = function() {
    const item = 10;
    for(let i = 0; i < item; i++) {
        const tempObj = {}
        tempObj[i] = "what " + i;
    }
    return function() {
        console.log('we will have access to other things');
        const alternative = 'what';

        return item;
    }
}

console.log('this is some code');
const x = 'what';
fun()();