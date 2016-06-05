export default class Maitre {
  constructor(port = undefined, ...middlewares) {
    this.__port__ = port;
    this.middlewares = middlewares;
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

  listen (p) {
    switch (true) {
      case (Boolean(p && !(this.port))):
        this.port = p;
        break;
      case (Boolean(p && this.port)):
        throw new Error('Port should not be reassigned.');
      case (Boolean(!p && !this.port)):
        throw new Error('No port has been set.');
      default:
        throw new Error('Default has been reached, please file a bug with your set up on https://github.com/tbremer/maitre Thanks!');
    }
  }
}