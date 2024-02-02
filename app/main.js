const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    data = data.toString();
    const path = data.match(/ (.*) /);

    if (path[1] === '/') {
      const response = 'HTTP/1.1 200 OK\r\n\r\n';

      socket.write(response);
      socket.end();
    }
    const error = 'HTTP/1.1 404 Not found\r\n\r\n';
    socket.write(error);
  });

  socket.on('close', () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Listening on 4221...');
});
