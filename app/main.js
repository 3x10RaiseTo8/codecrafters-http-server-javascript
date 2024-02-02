const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const [method, path] = data.toString().split(' ');

    const ok = 'HTTP/1.1 200 OK\r\n\r\n';
    const error = 'HTTP/1.1 404 Not found\r\n\r\n';

    if (path === '/') {
      socket.write(ok);
      socket.end();
    }
    if (path.startsWith('/echo/')) {
      const randomString = path.slice(6);
      const type = 'Content-Type: text/plain';
      const length = `Content-Length: ${randomString.length}`;
      const response = [ok, type, length, '', randomString, ''];
      socket.write(response.join('\r\n'));
    } else {
      socket.write(error);
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
