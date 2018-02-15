gulp-jspre
==============

A tiny JavaScript preprocessor for gulp to import local and remote scripts without using a bundler.

## Gulp Usage
```javascript
const jspre = require('gulp-jspre');

gulp.task('js', () => {
  return gulp.src('entrypoint.js')
    .pipe(jspre())
    .pipe(gulp.dest('./dist/'));
});
```

## entrypoint.js
```javascript
(function() {
  console.log('this is my javascript file!');
})();

// import from another file on disk
// @jspre "another-file.js"

// import from a file on the web
// @jspre "http://code.jquery.com/jquery-3.3.1.js"
```