import { createServer } from 'http';
import { createServer as createSecureServer } from 'https';
import { noop, requestFactory } from './utils';

export default class Gosling {
  constructor(port = undefined, httpsOptions, ...middlewares) {
    this.__port__ = port;
    this.middlewares = middlewares;
    this.server = createServer();

    /**
     * HTTPS CHECKING
     * 1:
     *   if we have a port, the port is an object, and the port has a "key" key
     *   in it
     * 2: (OR)
     *   if httpsOptions is declared and httpsOptions has a "key" key in it.
     */
    if ((port && port.constructor === Object && port.key) || (httpsOptions && httpsOptions.key)) {
      if (port.constructor === Object) {
        httpsOptions = port;
        port = undefined;
        this.__port__ = undefined;
      }

      try {
        this.server = createSecureServer(httpsOptions);
      } catch (e) {
        throw e;
      }
    } else if (httpsOptions && httpsOptions.thunk) {
      this.middlewares.unshift(httpsOptions);
    }

    this.server.on('request', (req, res) => {
      let index = -1;

      const next = () => {
        index++;
        const middleware = this.middlewares[index];

        if (!middleware || res.finished) {
          if (!res.finished) res.end();
          index = -1;

          return;
        }

        if (!middleware.path.test(req.url)) return next();
        if (!middleware.method.test(req.method)) return next();

        return middleware.thunk()(req, res, next);
      };

      next();
    });
  }

  set port(p) {
    if (this.__port__ !== undefined) throw new Error('Port should not be reassigned.');

    this.__port__ = p;
  }

  get port() { return this.__port__; }

  use(path, ...thunks) {
    const method = /./;

    requestFactory.call(this, path, method, false, thunks);

    return this;
  }

  get(path, ...thunks) {
    const method = /GET/i;

    requestFactory.call(this, path, method, false, thunks);

    return this;
  }

  post(path, ...thunks) {
    const method = /POST/i;

    requestFactory.call(this, path, method, false, thunks);

    return this;
  }

  put(path, ...thunks) {
    const method = /PUT/i;

    requestFactory.call(this, path, method, false, thunks);

    return this;
  }

  delete(path, ...thunks) {
    const method = /DELETE/i;

    requestFactory.call(this, path, method, false, thunks);

    return this;
  }

  close(func = noop) {
    if (func.constructor !== Function) func = noop;

    this.server.close(func);
  }

  listen (p, func) {
    let callback = func ? func : () => {};

    switch (true) {
      // Everything is fine here, just making sure we don't default.
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
        throw new Error('Default has been reached, please file a bug with your set up on https://github.com/tbremer/gosling Thanks!');
    }

    this.server.listen(this.port, callback);
  }
}

export class Router extends Gosling {
  constructor(...middlewares) {
    super(undefined, ...middlewares);
    delete this.__port__;
    delete this.server;

    const FLAGGED_FUNCTIONS = [ 'close', 'listen', 'port', '__port__' ];

    FLAGGED_FUNCTIONS.forEach(u => this[u] = undefined);
    FLAGGED_FUNCTIONS.forEach(u => delete this[u]);
  }
}
