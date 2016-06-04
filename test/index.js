import Maitre from '../src';
import assert from 'assert';


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
    it('sets port number from the constructor');
    it('sets port number from the setter');
    it('sets the portnumber through the listener');
    it('disallows the port number to be over written');
  });
});
