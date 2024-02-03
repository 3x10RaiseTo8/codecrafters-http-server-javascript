const { existsSync, readFileSync } = require('fs');
const net = require('net');

// concurrency already implemented?

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const request = data.toString().split(/\s+/);
    const path = request[1];

    const ok = 'HTTP/1.1 200 OK';
    const error = 'HTTP/1.1 404 Not found';
    const typeText = 'Content-Type: text/plain';
    const typeOctet = 'Content-Type: application/octet-stream';
    const enter = '\r\n';

    if (path === '/') {
      socket.write(ok + enter + enter);
    } else if (path.match(/\/files/)) {
      const file = path.slice(7);
      const filePath = `${process.argv[3]}/${file}`;
      if (!existsSync(filePath)) {
        return socket.write(error);
      }
      const fileStream = readFileSync(filePath, 'utf-8');
      const response = [
        ok,
        typeOctet,
        `Content-Length: ${fileStream.length}`,
        '',
        fileStream,
        '',
      ];
      socket.write(response.join(enter));
    } else if (path.match(/\/user-agent/)) {
      const userAgent = request[request.indexOf('User-Agent:') + 1];
      const response = [
        ok,
        typeText,
        `Content-Length: ${userAgent.length}`,
        '',
        userAgent,
        '',
      ];
      socket.write(response.join(enter));
    } else if (path.startsWith('/echo/')) {
      const randomString = path.slice(6);
      const response = [
        ok,
        typeText,
        `Content-Length: ${randomString.length}`,
        '',
        randomString,
        '',
      ];
      socket.write(response.join(enter));
    } else {
      socket.write(error + enter + enter);
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
