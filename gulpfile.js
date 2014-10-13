var gulp    = require('gulp');
var concat  = require('gulp-concat');
var rename  = require("gulp-rename");
var uglify  = require("gulp-uglify");


gulp.task('scripts', function() {
  gulp.src([
      'src/science.js',
      'src/**/*.js'
    ])
    .pipe(concat('science.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('compress', ['scripts'],function() {
   gulp
    .src("./dist/science.js")
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task('test', ['scripts'],function() {
   gulp
    .src("./dist/science.js")
    .pipe(gulp.dest("tests"));
});


gulp.task('default', ['scripts'], function() {});
gulp.task('pack', ['scripts', 'compress'], function() {});