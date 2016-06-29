import { createServer } from 'http';
import { createRequestObj, defaultPathObj } from './utils';

export default class Maitre {
  constructor(port = undefined, ...middlewares) {
    this.__port__ = port;
    this.middlewares = middlewares;
    this.server = createServer();

    this.server._events.request = this.middlewares;
  }

  set port(p) {
    if (this.__port__ !== undefined) throw new Error('Port should not be reassigned.');

    this.__port__ = p;
  }

  get port() { return this.__port__; }

  use(path, thunk) {
    if ((!path && !thunk) || (path && path.constructor !== Function && !path.thunk && !thunk)) throw new Error('Use takes a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
    if (path.constructor === Function) {
      thunk = path;
      path = Object.assign({}, defaultPathObj);
    }

    this.middlewares.push(createRequestObj(path, thunk));

    return this;
  }

  // get(path, thunk) {}
  // post(path, thunk) {}
  // put(path, thunk) {}
  // delete(path, thunk) {}

  close(func = () => {}) {
    this.server.close(func);
  }

  listen (p, func) {
    let callback = func ? func : () => {};

    switch (true) {
      case (Boolean(!p && this.port)):
        break;

      case (Boolean(p && !(this.port))):
        this.port = p;
        break;

      case (Boolean(p && p.constructor === Function && this.port)):
        callback = p;
        break;

      case (Boolean(!p && !this.port)):
      case (Boolean(p && p.constructor === Function && !(this.port))):
        throw new Error('No port has been set.');

      case (Boolean(p && this.port)):
        throw new Error('Port should not be reassigned.');

      default:
        throw new Error('Default has been reached, please file a bug with your set up on https://github.com/tbremer/maitre Thanks!');
    }

    this.server.listen(this.port, callback);
  }
}
