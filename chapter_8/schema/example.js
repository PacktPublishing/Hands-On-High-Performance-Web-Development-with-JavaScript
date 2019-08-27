const keys = ['item1', 'item2', 'item3'];
const values = [1, 'what', 2.2];
const tempObj = {};

for(let i = 0; i < keys.length; i++) {
    tempObj[keys[i]] = null;
}
for(let i = 0; i < values.length; i++) {
    tempObj[keys[i]] = values[i];
}

console.log(tempObj);