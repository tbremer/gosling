import expect from 'expect';

import Maitre from '../src';
import { testPort } from './utils';

describe('Maitre', () => {
  it('is a function', () => {
    expect(Maitre.constructor === Function).toEqual(true);
  });

  it('returns a prototype', () => {
    const app = new Maitre();
    const proto = [ 'use', 'get', 'post', 'put', 'delete', 'listen' ];

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

      expect(app.port === 1337).toEqual(true);
      done();
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
});
