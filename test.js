var koekie = require('./');
var assume = require('assume');

describe('koekiemonster', function () {
  var cookie;
  var doc;

  beforeEach(function () {
    doc = { cookie: '' };
    cookie = koekie(doc);
  });

  describe('setItem', function () {
    it('sets a cookie', function () {
      cookie.setItem('foo', 'bar');

      assume(doc.cookie).contains('foo=bar');
    });

    it('calls the `write` option', function (next) {
      cookie = koekie(doc, {
        write: function write(value, meta) {
          assume(value).equals('what=is%20up; path=/; secure');

          assume(meta).is.a('object');
          assume(meta.key).equals('what');
          assume(meta.value).equals('is%20up');

          assume(meta.opts).is.a('object');
          assume(meta.opts.path).equals('/');
          assume(meta.opts.secure).equals(true);

          next();
        }
      });

      cookie.setItem('what', 'is up', {
        path: '/',
        secure: true
      });
    });
  });

  describe('getItem', function () {
    it('retrieves a cookie value', function () {
      doc.cookie = 'another=value';

      assume(cookie.getItem('another')).equals('value');
    });

    it('correctly handles = values in cookies', function () {
      doc.cookie = 'data=id=300&param=1';

      assume(cookie.getItem('data')).equals('id=300&param=1');
    });

    it('calls the `read` option', function () {
      cookie = koekie(doc, {
        read: function read() {
          return ['yo=another-value'];
        }
      });

      assume(cookie.getItem('yo')).equals('another-value');
    });
  });

  describe('removeItem', function () {
    it('removes a cookie', function (){
      doc.cookie = 'foo=bar;';

      cookie.removeItem('foo');
      assume(doc.cookie).does.not.contain('foo=bar');
    });

    it('call the `write` option with a remove argument', function (next) {
      cookie = koekie(doc, {
        write: function write(cookie, meta) {
          assume(cookie).equals('what=; expires=Thu, 01 Jan 1970 00:00:00 GMT');

          assume(meta).is.a('object');
          assume(meta.value).equals('');
          assume(meta.remove).equals(true);
          assume(meta.key).equals('what');

          next();
        }
      });

      cookie.removeItem('what');
    });

    it('calls the `write` option with all the opts', function (next) {
      cookie = koekie(doc, {
        write: function write(cookie, meta) {
          assume(cookie).equals('what=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/foo; domain=example.com');

          assume(meta).is.a('object');
          assume(meta.value).equals('');
          assume(meta.remove).equals(true);
          assume(meta.key).equals('what');
          assume(meta.opts).is.a('object');
          assume(meta.opts.path).equals('/foo');
          assume(meta.opts.domain).equals('example.com');

          next();
        }
      });

      cookie.removeItem('what', { path: '/foo', domain: 'example.com' });
    });
  });

  describe('integration', function () {
    it('sets and gets cookie with `=` in value', function (){
      cookie.setItem('key', 'val=ue');
      assume(cookie.getItem('key')).equals('val=ue');
    });

    it('defaults to `document.cookie`', function () {
      global.document = {
        cookie: 'whats=up'
      };

      const noms = koekie();

      assume(noms.getItem('whats')).equals('up');
    });
  });
});
