var gulp = require('gulp'),
  yuidoc = require('gulp-yuidoc'),
  clean = require('gulp-clean'),
  shell = require('gulp-shell'),
  rename = require('gulp-rename');

gulp.task('clean-regular', function(){
  return gulp.src('tmp/regular/', {read: false})
    .pipe(clean());
});


gulp.task('clean-yuidoc', function(){
  return gulp.src('source/_yuidoc/', {read: false})
    .pipe(clean());
});

gulp.task('clean', ['clean-regular', 'clean-yuidoc']);

gulp.task('clone-regular', ['clean-regular'], shell.task(['git clone https://github.com/regularjs/regular.git -b next tmp/regular']));

gulp.task('clone', ['clone-regular']);

gulp.task('yuidoc-regular', ['clone-regular'], function(){
  return gulp.src('tmp/regular/src/**/*.js')
    .pipe(yuidoc.parser({
      project: require('./tmp/regular/package.json')
    }))
    .pipe(rename('index.json'))
    .pipe(gulp.dest('source/_yuidoc/'));
});


gulp.task('yuidoc', ['yuidoc-regular']);

gulp.task('default', ['yuidoc'], function(){
  return gulp.start('clean-regular');
});