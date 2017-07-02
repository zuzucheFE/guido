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

process.env['GUIDO_MODE'] = subCmdValue;

switch (subCmdValue) {
    case 'watch':
    case 'build':
    case 'publish':
    case 'server':
        let env = subCmdValue === 'publish' ? 'production' : 'development';
        process.env['GUIDO_ENV'] = env;

        const chalk = require('chalk');
        const build = require('../build');
        build({
            env: env,
            watch: subCmdValue === 'watch',
            devServer: subCmdValue === 'server'
        }, function (err, stats, webpackStateConfig) {
            switch (subCmdValue) {
                case 'build':
                case 'publish':
                    console.log('[Guido] ' + chalk.green('Compiler Complete'));
                    console.log('[Guido] ' + chalk.green('Stats'));
                    console.log(stats.toString(webpackStateConfig));

                    if (stats.hasErrors()) {
                        process.on('exit', function () {
                            process.exit(1);
                        });
                    } else {
                        process.exit(0);
                    }
                    break;
                case 'watch':
                    console.log('[Guido] ' + chalk.green('Watch mode start'));
                    console.log('[Guido] ' + chalk.green('Stats'));
                    console.log(stats.toString(webpackStateConfig));
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
