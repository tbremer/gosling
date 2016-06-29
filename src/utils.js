export const defaultPathObj = {
  path: '.+',
  method: 'GET',
  thunk() { return null; }
};

export function createPathObj (path, thunk) {
  if (path.constructor === Object) return Object.assign({}, defaultPathObj, path);
  if (path.constructor === String || path instanceof RegExp) return Object.assign({}, defaultPathObj, { path, thunk });

  throw new TypeError('Path must be an Object, String, or RegExp');
}
