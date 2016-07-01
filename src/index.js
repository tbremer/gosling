import { createServer } from 'http';
import { createRequestObj, noop } from './utils';

export default class Maitre {
  constructor(port = undefined, ...middlewares) {
    this.__port__ = port;
    this.middlewares = middlewares;
    this.server = createServer();

    this.server.on('request', (req, res) => {
      let index = -1;

      const next = () => {
        index++;
        const middleware = this.middlewares[index];

        if (!middleware) {
          if (!res.finished) res.end('foo');
          index = -1;

          return;
        }

        if (!middleware.path.test(req.url)) return next();
        if (!middleware.method.test(req.method)) return next();
        const thunk = middleware.thunk();

        return thunk(req, res, next);
      };

      next();
    });
  }

  set port(p) {
    if (this.__port__ !== undefined) throw new Error('Port should not be reassigned.');

    this.__port__ = p;
  }

  get port() { return this.__port__; }

  use(path, thunk) {
    const method = /./;
    const requestObj = createRequestObj({ path, thunk, method });

    this.middlewares.push(requestObj);

    return this;
  }

  get(path, thunk) {
    const method = /GET/i;
    const requestObj = createRequestObj({ path, thunk, method });

    this.middlewares.push(requestObj);

    return this;
  }
  // post(path, thunk) {}
  // put(path, thunk) {}
  // delete(path, thunk) {}

  close(func = noop) {
    if (func.constructor !== Function) func = noop;
    this.server.close(func);
  }

  listen (p, func) {
    let callback = func ? func : () => {};

    switch (true) {
      case (Boolean(!p && this.port)):
        // everything is fine here, just making sure we don't default.
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
