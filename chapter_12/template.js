import { Transform, PassThrough } from 'stream'
import { once } from 'events'
import Remarkable from 'remarkable'
import fs from 'fs'
import path from 'path'

class Pair {
    constructor() {
        this.start = -1;
        this.end = -1;
    }
}

const MarkdownRenderer = new Remarkable.Remarkable();

const processPattern = function(pattern, templateDir, publishDir, vars=null) {
    const process = pattern.toString('utf8').trim();
    const LOOP = "loop";
    const FIND = "from";
    const FILE = "file";
    const breakdown = process.split(' ');
    switch(breakdown[0]) {
        case LOOP: {
            const num = parseInt(breakdown[1]);
            const bufs = new Array(num);
            const varName = breakdown[2].trim();
            for(let i = 0; i < num; i++) {
                let temp = breakdown.slice(3).join(' ');
                const replace = /\${([0-9a-zA-Z]+)}/
                let results = replace.exec(temp);
                while( results ) {
                    if( vars[varName][i][results[1]] ) {
                        temp = temp.replace(results[0], vars[varName][i][results[1]]);
                    }
                    results = replace.exec(temp);
                }
                bufs[i] = Buffer.from(temp);
            }
            return Buffer.concat(bufs);
        }
        case FIND: {
            const type = breakdown[1];
            const HTML = 'html';
            const CSS  = 'css';
            if(!(type === HTML || type === CSS)) return new Error("This is not a valid template type! " + breakdown[1]);
            return fs.readFileSync(path.join(templateDir, type, `${breakdown[2]}.${type}`));
        }
        case FILE: {
            const file = breakdown[1];
            const html = MarkdownRenderer.render(fs.readFileSync(path.join(publishDir, vars.fileToProcess || file[1])).toString('utf8'));
            return Buffer.from(html);
        }
        default:
            return new Error("Process directory not found! " + breakdown[0]);
    }
}

export default class TemplateBuilder extends Transform {
    constructor(opts={}) {
        super(opts);
        if( opts.templateDirectory ) {
            this.template = opts.templateDirectory;
        }
        if( opts.templateVariables ) {
            this.vars = opts.templateVariables;
        }
        if( opts.publishDirectory ) {
            this.publish = opts.publishDirectory;
        }
        this.pair = new Pair();
        this.beforePattern = Buffer.from("<%");
        this.afterPattern = Buffer.from("%>");
        this.pattern = [];
    }
    _transform(chunk, encoding, cb) {
        let location = 0;
        do {
            if(!this.pattern.length && this.pair.start === -1 ) {
                const tLoc = location;
                location = chunk.indexOf(this.beforePattern, location);
                if( location !== -1 ) {
                        this.push(chunk.slice(tLoc, location));
                    
                    location += 2;
                    this.pair.start = location;
                } else {
                        this.push(chunk.slice(tLoc));
                } 
            } else {
                if( this.pair.start !== -1 ) {
                    location = chunk.indexOf(this.afterPattern, location);
                    if( location !== -1 ) {
                        this.pair.end = location;
                        location += 2;
                        this.push(processPattern(chunk.slice(this.pair.start, this.pair.end), this.template, this.publish, this.vars));
                        this.pair = new Pair();
                    } else {
                        this.pattern.push(chunk.slice(this.pair.start));
                    }
                } else {
                    let tLoc = location;
                    location = chunk.indexOf(this.afterPattern, location);
                    if( location !== -1 ) {
                        this.pattern.push(chunk.slice(0, location));
                        location += 2;
                        this.push(processPattern(Buffer.concat(this.pattern), this.template, this.publish, this.vars));
                        this.pattern = [];
                    } else {
                        if(!this.pattern.length ) {
                        
                            this.push(chunk.slice(tLoc));
                        } else {
                            this.pattern.push(chunk);
                        }
                    }
                }
            }
        }
        while( location !== -1 );
        if( this.pattern.length === 1 &&
            this.pattern[0].indexOf(this.beforePattern) === -1) {
            this.push(this.pattern.pop());
        }
        cb();
    }
    _flush(cb) {
        cb();
    }
}

export class LoopingStream extends Transform {
    constructor(opts={}) {
        super(opts);
        if( 'loopAmount' in opts ) {
            this.numberOfRolls = opts.loopAmount || 1;
        }
        if( opts.vars ) {
            this.vars = opts.vars;
        }
        if( opts.dir) {
            this.dir = opts.dir;
        }
        if( opts.publish ) {
            this.publish = opts.publish;
        }
        this.data = [];
    }
    _transform(chunk, encoding, cb) {
        this.data.push(chunk);
        cb();
    }
    async _flush(cb) {
        let tData = Buffer.concat(this.data);
        let tempBuf = [];
        for(let i = 0; i < this.numberOfRolls; i++) {
            const passThrough = new PassThrough();
            const templateBuilder = new TemplateBuilder({ 
                templateDirectory : this.dir, 
                templateVariables : this.vars,
                publishDirectory  : this.publish 
            });
            passThrough.pipe(templateBuilder);
            templateBuilder.on('data', (data) => {
                tempBuf.push(data);
            });
            passThrough.end(tData);
            await once(templateBuilder, 'end');
            tData = Buffer.concat(tempBuf);
            tempBuf = [];
        }
        this.push(tData);
        cb();
    }
}