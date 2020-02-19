const http = require('http');

const erver = http.createServer((req, res) => {
	console.log(req.url, req.method);
	res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Credentials', "true");
    res.setHeader('Access-Control-Allow-Methods', "GET,HEAD,OPTIONS");
    res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Accept")
	if( req.method === "GET" ) {
		switch(req.url) {
			case '/sample': {
				res.write(Buffer.from(JSON.stringify({what : 'this'})));
				res.end();
				break;
			}
			case '/rot': {
				res.write(Buffer.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
				res.end();
				break;
			}
			case '/longload': {
				setTimeout(() => {
					res.write(Buffer.from("a very long load!"));
					res.end();
				}, 10000);
			}
		}
	}
	
}).listen(8081);
