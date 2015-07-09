'use strict';

var gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	eslint = require('gulp-eslint'),
	browserSync = require('browser-sync').create(),
	// jade = require('gulp-jade'),
	// path = require('path'),
	// clean = require('gulp-clean'),
  // gutil = require('gulp-util'),
  // bower = require('bower'),
  // concat = require('gulp-concat'),
  sass = require('gulp-sass');
  // minifyCss = require('gulp-minify-css'),
  // rename = require('gulp-rename'),
  // sh = require('shelljs');


gulp.task('default', ['test'], function () {
    console.log('READDDDY TO RUMMMMBLE')
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


gulp.task('sass', function() {
    return gulp.src("path/too/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});


gulp.task('test', ['lint'], function() {
	console.log('*****TESTING*****');
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
      	chai: require('chai'),
        assert: require('chai').assert,
        expect: require('chai').expect,
        should: require('chai').should()
      }
    }));
});


gulp.task('lint', function () {
	console.log('*****LINTING*****');
    return gulp.src(['**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});






gulp.task('integrate', function() {
	console.log('\n');
	console.log('*****DEV TEAM TASKS******');
	console.log('\n');
	console.log('1. ensure that you have latest known-good code. ("git pull --rebase upstream master")');
	console.log('2. make sure git status is clean');
	console.log('3. test and lint on your box (run "gulp")');
	console.log('4. Squash any unecessary commits with rebase')
	console.log('5. push to YOUR repository branch ("git push origin staging")');
  console.log('6. Create pull request to master branch of upstream repo');
	console.log('\n');
	console.log('*****YOU DID IT******');
});
