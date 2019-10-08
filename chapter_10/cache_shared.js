importScripts('./mock_customer_data.js');

const handleReq = function(arr) {
    const res = new Array(arr.length)
    for(let i = 0; i < arr.length; i++) {
        const num = arr[i];
        for(let j = 0; j < cache.length; j++) {
            if( num === cache[j].id ) {
                res[i] = cache[j];
                break;
            }
        }
    }
    return res;
}

onconnect = function(e) {
    let port = e.ports[0];
    port.onmessage = function(e) {
        const request = e.data;
        if( request.id &&
            Array.isArray(request.data) ) {
            const response = handleReq(request.data);
            console.log('we reached this point', response, request);
            port.postMessage({
                id : request.id,
                data : response
            });
        }
    }
}