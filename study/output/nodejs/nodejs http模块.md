##### 1. nodejs从创建一个服务器，到接受一个请求的过程中的主要经过流程？
````javascript
const http = require('http');

http.createServer(requestListener).listen(3030);

function requestListener(req, res) {
	const body = [];
	req
		.on('error', err => console.log(err))
		.on('data', chunk => {
			body.push(chunk);
			console.log('chunk: ', chunk);
		})
		.on('end', () => {
			const data = Buffer.concat(body).toString();
			console.log('request body has be complete assembly! the data is: ', data);
			res.end('ok!');
		})
}
````
以上面代码为例，nodejs创建一个服务器，到接受一个请求的过程中，可分为三个阶段：

* create
* connect
* request

