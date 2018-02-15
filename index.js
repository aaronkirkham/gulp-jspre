'use strict';

const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const asyncReplace = require('async-replace');
const through = require('through2');
const request = require('request');

const jspreRegExp = /(\/\/ @jspre) ("(.*)")/g;
const remoteUrlRegExp = new RegExp('^(?:[a-z]+:)?//', 'i');

module.exports = options => {
  return through.obj((file, enc, callback) => {
    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-jspre', 'Streaming not supported'));
      return callback();
    }

    // find all the instances of the @jspre comment
    const contents = file.contents.toString('utf8');
    asyncReplace(contents, jspreRegExp, (match, p1, p2, p3, offset, string, done) => {
      // // grab the file name we need to import
      const url = match.slice(match.indexOf('"') + 1, match.lastIndexOf('"'));

      // is this a local url?
      if (!remoteUrlRegExp.test(url)) {
        // try and read the import file
        fs.readFile(path.join(file.base, url), (err, data) => {
          if (err) {
            return done(err);
          }
      
          done(null, data);
        });
      }
      else {
        request(url, (err, response, body) => {
          if (err) {
            return done(err);
          }

          done(null, body);
        });
      }
    },
    // we're finished, create the output buffer and return
    (err, output) => {
      if (err) {
        return callback(err);
      }

      file.contents = new Buffer(output);
      callback(null, file);
    });
  });
};