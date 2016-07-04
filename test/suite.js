import expect from 'expect';

import Maitre, { Router } from '../src';
import { testPort, testUrl, baseSuite, useRequest, genericRequest } from './utils';

describe('Maitre', () => {
  it('is a function', () => {
    expect(Maitre.constructor === Function).toEqual(true);
  });

  it('returns a prototype', () => {
    const app = new Maitre();
    const proto = [ 'close', 'delete', 'get', 'listen', 'post', 'put', 'use' ];

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
    baseSuite(Maitre, 'use');

    it('should allow any method', () => {
      const app = new Maitre();

      app.use(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(true);
      expect(app.middlewares[0].method.test('PUT')).toEqual(true);
      expect(app.middlewares[0].method.test('DELETE')).toEqual(true);
      expect(app.middlewares[0].method.test('UPDATE')).toEqual(true);
      expect(app.middlewares[0].method.test('POST')).toEqual(true);
    });

    it('should respond', async done => {
      const app = new Maitre(1337);

      app.listen();
      app.use('/', () => (req, res, next) => {
        res.write('hello world');
        next();
      });

      const response = await testUrl('http://localhost:1337/');

      expect(response).toEqual('hello world');

      app.close(done);
    });
  });

  describe('get', () => {
    baseSuite(Maitre, 'get');

    it('should only allow GET methods', () => {
      const app = new Maitre();

      app.get(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(true);
      expect(app.middlewares[0].method.test('PUT')).toEqual(false);
      expect(app.middlewares[0].method.test('DELETE')).toEqual(false);
      expect(app.middlewares[0].method.test('UPDATE')).toEqual(false);
      expect(app.middlewares[0].method.test('POST')).toEqual(false);
    });

    it('should respond', async done => {
      const app = new Maitre(1337);

      app.listen();
      app.get('/', () => (req, res, next) => {
        res.write('hello world');
        next();
      });

      const options = {
        hostname: 'localhost',
        path: '/',
        port: 1337,
        method: 'GET'
      };

      const response = await testUrl(options);

      expect(response).toEqual('hello world');

      app.close(done);
    });
  });

  describe('put', () => {
    baseSuite(Maitre, 'put');

    it('should only allow PUT methods', () => {
      const app = new Maitre();

      app.put(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(false);
      expect(app.middlewares[0].method.test('PUT')).toEqual(true);
      expect(app.middlewares[0].method.test('DELETE')).toEqual(false);
      expect(app.middlewares[0].method.test('UPDATE')).toEqual(false);
      expect(app.middlewares[0].method.test('POST')).toEqual(false);
    });

    it('should respond', async done => {
      const app = new Maitre(1337);

      app.listen();
      app.put('/', () => (req, res, next) => {
        res.write('hello world');
        next();
      });

      const options = {
        hostname: 'localhost',
        path: '/',
        port: 1337,
        method: 'PUT'
      };

      const response = await testUrl(options);

      expect(response).toEqual('hello world');

      app.close(done);
    });
  });

  describe('post', () => {
    baseSuite(Maitre, 'post');

    it('should only allow POST methods', () => {
      const app = new Maitre();

      app.post(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(false);
      expect(app.middlewares[0].method.test('PUT')).toEqual(false);
      expect(app.middlewares[0].method.test('DELETE')).toEqual(false);
      expect(app.middlewares[0].method.test('UPDATE')).toEqual(false);
      expect(app.middlewares[0].method.test('POST')).toEqual(true);
    });

    it('should respond', async done => {
      const app = new Maitre(1337);

      app.listen();
      app.post('/', () => (req, res, next) => {
        res.write('hello world');
        next();
      });

      const options = {
        hostname: 'localhost',
        path: '/',
        port: 1337,
        method: 'POST'
      };

      const response = await testUrl(options);

      expect(response).toEqual('hello world');

      app.close(done);
    });
  });

  describe('delete', () => {
    baseSuite(Maitre, 'delete');

    it('should only allow DELETE methods', () => {
      const app = new Maitre();

      app.delete(() => {});

      expect(app.middlewares.length).toEqual(1);
      expect(app.middlewares[0].method.test('GET')).toEqual(false);
      expect(app.middlewares[0].method.test('PUT')).toEqual(false);
      expect(app.middlewares[0].method.test('DELETE')).toEqual(true);
      expect(app.middlewares[0].method.test('UPDATE')).toEqual(false);
      expect(app.middlewares[0].method.test('POST')).toEqual(false);
    });

    it('should respond', async done => {
      const app = new Maitre(1337);

      app.listen();
      app.delete('/', () => (req, res, next) => {
        res.write('hello world');
        next();
      });

      const options = {
        hostname: 'localhost',
        path: '/',
        port: 1337,
        method: 'DELETE'
      };

      const response = await testUrl(options);

      expect(response).toEqual('hello world');

      app.close(done);
    });
  });

  describe('router', () => {
    const PORT = 1337;
    let app, router;

    beforeEach(() => {
      app = new Maitre(PORT);
      router = new Router();

      app.listen();
    });

    afterEach(async done => {
      const isRunning = await testPort(PORT);

      if (isRunning) await app.close();
      app = router = undefined;
      done();
    });

    it('updates middlewares', () => {
      router.use('/', () => {});
      router.use('/foo', () => {});

      app.use(router);

      expect(app.middlewares.length).toEqual(2);
    });

    it('should allow responses', async (done) => {
      router.use(useRequest);
      router.get('/', genericRequest);
      router.post('/', genericRequest);
      router.put('/', genericRequest);
      router.delete('/', genericRequest);

      app.use(router);

      const options = {
        hostname: 'localhost',
        path: '/',
        port: 1337
      };

      const getResponse = await testUrl({ ...options, method: 'GET' });
      const postResponse = await testUrl({ ...options, method: 'POST' });
      const putResponse = await testUrl({ ...options, method: 'PUT' });
      const deleteResponse = await testUrl({ ...options, method: 'DELETE' });

      expect(getResponse).toEqual('request method: GET');
      expect(postResponse).toEqual('request method: POST');
      expect(putResponse).toEqual('request method: PUT');
      expect(deleteResponse).toEqual('request method: DELETE');

      app.close(done);
    });

    it('should allow string prefxied responses', async done => {
      router.use(useRequest);
      router.get('/', genericRequest);
      router.post('/', genericRequest);
      router.put('/', genericRequest);
      router.delete('/', genericRequest);

      app.use('/api', router);

      const options = {
        hostname: 'localhost',
        path: '/api/',
        port: PORT
      };

      const getResponse = await testUrl({ ...options, method: 'GET' });
      const postResponse = await testUrl({ ...options, method: 'POST' });
      const putResponse = await testUrl({ ...options, method: 'PUT' });
      const deleteResponse = await testUrl({ ...options, method: 'DELETE' });

      expect(getResponse).toEqual('request method: GET');
      expect(postResponse).toEqual('request method: POST');
      expect(putResponse).toEqual('request method: PUT');
      expect(deleteResponse).toEqual('request method: DELETE');

      app.close(done);
    });

    it('should allow regex prefxied responses', async done => {
      router.use(useRequest);
      router.get('/', genericRequest);
      router.post('/', genericRequest);
      router.put('/', genericRequest);
      router.delete('/', genericRequest);

      app.use(/\/api/, router);

      const options = {
        hostname: 'localhost',
        path: '/api/',
        port: PORT
      };

      const getResponse = await testUrl({ ...options, method: 'GET' });
      const postResponse = await testUrl({ ...options, method: 'POST' });
      const putResponse = await testUrl({ ...options, method: 'PUT' });
      const deleteResponse = await testUrl({ ...options, method: 'DELETE' });

      expect(getResponse).toEqual('request method: GET');
      expect(postResponse).toEqual('request method: POST');
      expect(putResponse).toEqual('request method: PUT');
      expect(deleteResponse).toEqual('request method: DELETE');

      app.close(done);
    });

    it('should allow for nested prefixes', async done => {
      const MSG = 'Hello world';
      const subRouter = new Router();

      subRouter.get('/baz', () => (req, res, next) => {
        res.write(MSG);
        next();
      });
      router.use('/bar', subRouter);

      app.use('/foo', router);

      const options = {
        hostname: 'localhost',
        path: '/foo/bar/baz',
        port: PORT
      };

      const getResponse = await testUrl({ ...options, method: 'GET' });

      expect(getResponse).toEqual(MSG);
      app.close(done);
    });
  });
});
