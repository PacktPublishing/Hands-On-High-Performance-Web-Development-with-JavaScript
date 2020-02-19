export default class LRUCache {
    constructor(num=10) {
        this.numEntries = num;
        this.cach = new Map();
    }

    add(file, url) {
        const val = {
            page : file,
            time : Date.now()
        }
        console.log('we added a file!')
        if( this.cache.size === this.numEntries ) {
            console.log('we replaced a file!');
            let top = Number.MAX_VALUE;
            let earliest = null;
            for(const [key, val] of this.cache) {
                if( val.time < top ) {
                    top = val.time;
                    earliest = key;
                }
            }
            this.cache.delete(earliest);
        }
        this.cache.set(url, val);
    }

    get(url) {
        const val = this.cache.get(url);
        if( val ) {
            console.log('we grabbed a file!');
            val.time = Date.now();
            this.cache.set(url, val);
            return val.page;
        }
        return null;
    }
}