// const dataToSend = new Array(1000000);
// const baseObj = {prop1 : 1, prop2 : 'one'};
// for(let i = 0; i < dataToSend.length; i++) {
//     dataToSend[i] = Object.assign({}, baseObj);
//     dataToSend[i].prop1 = i;
//     dataToSend[i].prop2 = `Data for ${i}`;
// }

// console.log('send at', Date.now());
// postMessage(dataToSend);
const viewOfData = new Int32Array(1000000);
for(let i = 1; i <= viewOfData.length; i++) {
    viewOfData[i] = i; 
}
console.log('data sent', Date.now());
postMessage(viewOfData, [viewOfData.buffer]);
console.log('length of our buffer', viewOfData.byteLength);