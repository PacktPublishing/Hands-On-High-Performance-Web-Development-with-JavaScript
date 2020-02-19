const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Credentials', "true");
    res.setHeader('Access-Control-Allow-Methods', "GET,HEAD");
    res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    res.end();
}).listen(8081);