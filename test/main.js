const jspre = require('../');
const should = require('should');
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');

function createVinyl(filename, contents) {
  const base = path.join(__dirname, 'data');
  const filepath = path.join(base, filename);

  return new gutil.File({
    cwd: __dirname,
    base: base,
    path: filepath,
    contents: contents || fs.readFileSync(filepath)
  });
}

describe('gulp-jspre', () => {
  describe('jspre()', () => {
    it('should transform a single js file', done => {
      const simplejs = createVinyl('simple.js');
      const stream = jspre();

      stream.on('data', jsfile => {

        should.exists(jsfile);
        should.exists(jsfile.path);
        should.exists(jsfile.relative);
        should.exists(jsfile.contents);
        jsfile.path.should.equal(path.join(__dirname, 'data', 'simple.js'));

        const expected = fs.readFileSync(path.join(__dirname, '/data/simple-output.js'), 'utf8');
        String(jsfile.contents).should.match(expected);

        done();
      });

      stream.write(simplejs);
    });

    it('should remote import jquery', done => {
      const remotejs = createVinyl('remote.js');
      const stream = jspre();

      stream.on('data', jsfile => {
        jsfile.path.should.equal(path.join(__dirname, 'data', 'remote.js'));

        //const expected = fs.readFileSync(path.join(__dirname, '/data/remote-output.js'), 'utf8');
        //String(jsfile.contents).should.match(expected);

        done();
      });

      stream.write(remotejs);
    });
  });
});