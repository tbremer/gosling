export const defaultPathObj = {
  path: /.+/,
  method: /.+/
};

export function createRequestObj2 (curPath, curThunk, methodReg) {

}

export function createRequestObj (path, thunk) {
  if (path.constructor === Object) {
    return Object.assign({}, defaultPathObj, path);
  }

  if (path.constructor === String || path instanceof RegExp) {
    return Object.assign({}, defaultPathObj, { path, thunk });
  }

  throw new TypeError('Path must be an Object, String, or RegExp');
}
