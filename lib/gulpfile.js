"use strict";

const gulp = require('gulp');
const build = require('./build');

gulp.task('watch', function() {
    build({
        watch: true
    }, function() {

    });
});

gulp.task('build', function() {
    build({
        watch: false
    }, function() {

    });
});

gulp.task('publish', function() {
    build({
        watch: false
    });
});
gulp.task('init', function() {

});