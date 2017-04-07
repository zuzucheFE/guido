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
program.command('server')
    .description('开发服务')
    .action(function() {
        subCmdValue = 'server';
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
    case 'server':
        const chalk = require('chalk');
        const build = require('../build');
        build({
            env: subCmdValue === 'publish' ? 'production' : 'development',
            watch: subCmdValue === 'watch',
            devServer: subCmdValue === 'server'
        }, function (err, stats) {
            switch (subCmdValue) {
                case 'build':
                case 'publish':
                    console.log('[Guido] ' + chalk.green('Compiler Complete'));
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

                    if (stats.hasErrors()) {
                        process.on('exit', function () {
                            process.exit(1);
                        });
                    } else {
                        process.exit(0);
                    }
                    break;
                case 'watch':
                    console.log('[Guido] ' + chalk.green('watch mode start'));
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
                    break;
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
