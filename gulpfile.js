'use strict';

var gulp = require('gulp')
  ,imagemin = require('gulp-imagemin')
  ,clean = require('gulp-clean')
  ,concat = require('gulp-concat')
  ,htmlReplace = require('gulp-html-replace')
  ,uglify = require('gulp-uglify')
  ,usemin = require('gulp-usemin')
  ,cssmin = require('gulp-cssmin')
  ,jshint = require('gulp-jshint')
  ,jshintStylish = require('jshint-stylish')
  ,csslint = require('gulp-csslint')
  ,autoprefixer = require('gulp-autoprefixer')
  ,sass = require('gulp-sass');

gulp.task('default', ['sass', 'copy'], function() {
    gulp.start('img', 'usemin');
});

gulp.task('copy', ['clean'], function() {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('img', function() {
  return gulp.src('dist/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('sass', function() {
   return gulp.src('src/sass/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('dist/css'));
});

gulp.task('usemin', function() {
  return gulp.src('dist/**/*.html')
    .pipe(usemin({
      js: [uglify],
      css: [autoprefixer, cssmin]
    }))
    .pipe(gulp.dest('dist'));
});

var browserSync = require('browser-sync').create();
gulp.task('watch', function() {
    browserSync.init({
        port: 8080,
        server: {
          baseDir: './dist',
          index: 'views/index.html'
        },
        browser: 'google-chrome',
        notify: true,
        reloadDelay: 1000
    });

    gulp.watch('dist/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
    });

    gulp.watch('dist/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());
    }); 

    gulp.watch('src/sass/**/*.scss').on('change', function(event) {
       gulp.src('src/sass/**/*.scss')
          .pipe(sass().on('error', function(erro) {
              console.log('SASS, erro compilação: ' + erro.filename);
              console.log(erro.message);
            }))
          .pipe(gulp.dest('dist/css'));
    });

    gulp.watch("./src/**/*.*").on('change', browserSync.reload);
});