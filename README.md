Maitre
---

[![Travis](https://img.shields.io/travis/tbremer/maitre.svg?maxAge=2592000?style=flat-square)]() [![npm](https://img.shields.io/npm/v/maitre.svg?maxAge=2592000?style=flat-square)]() [![npm](https://img.shields.io/npm/l/maitre.svg?maxAge=2592000?style=flat-square)]()

Maitre is simple, plugin ready es6 node server similar to express.

## Use:

```javascript
import Maitre from 'maitre';

const app = new Maitr(1337);
app.listen();

app.use('/', () => (request, response, next) => {
    response.write('Hello World!');
    next();
});
```

## Router
Maitre ships with a router bundled, it can be accessed by importing separately

```javascript
import Maitre, { Router } from 'maitre';

const app = new Maitre(1337);
const router = new Router();

app.listen();

router.use('/', () => (req, res, next) => {});
app.use('/api', router);

```

When assigning a path to router that router is then scoped to only process request that match the prefix.

Routers are completely recursive and can be nested deeply.

```javascript
import { Router } from 'maitre';

const router = new Router();
const subrouter = new Router();

subrouter.get(/\/post/[a-z0-9]+$/, logBlogEntry);
router.use('/api/blog', subrouter);

export router;
```

### Use In Depth
Maitre's constructor takes the following optional arguments:

- **port** (Number);
- **middleware** (as Request Objects);

## Full API
Once instantiated Maitre's offers the following methods:

- `listen`
  - Starts server.
  - **Arguments:**
    - port (`Number`) - throws error if port is already assigned
    - callback (`Function`)

- `close`
  - Stops server
  - **Arguments:**
  - callback (`Function`)

- `port`
  - Sets port if not set through constructor
  - Throws error if port is already assigned.
  - Getter / Setter

- `use` (Universal request)
  - Universal Request (runs for all requests)
  - **Arguments:**
    - Path [optional] `String` or `RegExp`
    - Thunk

- `get`
  - Only GET Requests
  - **Arguments:**
    - Path [optional] `String` or `RegExp`
    - Thunk

- `post`
  - Only POST Requests
  - **Arguments:**
    - Path [optional] `String` or `RegExp`
    - Thunk

- `put`
  - Only PUT Requests
  - **Arguments:**
    - Path [optional] `String` or `RegExp`
    - Thunk

- `delete`
  - Only DELETE Requests
  - **Arguments:**
    - Path [optional] `String` or `RegExp`
    - Thunk

### Methods API in depth

The `methods` (`get`, `post`, `put`, `delete`, `use`) API takes two arguments and creates Request Objects…
    - Path (as String or RegExp) [optional]
    - Thunk (function returning function) [required]

### Request Objects
Request Objects are the heart of Maitre's speed and simplicity. They can be hand coded or passed through the `method` API reducer.

```javascript
// Request Object
{
    path: '/' /* String or RegExp */
    method: /GET/i /* RegExp only */
    thunk() {
        /* some code */
        return (request, response, next) => {
            /* response or request modifications */
            next();
        }
    }
}
```

### Sample Usage
You can use the simple API to produce Request Objects by:

```javascript
app.use('<Path>', () => (req, res, next) => {});
app.get('<Path>', () => (req, res, next) => {});
app.post('<Path>', () => (req, res, next) => {});
app.put('<Path>', () => (req, res, next) => {});
app.delete('<Path>', () => (req, res, next) => {});
```

### Notes

    - the `methods` API does the work of Method checking, so no need to pass that.
    - the `use` method will try to run on every request.
    - if no `path` is passed in, the thunk is processed on all matching request methods.
        - `app.use(() => (req, res, next) => {})` will be run on *all* requests.
