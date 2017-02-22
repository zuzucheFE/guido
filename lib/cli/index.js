#!/usr/bin/env node

"use strict";

const program = require('commander');
const packageInfo = require('../../package.json');

program
    .version(packageInfo.version, '-v, --version')
    .usage('[options] <file ...>')
    .option('-w, --watch', '监听文件')
    .option('-b, --build', '构建文件')
    .option('-d, --dev', '开发服务')
    .option('-p, --publish', '发布文件')
    .option('-i, --init', '新建项目')
    .parse(process.argv);

if (program.watch || program.build || program.publish || program.dev) {
    const chalk = require('chalk');
    const build = require('../build');
    build({
        env: program.publish ? 'production' : 'development',
        watch: program.watch,
        devServer: program.dev
    }, function (err, stats) {
        if (program.build || program.publish) {
            console.log('[Guido] ' + chalk.blue('Compiler Complete'));
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
        }

        if (stats.hasErrors()) {
            process.on('exit', function () {
                process.exit(1);
            });
        } else {
            process.exit(0);
        }
    });
} else if (program.init) {
    const init = require('../init');
    init({}, function () {
        process.exit(0);
    });
} else {
    program.help();
}
