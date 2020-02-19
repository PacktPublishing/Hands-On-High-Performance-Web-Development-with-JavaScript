const state = {};

export default updateState = function(update) {
    const x = Object.keys(update);
    for(let i = 0; i < x.length; i++) {
        state[x[i]] = update[x[i]];
    }
}