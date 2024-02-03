const { existsSync, readFileSync, writeFileSync } = require('fs');
const net = require('net');
const { resolve } = require('path');

// concurrency already implemented?

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const request = data.toString().split(/\s+/);
    console.log(request);
    const path = request[1];
    const method = request[0];

    const ok = 'HTTP/1.1 200 OK';
    const error = 'HTTP/1.1 404 Not found';
    const created = 'HTTP/1.1 201 Created';
    const typeText = 'Content-Type: text/plain';
    const typeOctet = 'Content-Type: application/octet-stream';
    const enter = '\r\n';

    if (path === '/') {
      socket.write(ok + enter + enter);
    } else if (path.match(/\/files/)) {
      const filePath = resolve(process.argv[3], path.slice(7));
      console.log('filePath', filePath);

      if (method === 'POST') {
        const fileContent = data.toString.split('\r\n');
        writeFileSync(filePath, fileContent);
        socket.write(created + enter + enter);
        socket.end();
      }

      if (!existsSync(filePath)) {
        console.log("Path doesn't exist");
        socket.write(error + enter + enter);
        return socket.end();
      }
      console.log('Exists!');

      const fileStream = readFileSync(filePath);
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
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Listening on 4221...');
});
