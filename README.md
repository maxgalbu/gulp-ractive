gulp-ractive [![Build Status](https://travis-ci.org/maxgalbu/gulp-ractive.svg?branch=ractive-0.6)](https://travis-ci.org/maxgalbu/gulp-ractive)
============

### Installation and Ractive versions

This branch of the plugin uses ractive 0.7.x. To install this version, use:

```
npm install gulp-ractive@0.7 --save-dev


### Usage

Simple example:

```javascript
var gulp = require('gulp'),
	ractive = require('gulp-ractive');

gulp.task('ractive_templates', function() {
	return gulp.src('templates/*.ractive')
		.pipe(ractive())
		.pipe(gulp.dest('templates/compiled/'));
});
```

Using options

```javascript
var gulp = require('gulp'),
	ractive = require('gulp-ractive');

gulp.task('ractive_templates', function() {
	return gulp.src('templates/*.ractive')
		.pipe(ractive({
		  preserveWhitespace: true
		}))
		.pipe(gulp.dest('templates/compiled/'));
});
```

Example with compiled files in the same folder (using gulp-rename):

```javascript
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	ractive = require('gulp-ractive');

gulp.task('ractive_templates', function() {
	return gulp.src('templates/*.ractive')
		.pipe(ractive())
		.pipe(rename({
			extname: ".ractivecompiled",
		}))
		.pipe(gulp.dest('templates/'));
});
```

### Error handling

There's no need to use gulp-plumber to catch errors, gulp-ractive logs errors using `console.warn` instead of crashing gulp.

### Options

You can pass to `ractive()` the same options that you pass when creating a new `Ractive` object (see the docs from ractivejs.org: http://docs.ractivejs.org/latest/options).

Remember that not all options are meaningful to Ractive.parse() (eg: `data` or `computed`).
