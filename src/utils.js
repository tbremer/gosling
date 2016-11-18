const baseRequestObj = {
  path: /./,
  method: /./i,
  thunk: undefined
};

function createRequestObj ({ path, method, thunk }) {
  if (path.constructor === Object) {
    const { path: _path, method: _method, thunk: _thunk } = path;

    path = _path;
    method = _method;
    thunk = _thunk;
  }

  if (path.constructor === Function) {
    thunk = path;
    path = undefined;
  }

  const defaults = Object.assign({}, baseRequestObj);

  if (!path) path = defaults.path;
  if (!method) method = defaults.method;

  if ((path.constructor === String)) {
    const newPath = path.replace(/(?:^\^)|(?:\$$)/, '');

    path = new RegExp(`^${newPath}$`);
  }

  if ((method.constructor === String)) {
    const newMethod = method.replace(/(?:^\^)|(?:\$$)/, '');

    method = new RegExp(`^${newMethod}$`);
  }

  return Object.assign({}, baseRequestObj, { path, method, thunk });
}

export function noop () {
  return;
}

function isValidPath(path) {
  const validConstructors = [ Object, Function, String, RegExp ];

  if (path === undefined) return true;
  if (validConstructors.indexOf(path.constructor) === -1) return false;
  if (path.constructor === Object && !path.thunk) return false;

  return true;
}

export function requestFactory (path, method, bypassCheckers, thunks) {
  /* eslint-disable no-invalid-this */
  /* `this` is always bound within requestFactory */
  if (!bypassCheckers) {
    //Check if this is a router
    if (path.constructor.name === 'Router') {
      this.middlewares.push(...path.middlewares);

      return;
    }

    // Check if this is a `pathed` router
    if (path && (thunks[0] && thunks[0].constructor.name === 'Router')) {
      const PATH_REPLACER = /^\/|\/$/g;
      const [ router ] = thunks;
      const strippedPath = path.constructor === String ? path : path.toString().replace(PATH_REPLACER, '');

      for (const mw of router.middlewares) {
        const PATHOBJ_REPLACER = /(?:^\/\^?)|(?:\$?\/$)/g;
        const strippedMWPath = mw.path.toString().replace(PATHOBJ_REPLACER, '');

        mw.path = new RegExp(`${strippedPath}${strippedMWPath}`);
      }

      this.middlewares.push(...router.middlewares);

      return;
    }

    // Look for errors
    // if there is no path and no thunks
    if (!path && !thunks.length) throw new Error('Path or Thunk required.');

    // if path is not valid
    if (!isValidPath(path)) {
      // throw certain type of error depending on what is wrong.
      if (path.constructor === Object && !path.thunk) throw new Error('Middleware take a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
      throw new Error('Path must be an Object, String, or RegExp');
    }

    // if path is valid, but there aren't any thunks
    if (isValidPath(path) && (path instanceof RegExp || path.constructor === String) && !thunks.length) throw new Error('Middleware take a path and a thunk. Pathing is optional, but is always passed first if both are preset.');
  }

  // Basic checks are complete, lets make some RequestObject.
  if (typeof path === 'function' || (typeof path === 'object' && !(path instanceof RegExp))) {
    thunks.splice(0, 0, path);
    path = 'path' in path ? path.path : /./;
  }

  // Get the first thunk and alter the array;
  const thunk = thunks.shift();

  if (!thunk) return;

  if (thunk.constructor === Object) {
    // if thunk is already a RequestObject, but it doesn't have a `thunk`
    if (!thunk.thunk) throw new Error('Missing `thunk` in RequestObject.');

    // ensure all pieces of the RequestObject are laid out.
    if (!thunk.path) thunk.path = path;
    if (!thunk.method) thunk.method = method;
  }

  // Generate and Push RequestObject.
  const reqObj = thunk.constructor === Object ? createRequestObj(thunk) : createRequestObj({ path, thunk, method });

  this.middlewares.push(reqObj);


  // call requestFactory again ensuring we re-bind this and skip over the error
  // handling. Use the `shift`ed array.
  return requestFactory.call(this, path, method, true, thunks);

  /* eslint-enable no-invalid-this */
}
