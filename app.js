const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();


// app.get('/', (req, res) => {
//   res.writeHead(200, { 'Content-type': 'text/html; charset=utf-8' });
//   res.end('<h1>Hello node.js안녕 server!</h1>');
// });

router.route('/').get((req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node.js Server</h1>');
  res.write('<h3>오신것을 환영합니다!</h3>');
  res.end();
});

app.use('/', router);


const server = http.createServer(app);
server.listen(3000, () => {
  console.log('서버 실행중 : http://localhost:3000');
});