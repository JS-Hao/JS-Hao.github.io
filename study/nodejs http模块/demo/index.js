const http = require('./http');

const server = http.createServer((req, res) => {
	// console.log('request', req, res);
	res.on('data', chunk => {
		console.log('==================chunk: ', chunk.toString());
	})
});

server.listen(3030);