'use strict';
const http = require('http');
const pug = require('pug');
const auth = require('http-auth');
const basic = auth.basic(
	{realm: 'Enter usename and password.' },
	(username, password, callback) => {
		callback(username === 'guest' && password === 'xaXZJQmE');
	});
const server = http.createServer(basic,(req,res) => {
	const now = new Date();
	console.info('[' + now +'[ Requested by '+ req.connection.remoteAddress);
	if(req.url === '/logout') {
		res.writeHead(401, {
			'Content-Type': 'text/plain; charset=utf-8'
		});
		res.end('ログアウトしました');
		return;
	}

	res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
	//res.write(req.headers['user-agent']);
	switch (req.method) {
		case 'GET':
			//const fs = require('fs');
			//const rs = fs.createReadStream('./form.html');
			//rs.pipe(res);
			if (req.url === '/enquetes/yaki-shabu'){
				res.write(pug.renderFile('./form.pug',{
					path: req.url,
					firstItem: '焼肉',
					secondItem: 'しゃぶしゃぶ'
				}));
			}else if (req.url === '/enquetes/rice-bread') {
				res.write(pug.renderFile('./form.pug', {
						path: req.url,
						firstItem: 'ごはん',
						secondItem: 'パン'
				}));
			} else if (req.url === '/enquetes/sushi-pizza') {
				res.write(pug.renderFile('./form.pug', {
					path: req.url,
					firstItem: '寿司',
					secondItem: 'ピザ'
				}));
			}
			res.end();
			break;
		case 'POST':
			let body = [];
			req.on('data' ,(chunk) => {
				body.push(chunk);
			}).on('end', () => {
				body = Buffer.concat(body).toString();
				console.info('[' + now + '] Data posted: ' + body);
				const decoded = decodeURIComponent(body);
				console.info('[' + now + '] 投稿: ' + decoded);
				res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
					decoded + 'が投稿されました</h1></body></html>');
				res.end();
			});
			break;
		case 'DELETE':
			res.write('DELETE ' + req.rl);
			break;
		default:
			break;
	}
}).on('error', (e) =>{
	console.error('[' + new Date() + '] Server Error' , e);
}).on('clientError', (e) => {
	console.error('[' + new Date() + '] Client Error', e);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
	console.log('['+ new Date() + '] Listnening on ' + port);
});

