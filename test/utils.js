import { createServer } from 'net';
import { request } from 'http';
import { request as requestSecure } from 'https';
import expect from 'expect';

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

export async function testUrl (url) {
  return new Promise((resolve, reject) => {
    request(url, res => {
      let data = '';

      res.on('data', d => data += d);
      res.on('end', () => resolve(data.toString()));
    })
    .on('error', e => reject(e))
    .end();
  });
}

export async function testHTTPSUrl (url) {
  if (url.constructor === Object && !url.rejectUnauthorized) url.rejectUnauthorized = false;

  return new Promise((resolve, reject) => {
    requestSecure(url, res => {
      let data = '';

      res.on('data', d => data += d);
      res.on('end', () => resolve(data.toString()));
    })
    .on('error', e => reject(e))
    .end();
  });
}

export function noop() {
  return null;
}

export function baseSuite(Module, type) {
  describe(`testing base suite on ${type}`, () => {
    let app;

    beforeEach(() => {
      app = new Module();
    });

    afterEach(() => {
      app.close();
      app = undefined;
    });

    it('should throw an error if you pass an empty path, and no thunk', () => {
      expect(() => {
        app[type]('');
      }).toThrow('Middleware take a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should throw an error if you pass a path but no thunk', () => {
      expect(() => {
        app[type]('/');
      }).toThrow('Middleware take a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should throw an error if you pass a path and a function and the path is not an object or a string', () => {
      expect(() => {
        const path = [];
        const thunk = () => {};

        app[type](path, thunk);
      }).toThrow('Path must be an Object, String, or RegExp');

      expect(() => {
        app[type](true, () => {});
      }).toThrow('Path must be an Object, String, or RegExp');

      expect(() => {
        app[type](false, () => {});
      }).toThrow('Path must be an Object, String, or RegExp');
    });

    it('should throw an error if you pass a requestObject without a thunk', () => {
      expect(() => {
        const requestObject = {
          path: /\//,
          method: /./,
          thunk: undefined
        };

        app[type](requestObject);
      }).toThrow('Middleware take a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should allow you to pass a thunk as the first argument', () => {
      app[type](() => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should update `this.middlewares`', () => {
      app[type](() => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should be chainable', () => {
      app[type](() => {})[type](() => {});
      expect(app.middlewares.length).toEqual(2);
    });

    it('should allow paths to be String', () => {
      app[type]('/', () => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow paths to be Objects', () => {
      app[type]({
        path: '/',
        method: 'GET',
        thunk() { return; }
      });
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow paths to be RegExp objects', () => {
      app[type](/\/foo/, () => {});
      expect(app.middlewares.length).toEqual(1);
    });
  });
}

export function useRequest() {
  return (req, res, next) => {
    res.write('request method: ');
    next();
  };
}

export function genericRequest () {
  return (req, res, next) => {
    res.write(req.method);
    next();
  };
}
