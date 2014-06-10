/** @module {Function} ghoul **/

/**
 * Module dependencies
 */
var browserify = require('browserify')
  , child_process = require('child_process')
  , fs = require('fs')
  , path = require('path')
  , TmpFile = require('temporary/lib/file');

var _cwd = process.cwd()

    /**
     * Default constructor options for Ghoul instances
     * @private
     * @namespace
     * @property {string} assertionPath - Path to assertions library
     * @property {string} frameworkPath - Path to browser-safe framework
     *  script path (defaults to internal mocha dependency)
     * @property {string} reporter - The mocha reporter to use
     * @property {string} testDirectory - Path to test directory
     */
  , _defaults = {
      assertionPath: path.resolve(__dirname, './node_modules/expect.js/index.js'),
      frameworkPath: path.resolve(__dirname, './node_modules/mocha-phantomjs/node_modules/mocha/mocha.js'),
      libs: [],
      reporter: 'spec',
      testDirectory: path.resolve(_cwd, './test')
    };

function _merge(dest/*, srcs...*/) {
  var srcs = Array.prototype.slice.call(arguments, 1);
  if (srcs.length) {
    srcs.forEach(function (src) {
      for (var key in src) {
        if (src.hasOwnProperty(key) && dest.hasOwnProperty(key)) {
          if (/Path$/.test(key)) {
            dest[key] = path.resolve(_cwd, src[key]);
          } else {
            dest[key] = src[key];
          }
        }
      }
    });
  }
  return dest;
}

/**
 * Parses a given template and map into a completed string
 * @private
 * @example
 *  var template = '<div>{{name.first}} {{name.last}}, {{age}}</div>';
 *  var map = {
 *    name: { first: 'David', last: 'Glivar' },
 *    age: 29
 *  };
 *  var view = _.template(template, map);
 * @param {string} t - The unparsed template to use
 * @param {Object} map - A map of values to place into the template
 * @returns {string}
 */
function _template(t, map) {
  map = map || {};
  var reg = /\{{2}(\w+\.?)+?\}{2}/g
    , matches = t.match(reg)
    , keymap = {}
    , items
    , helper = function (m) {
        var value = map[items[0]];
        if (!value) return m;
        if (items.length > 1) {
          for (var i = 0, l = items.length; i < l; i++) {
            value = value[items[i]];
          }
        }
        return value;
      };
  if (!matches) return t;
  for (var i = 0, l = matches.length; i < l; i++) {
    keymap[matches[i]] = matches[i].replace(/(^\{{2}|\}{2}$)/g, '').split('.');
  }
  for (var key in keymap) {
    items = keymap[key];
    t = t.replace(new RegExp(key, 'g'), helper);
  }
  return t;
}

function Ghoul(settings) {
  var harness = fs.readFileSync(
    path.join(__dirname, 'support/harness.html'), 'utf-8'
  );

  this.settings = _merge(_defaults, settings || {});
  this.harness = _template(harness, this.settings);
}

Ghoul.prototype._filterFiles = function () {
  var files = fs.readdirSync(this.settings.testDirectory)
    , cleaned = [];
  for (var i = 0, l = files.length; i < l; i++) {
    if (path.extname(files[i]) === '.js') {
      cleaned.push(files[i]);
    }
  }
  return cleaned;
};

Ghoul.prototype.run = function () {
  var self = this
    , bundlePath = path.join(__dirname, 'support/_bundle.js')
    , bundler
    , err = null
    , files = this._filterFiles()
    , fileContent = ''
    , harnessPath = path.join(__dirname, 'support/_harness.html')
    , index = new TmpFile()
    , resolved = files.map(function (f) { 
        return path.resolve(self.settings.testDirectory, f); 
      });
  resolved.forEach(function (f) { fileContent += 'require("'+f+'");'; });

  err = index.writeFileSync(fileContent);
  if (err) return console.error('Error writing tmp file:', err);

  bundler = browserify(index.path);
  bundler.bundle({}, function (err, src) {
    if (err) return console.error('Error bundling src:', err);

    err = fs.writeFileSync(bundlePath, src);
    if (err) return console.error('Error writing bundled src:', err);

    var scripts = '';
    if (self.settings.libs.length) {
      self.settings.libs.forEach(function (lib) {
        scripts += '<script src="'+lib+'"></script>'
      });
    }
    self.harness = _template(self.harness, { src: bundlePath, libs: scripts });

    err = fs.writeFileSync(harnessPath, self.harness);
    if (err) return console.error('Error writing test harness:', err);

    var mochaphantom = child_process.spawn(
      path.join(__dirname, 'node_modules/.bin/mocha-phantomjs'), 
      [harnessPath, '-R', self.settings.reporter], 
      { stdio: 'inherit' }
    );

    mochaphantom.on('close', function () {
      index.unlinkSync();
      fs.unlinkSync(bundlePath);
      fs.unlinkSync(harnessPath);
    });
  });
};

module.exports = Ghoul;
