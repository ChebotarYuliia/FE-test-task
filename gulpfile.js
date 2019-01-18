// Modules & Plugins
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  server = require('gulp-server-livereload'),
  babel = require('gulp-babel');

// Styles Task
gulp.task(
  'sass',
  gulp.series(function () {
    return gulp
      .src('./app/scss/*.scss')
      .pipe(
        sass({
          outputStyle: 'compressed',
        }),
        autoprefixer({
          browsers: ['last 5 versions'],
          cascade: false,
        })
      )
      .pipe(gulp.dest('./dist/css'));
  })
);

// Scripts Task
gulp.task(
  'scripts',
  gulp.series(function () {
    return gulp
      .src('./app/js/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./dist/js'));
  })
);

// Watch Task
gulp.task('watch', function () {
  gulp.watch('./app/scss/*.scss', gulp.series('sass'));
  gulp.watch('./app/js/*.js', gulp.series('scripts'));
});

gulp.task('webserver', function () {
  gulp.src('./dist').pipe(
    server({
      livereload: true,
      fallback: './dist/index.html',
      port: 88,
    })
  );
});

// Default Task
gulp.task('default', gulp.parallel('watch', 'webserver'));
