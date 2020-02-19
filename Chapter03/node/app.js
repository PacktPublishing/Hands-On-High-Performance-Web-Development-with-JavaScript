const _static = require('node-static');

const serve = new _static.Server('./files');
require('http').createServer((req, res) => {
	req.addListener('end', () => {
		serve.serve(req, res);
	}).resume();
}).listen(8080);
