/**
 * 处理图片
 */
"use strict";

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const util = require('./util');

let startTime;

module.exports = function(options, callback) {
    startTime = util.getTime();

    gulp.src(options.src)
        .pipe(imagemin())
        .pipe(gulp.dest(options.outputDir))
        .on('end', function(err) {
            callback(err, {
                startTime: startTime,
                endTime: util.getTime()
            });
        });
};