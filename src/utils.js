export const defaultPathObj = {
  path: /.+/,
  method: /.+/
};

export function createRequestObj (path, thunk) {
  if (path.constructor === String) path = new RegExp(`^${path}$`);

  switch (true) {
    case (path.constructor === Object && path.thunk): return Object.assign({}, defaultPathObj, path);
    case (path.constructor === Object): return Object.assign({}, defaultPathObj, path, { thunk });
    case (path instanceof RegExp): return Object.assign({}, defaultPathObj, { path, thunk });
    default: throw new TypeError('Path must be an Object, String, or RegExp');
  }
}
