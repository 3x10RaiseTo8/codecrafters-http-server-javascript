const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (request) => {
    const [method, path] = request.toString().split(' ');

    const ok = 'HTTP/1.1 200 OK';
    const error = 'HTTP/1.1 404 Not found';
    const enter = '\r\n';

    if (path === '/') {
      socket.write(ok + enter + enter);
      socket.end();
    }
    if (path.startsWith('/echo/')) {
      const randomString = path.slice(6);
      const type = 'Content-Type: text/plain';
      const response = [
        ok,
        'Content-Type: text/plain',
        `Content-Length: ${randomString.length}`,
        '',
        randomString,
        '',
      ];
      socket.write(response.join(enter));
      socket.end();
    } else {
      socket.write(error + enter + enter);
      socket.end();
    }
  });

  socket.on('close', () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Listening on 4221...');
});
