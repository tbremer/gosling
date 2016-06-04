export default class Maitre {
  constructor(port = undefined, ...middlewares) {
    this._port = port;
    this.middlewares = middlewares;
  }
  set port (p) {
    if (this._port) {
      throw new Error('Port was set through a constructor or is being reset.');
    }

    this._port = p;
  }
  use(thunk) {}
  get(thunk) {}
  post(thunk) {}
  put(thunk) {}
  delete(thunk) {}

  listen (p) {
    switch (true) {
      default:
        throw new Error('Default has been reached, not sure how.');
    }

    console.log('listening on:', this.port);
  }
}
