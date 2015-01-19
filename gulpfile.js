var gulp = require('gulp'),
  yuidoc = require('gulp-yuidoc'),
  clean = require('gulp-clean'),
  shell = require('gulp-shell'),
  translate = require("./scripts/gulp-translate.js"),
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


gulp.task('doc:split', function(){
  return gulp.src(["source/_api/_docs/*.md"]) 
    .pipe(translate({}))
    .pipe(gulp.dest("source/_api/docs"))
})

gulp.task("api", ["doc"], function(){
  gulp.src(['./source/_api/**/*'])
  .pipe(gulp.dest("./public/reference"))
  .pipe(gulp.dest("./.deploy/reference"))
})

gulp.task('generate', shell.task(['hexo generate']))

gulp.task('deploy',  shell.task(['gulp generate&&gulp api && hexo deploy']));


gulp.task('server', ["watch"], shell.task(['cd public && puer --no-reload']))

gulp.task("doc", ["doc:split"])

gulp.task("watch", function(){
  return gulp.watch(["source/_api/_docs/*.md"], ["api"]);
})
