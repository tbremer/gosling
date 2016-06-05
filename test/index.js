import assert from 'assert';
import expect from 'expect';

import Maitre from '../src';

describe('Maitre', () => {
  it('is a function', () => {
    assert(Maitre.constructor === Function);
  });

  it('returns a prototype', () => {
    const app = new Maitre();
    const proto = [ 'use', 'get', 'post', 'put', 'delete', 'listen' ];

    proto.forEach(p => assert(app[p].constructor === Function, `${p} is not a function`));
  });

  describe('port', () => {
    it('is undefined by default', () => {
      const app = new Maitre();

      assert(app.port === undefined);
    });

    it('sets port number from the constructor', () => {
      const app = new Maitre(1337);

      assert(app.port === 1337);
    });

    it('sets port number from a setter', () => {
      const app = new Maitre();

      app.port = 1337;

      assert(app.port === 1337);
    });

    it('sets the portnumber through the listener', done => {
      const app = new Maitre();

      app.listen(1337);

      assert(app.port === 1337);
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
});
