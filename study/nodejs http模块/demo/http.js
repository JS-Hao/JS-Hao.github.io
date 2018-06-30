const net = require('net');
const EventEmitter = require('events');
const { STATUS_CODES } = require('./constants');
const FreeList = require('./freelist');
const { HTTPParser } = process.binding('http_parser');

const kIncomingMessage = Symbol('IncomingMessage');
const kServerResponse = Symbol('ServerResponse');
const kOnHeaders = HTTPParser.kOnHeaders;
const kOnHeadersComplete = HTTPParser.kOnHeadersComplete;
const kOnBody = HTTPParser.kOnBody;
const kOnMessageComplete = HTTPParser.kOnMessageComplete;

// 创建parsers池
const parsers = new FreeList('parsers', 1000, function() {
	const parser = new HTTPParser(HTTPParser.REQUEST);
	parser.onIncoming = parserOnIncoming;
	return parser;
});

// 调用http.createServer将创建Server类的实例
function createServer(options, requestListener) {
	return new Server(options, requestListener);
}

// Server类继承于net.Server
class Server extends net.Server {
	constructor(options, requestListener) {
		super({ allowHalfOpen: true });

		if (typeof options === 'function') {
			requestListener = options;
			options = {};
		}

		this[kIncomingMessage] = options.IncomingMessage || IncomingMessage;
		this[kServerResponse] = options.ServerResponse || ServerResponse;
		
		requestListener && this.on('request', requestListener);

	 	this.on('connection', connectionListener.bind(this));
	}
}

function parserOnIncoming(headers, socket, server) {
	var res = new ServerResponse(socket);
	console.log('zhazha')
	server.emit('request', headers, res);
}

function IncomingMessage() {}

function connectionListener(socket) {
	console.log('SERVER new http connection');

	const server = this;

	const parser = parsers.alloc();

	socket.parser = parser;

	parser[kOnHeaders] = function(data) {
		console.log('onHeaders', data);
	}

	parser[kOnHeadersComplete] = function() {
		console.log('\n\n\n\nonHeadersComplete');
		// Array.from(arguments).map(item => console.log(item));

		// parser.incoming = new IncomingMessage(socket);

		parser.onIncoming(arguments[2], socket, server);
	}

	parser[kOnBody] = function() {
		console.log('\n\n\n\nonBody');
		// Array.from(arguments).map(item => console.log(item.toString()));
		socket.response.emit('data', arguments[0]);
	}

	parser[kOnMessageComplete] = function() {
		console.log('\n\n\n\nonMessageComplete');
		// Array.from(arguments).map(item => console.log(item));
	}

	socket.on('end', () => console.log('end'));
	// socket.on('data', chunk => {
	// 	console.log(chunk.toString());
	// 	socket.end('HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Content-Type\r\n\r\nhello world!');
	// })
	socket.on('data', function(chunk) {		
		const ret = parser.execute(chunk);
		// socket.end('HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Content-Type\r\n\r\nhello world!');
		
	});

}






class ServerResponse extends EventEmitter {
	constructor(socket) {
		super();
		this.socket = socket;
		this.headers = '';
		socket.response = this;
	}

	writeHead(status_code, headers) {
		headers = headers || {};
		if (!STATUS_CODES[status_code]) {
			return console.error('status_code is not exit!');
		}

		this.headers += `HTTP/1.1 ${ status_code } ${ STATUS_CODES[status_code] }\r\n`;
		for (let key in headers) {
			this.headers += `${ key }: ${ headers[key] }\r\n`;
		}
	}

	end(data) {
		if (!this.headers) {
			this.writeHead(200);
		};
		console.log(`${ this.headers }\r\n${ data }`);
		this.socket.end(`${ this.headers }\r\n${ data }`);
	}

	// on(type, callback) {
	// 	console.log(type, callback);
	// 	this.socket.on(type, callback);
	// }
}


module.exports = {
	Server,
	createServer,
}	