const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const httpResponse = 'HTTP/1.1 200 OK\r\n\r\n';
    socket.write(httpResponse);
    socket.end();
  });

  socket.on('close', () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Listening on 4221...');
});
