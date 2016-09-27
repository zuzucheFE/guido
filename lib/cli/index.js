#!/usr/bin/env node

"use strict";

const program = require('commander');
const packageInfo = require('../../package.json');

program
    .version(packageInfo.version, '-v, --version')
    .usage('[options] <file ...>')
    .option('-w, --watch', '监听文件')
    .option('-b, --build', '构建文件')
    .option('-p, --publish', '发布文件')
    .option('-i, --init', '新建项目')
    .parse(process.argv);

const build = require('../build');
if (program.watch || program.build || program.publish) {
    build({
        env: program.publish ? 'production' : 'development',
        watch: program.watch ? true : false
    }, function (err, stats) {
        if (program.build || program.publish) {
            console.log(stats.toString({
                colors: true, hash: true,
                version: true,
                timings: true,
                assets: true,
                chunks: true,
                modules: true,
                errorDetails: true,
                warnings: true,
                publicPath: true
            }));

            process.exit(0);
        }
    });
} else if (program.init) {
    init({
        env: 'production',
        watch: false
    }, function () {
        process.exit(0);
    });
} else {
    program.help();
}