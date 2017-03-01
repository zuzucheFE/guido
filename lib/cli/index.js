#!/usr/bin/env node

"use strict";

const program = require('commander');
const packageInfo = require('../../package.json');

let subCmdValue;

program
    .version(packageInfo.version, '-v, --version')
    .usage('<command>');

program.command('watch')
    .description('监听文件')
    .action(function() {
        subCmdValue = 'watch';
    });
program.command('build')
    .description('构建文件')
    .action(function() {
        subCmdValue = 'build';
    });
program.command('dev')
    .description('开发服务')
    .action(function() {
        subCmdValue = 'dev';
    });
program.command('publish')
    .description('发布文件')
    .action(function() {
        subCmdValue = 'publish';
    });
program.command('init')
    .description('新建项目')
    .action(function() {
        subCmdValue = 'init';
    });

program.on('--help', function(){
    console.log(program.name() + '@' + program.version());
    console.log('');
});

program.parse(process.argv);


switch (subCmdValue) {
    case 'watch':
    case 'build':
    case 'publish':
    case 'dev':
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
                    version: false,
                    timings: true,
                    assets: true,
                    chunks: true,
                    modules: true,
                    errorDetails: true,
                    warnings: true,
                    publicPath: true
                }));
            }

            // 监听模式不中断
            if (!program.watch) {
                if (stats.hasErrors()) {
                    process.on('exit', function () {
                        process.exit(1);
                    });
                } else {
                    process.exit(0);
                }
            }
        });
        break;
    case 'init':
        const init = require('../init');
        init({}, function () {
            process.exit(0);
        });
        break;
    default:
        program.help();
        break;
}
