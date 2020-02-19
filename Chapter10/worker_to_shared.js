let sharedPort = null;
let buf = null;
onmessage = function(ev) {
    const data = ev.data;
    if( typeof data === 'number' ) {
        Atomics.add(buf, 0, 1);
    } else {
        buf = new Int32Array(ev.data);
    }
}