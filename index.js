'use strict';

/**
 * Cookie creation interface.
 *
 * @param {Object} doc Reference to the document.
 * @returns {Object} Session storage inspired API.
 * @public
 */
module.exports = function bake(doc, options){
  if (!doc) doc = {};
  if (!options) options = {};
  if (typeof doc === 'string') doc = { cookie: doc };
  else if (typeof doc.cookie !== 'string') doc.cookie = '';

  /**
   * Regular Expression that is used to split cookies into individual items.
   *
   * @type {RegExp}
   * @private
   */
  var splitter = /;\s*/;

  /**
   * Read out all the cookies.
   *
   * @returns {Array}
   * @private
   */
  function read() {
    return options.read
    ? options.read()
    : doc.cookie.split(splitter);
  }

  /**
   * Write a new cookie.
   *
   * @param {String} name Name of the cookie
   * @param {String} cookie Cookie value.
   * @param {Boolean} remove Remove cookie.
   * @returns {String}
   * @private
   */
  function write(name, cookie, remove) {
    return options.write
    ? options.write(name, cookie, remove)
    : (doc.cookie = cookie);
  }

  /**
   * Get the contents of a cookie.
   *
   * @param {String} key Name of the cookie we want to fetch.
   * @returns {String|Undefined} Result of the cookie or nothing.
   * @public
   */
  function getItem(key) {
    var cookies = read();

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split('=');
      var name = decodeURIComponent(cookie[0]);

      if (name === key) return decodeURIComponent(cookie[1]);
    }
  }

  /**
   * Set a new cookie.
   *
   * @param {String} key Name of the cookie.
   * @param {String} value Data for the cookie.
   * @param {Object} opts Options for the cookie setting
   * @returns {String} Cookie.
   * @public
   */
  function setItem(key, value, opts) {
    if (typeof key !== 'string' || typeof value !== 'string') return false;
    if (!opts) opts = {};

    // Creating new cookie string
    var cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    if ('expires' in opts) cookie += '; expires=' + opts.expires;
    if ('path' in opts) cookie += '; path=' + opts.path;
    if ('domain' in opts) cookie += '; domain=' + opts.domain;
    if (opts.secure) cookie += '; secure';

    return write(key, cookie);
  }

  /**
   * Remove a cookie.
   *
   * @param {String} key Name of the cookie.
   * @returns {Undefined} Void.
   * @public
   */
  function removeItem(key) {
    return write(key, key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;', true);
  }

  /**
   * Clear all cookies.
   *
   * @returns {Undefined} Void.
   * @public
   */
  function clear() {
    var cookies = read();

    for (var i = 0; i < cookies.length; i++) {
      removeItem(decodeURIComponent(cookies[i].split('=')[0]));
    }
  }

  return {
    removeItem: removeItem,
    getItem: getItem,
    setItem: setItem,
    clear: clear
  };
};
