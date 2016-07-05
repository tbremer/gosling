import { createServer } from 'http';
import { createRequestObj, noop } from './utils';

function buildMethod (path, thunk, method) {
  if (path instanceof Router) {
    this.middlewares.push.apply(this.middlewares, path.middlewares); //eslint-disable-line

    return;
  }

  if (path && thunk instanceof Router) {
    const PATH_REPLACER = /^\/|\/$/g;

    const strippedPath = path.constructor === String ? path : path.toString().replace(PATH_REPLACER, '');

    for (const mw of thunk.middlewares) {
      const PATHOBJ_REPLACER = /(?:^\/\^?)|(?:\$?\/$)/g;
      const strippedMWPath = mw.path.toString().replace(PATHOBJ_REPLACER, '');

      mw.path = new RegExp(`${strippedPath}${strippedMWPath}`);
    }

    this.middlewares.push.apply(this.middlewares, thunk.middlewares); //eslint-disable-line

    return;
  }

  return createRequestObj({ path, thunk, method });
}

export default class Gosling {
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
          if (!res.finished) res.end();
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
    const reqObj = buildMethod.call(this, path, thunk, /./);

    if (reqObj) if (reqObj) this.middlewares.push(reqObj);

    return this;
  }

  get(path, thunk) {
    const reqObj = buildMethod.call(this, path, thunk, /GET/i);

    if (reqObj) this.middlewares.push(reqObj);

    return this;
  }

  post(path, thunk) {
    const reqObj = buildMethod.call(this, path, thunk, /POST/i);

    if (reqObj) this.middlewares.push(reqObj);

    return this;
  }

  put(path, thunk) {
    const reqObj = buildMethod.call(this, path, thunk, /PUT/i);

    if (reqObj) this.middlewares.push(reqObj);

    return this;
  }

  delete(path, thunk) {
    const reqObj = buildMethod.call(this, path, thunk, /DELETE/i);

    if (reqObj) this.middlewares.push(reqObj);

    return this;
  }

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
