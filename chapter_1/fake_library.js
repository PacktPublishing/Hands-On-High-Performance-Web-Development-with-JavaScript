window.Library = {
    sum : function() {
        let sum = 0;
        for(let i = 0; i < 10000; i++) {
            sum += i;    
        }
        return sum;
    },
    unusedItem : {
        item : 'this'
    },
    outerFun : function(run=false) {
        const innerFun = () => {
            let _i = Object.assign({}, this.unusedItem);
            let sumSum = 0;
            for(let i = 0; i < 10; i++) {
                sumSum += this.sum();
            }
            return sumSum;
        }
        if( run ) {
            return innerFun();
        } else {
            return 'nothin to run';
        }
    }
}