Maitre
---

Maitre is a simple es6 node server, it works similar to express.

Maitre's constructor takes the following optional arguments:

- **port** (`Number`)
- **middlewares** (thunks as arguments)

When instantiated returns the following prototype

- `use`
	- `optional` Path (`String` / `Regex`) or Path Object ( `{}` )
		- If omitted, processes through all requests
		- If path is object:
			- `path`: `String` or `Regex`
			- `request`: [ `GET`, `POST`, `PUT`, `DELETE` ]
		- If path is String:
			- thunk only runs on matching request types.
	- `required` thunk
		- thunk returns `next()` or `next(error)`

- `get`
	- `optional` Path String or Object.
		- forces `requestType` to be `GET`
	- `required` thunk
		- thunk returns `next()` or `next(error)`

- `post`
	- `optional` Path String or Object.
		- forces `requestType` to be `POST`
	- `required` thunk
		- thunk returns `next()` or `next(error)`

- `put`
	- `optional` Path String or Object.
		- forces `requestType` to be `PUT`
	- `required` thunk
		- thunk returns `next()` or `next(error)`

- `delete`
	- `optional` Path String or Object.
		- forces `requestType` to be `DELETE``
	- `required` thunk
		- thunk returns `next()` or `next(error)`

- `listen`
	- conditionally takes port
	- optionally takes callback.
