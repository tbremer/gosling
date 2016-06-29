import expect from 'expect';

import Maitre from '../src';
import { testPort, noop } from './utils';

describe('Maitre', () => {
  it('is a function', () => {
    expect(Maitre.constructor === Function).toEqual(true);
  });

  it('returns a prototype', () => {
    const app = new Maitre();
    const proto = [ 'close', /*'delete', 'get',*/ 'listen', /*'post', 'put',*/ 'use' ];

    proto.forEach(p => expect(app[p].constructor === Function, `${p} is not a function`).toEqual(true));
  });

  describe('port', () => {
    it('is undefined by default', () => {
      const app = new Maitre();

      expect(app.port === undefined).toEqual(true);
    });

    it('sets port number from the constructor', () => {
      const app = new Maitre(1337);

      expect(app.port === 1337).toEqual(true);
    });

    it('sets port number from a setter', () => {
      const app = new Maitre();

      app.port = 1337;

      expect(app.port === 1337).toEqual(true);
    });

    it('sets the portnumber through the listener', done => {
      const app = new Maitre();

      app.listen(1337);

      process.nextTick(() => {
        expect(app.port === 1337).toEqual(true);
        app.close(done);
      });
    });

    it('A port has to be set.', () => {
      const app = new Maitre();

      expect(() => {
        app.listen();
      }).toThrow('No port has been set.');
    });

    describe('disallows the port number to be overwritten', () => {
      it('port set in constructor cannot be modified', () => {
        const app = new Maitre(1337);

        expect(() => {
          app.port = 12345;
        }).toThrow('Port should not be reassigned.');
      });

      it('port set in constructor cannot be modified', () => {
        const app = new Maitre();

        app.port = 12345;

        expect(() => {
          app.listen(1111);
        }).toThrow('Port should not be reassigned.');
      });
    });
  });

  describe('close', () => {
    it('should close the existing server', async done => {
      const app = new Maitre(1337);

      app.listen();

      const EXPECT = await testPort(1337);

      expect(EXPECT).toEqual(true);
      app.close();
      const EXPECT2 = await testPort(1337);

      expect(EXPECT2).toEqual(false);
      done();
    });
  });

  describe('listen', () => {
    it('optionally takes a callback', done => {
      const spy = expect.createSpy();
      const app = new Maitre(1337);

      app.listen(spy);

      process.nextTick(() => {
        expect(spy).toHaveBeenCalled();
        app.close(done);
      });
    });

    it('starts listening on set port', async done => {
      const app = new Maitre(1337);

      app.listen();

      const EXPECT = await testPort(1337);

      expect(EXPECT).toEqual(true);
      app.close(done);
    });
  });

  describe('use', () => {
    let app;

    beforeEach(() => {
      app = new Maitre();
    });

    afterEach(() => {
      app.close();
      app = undefined;
    });

    it('should throw an error if you pass an empty path, and no thunk', () => {
      expect(() => {
        app.use('');
      }).toThrow('Use takes a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should throw an error if you pass a path but no thunk', () => {
      expect(() => {
        app.use('/');
      }).toThrow('Use takes a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should throw an error if you pass a path and a function and the path is not an object or a string', () => {
      expect(() => {
        app.use([], () => {});
      }).toThrow('Path must be an Object, String, or RegExp');

      expect(() => {
        app.use(true, () => {});
      }).toThrow('Path must be an Object, String, or RegExp');

      expect(() => {
        app.use(false, () => {});
      }).toThrow('Path must be an Object, String, or RegExp');
    });

    it('should allow you to pass a thunk as the first argument', () => {
      app.use(() => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should update `this.middlewares`', () => {
      app.use(() => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should be chainable', () => {
      app.use(() => {}).use(() => {});
      expect(app.middlewares.length).toEqual(2);
    });

    it('should allow paths to be String', () => {
      app.use('/', () => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow paths to be Objects', () => {
      app.use({
        path: '/',
        method: 'GET',
        thunk() { return; }
      });
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow paths to be RegExp objects', () => {
      app.use(/\/foo/, () => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow any method', () => {
      app.use(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(true);
      expect(app.middlewares[0].method.test('PUT')).toEqual(true);
      expect(app.middlewares[0].method.test('DELETE')).toEqual(true);
      expect(app.middlewares[0].method.test('UPDATE')).toEqual(true);
      expect(app.middlewares[0].method.test('POST')).toEqual(true);
    });
  });

  describe('get', () => {
    let app;

    beforeEach(() => {
      app = new Maitre();
    });

    afterEach(() => {
      app.close();
      app = undefined;
    });

    it('should throw an error if you pass an empty path, and no thunk', () => {
      expect(() => {
        app.get('');
      }).toThrow('Get takes a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should throw an error if you pass a path but no thunk', () => {
      expect(() => {
        app.get('/');
      }).toThrow('Get takes a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    });

    it('should throw an error if you pass a path and a function and the path is not an object or a string', () => {
      expect(() => {
        app.get([], () => {});
      }).toThrow('Path must be an Object, String, or RegExp');

      expect(() => {
        app.get(true, () => {});
      }).toThrow('Path must be an Object, String, or RegExp');

      expect(() => {
        app.get(false, () => {});
      }).toThrow('Path must be an Object, String, or RegExp');
    });

    it('should allow you to pass a thunk as the first argument', () => {
      app.get(() => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should update `this.middlewares`', () => {
      app.get(() => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should be chainable', () => {
      app.get(() => {}).get(() => {});
      expect(app.middlewares.length).toEqual(2);
    });

    it('should allow paths to be String', () => {
      app.get('/', () => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow paths to be Objects', () => {
      app.get({
        path: '/',
        method: 'GET',
        thunk() { return; }
      });
      expect(app.middlewares.length).toEqual(1);
    });

    it('should allow paths to be RegExp objects', () => {
      app.get(/\/foo/, () => {});
      expect(app.middlewares.length).toEqual(1);
    });

    it('should only use methods of GET', () => {
      app.get(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(true);
    });
  });
});
