const baseRequestObj = {
  path: /./,
  method: /./i,
  thunk: undefined
};

export function noop() {
  return;
}

export function createRequestObj({ path, method, thunk }) {
  if (path.constructor === Object) {
    const { path: _path, method: _method, thunk: _thunk } = path;

    path = _path;
    method = _method;
    thunk = _thunk;
  }
  if ((!path && !thunk) || (path && path.constructor !== Function && !thunk)) throw new Error('Middleware take a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
  if (path.constructor !== Function && (!(path instanceof RegExp) && path.constructor !== String)) {
    throw new TypeError('Path must be an Object, String, or RegExp');
  }
  if (path.constructor === Function) {
    thunk = path;
    path = undefined;
  }

  if (!thunk) throw new Error('Thunk must be passed to middleware');

  const defaults = Object.assign({}, baseRequestObj);

  if (!path) path = defaults.path;
  if (!method) method = defaults.method;

  if ((path.constructor === String)) {
    const newPath = path.replace(/^\^/, '').replace(/\$$/, '');

    path = new RegExp(`^${newPath}$`);
  }

  if ((method.constructor === String)) {
    const newMethod = method.replace(/^\^/, '').replace(/\$$/, '');

    method = new RegExp(`^${newMethod}$`);
  }

  return Object.assign({}, baseRequestObj, { path, method, thunk });
}
