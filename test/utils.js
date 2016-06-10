import { createServer } from 'net';

export async function testPort (port) {
  return new Promise(resolve => {
    const server = createServer();

    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        return resolve(true);
      }
    });

    server.once('listening', () => {
      server.close();

      resolve(false);
    });

    server.listen(port);
  });
}
