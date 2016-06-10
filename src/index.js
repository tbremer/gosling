import { createServer } from 'http';

export default class Maitre {
  constructor(port = undefined, ...middlewares) {
    this.__port__ = port;
    this.middlewares = middlewares;
    this.server = createServer();
  }

  set port(p) {
    if (this.__port__ !== undefined) throw new Error('Port should not be reassigned.');

    this.__port__ = p;
  }

  get port() { return this.__port__; }

  use(thunk) {}
  get(thunk) {}
  post(thunk) {}
  put(thunk) {}
  delete(thunk) {}

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
