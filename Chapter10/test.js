const channel = new BroadcastChannel('workers');
channel.onmessage = function(ev) {
    console.log(ev.data, 'was received by', name);
}