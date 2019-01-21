# CHANGELOG

### 2.2.0

- With the release of 2.0.0 we introduced custom read/write methods. These
  are now fixed to provide a consistent interface for write operations.

### 2.1.0

- Assume `document.cookie` existance by default, but default to an empty
  object when unavailable.

### 2.0.1

- Correctly handle `=` cookie values, instead of splitting on `=`, we're going
  to to slice of the cookie name from the cookie string.

### 2.0.0

- Rewrite all the internals to be more flexible in the platform support.
- Allows custom read and write methods.
- Complete refactor and shares nothing from the previous code base anymore.

### 1.0.0

- Added Node.js support

### 0.2.0

- Refactored all code to conform to Storage API while supporting old methods for backward compatibility
- Updated tests and adjusted testing modules requirements to work on Node.JS 0.12+

### 0.1.1

- Require mocha as a dependency

### 0.1.0

- Don't check arguments for truthyness, use `hasOwnProperty`.
