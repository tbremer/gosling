/**
 * Class Maitre
 * optionally takes
 *  • port number
 *  • middlewares
 * returns the following functions
 *  use
 */
function noop() { return; };
function convertThunkToMiddleware(thunk) {
  return {}
}

class Maitre {
  constructor(port = undefined, ...middlewares) {
    this._port = port;
    this.middlewares = middlewares;
  }
  set port(p) {
    if (this._port) {
      throw new Error('Port was set through a constructor or is being reset.')
    }

    this._port = p;
  }
  get port() { return this._port }
  use(thunk) {}
  get(thunk) {}
  post(thunk) {}
  put(thunk) {}
  delete(thunk) {}

  listen(p) {
    switch(true) {
      // case ((p !== undefined) && !(this.port)):
      //   this.port = p;
      //   break;
      // case ((p === undefined || p === null) && !this.port):
      //   throw new Error('Port number has not been set.');
      // case (p !== undefined && this.port && p !== this.port):
      //   throw new Error('Port was set through a constructor or is being reset.')
      default:
        throw new Error('Default has been reached, not sure how.');
    }

    console.log('listening on:', this.port);
  }
}

// let app = new Maitre();

// // app.port = 2;
// app.use(noop);
// app.get(noop);
// app.post(noop);
// app.put(noop);
// app.delete(noop)
// app.listen()
