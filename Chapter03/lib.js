const exports = {
    this : 'that',
    that : 'this'
}

export { exports as Item };

export default function() {
    console.log('this is going to be our simple lib');
}