const http = require('./http');

const server = http.createServer((req, res) => {
	res.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type',
	});
	res.on('data', chunk => {
		console.log('\n=========== chunk ===========\n', chunk.toString());
	});
	res.on('end', () => {
		res.end('hahhsd');
	})
});

server.listen(3030);