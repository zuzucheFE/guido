"use strict";

const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const del = require('del');

let getWebpackConfig = require('./get-webpack-config');
module.exports = function (options, callback) {
    options || (options = {});

    options.cwd = options.cwd ? options.cwd : process.cwd();
    options.tmpSpritesImageDir = '.tmpSpritesImage';

    function printLog (msg) {
        options.quiet || (console.log(msg));
    }

    printLog(chalk.blue('load config...'));
    let webpackConfig = getWebpackConfig(options);

    // Run compiler.
    const compiler = webpack(webpackConfig);

    function doneHandler(err, stats) {
        del(path.join(options.cwd, options.tmpSpritesImageDir));

        const statsJSON = stats.toJson();

        printLog(stats.toString({
            color: true
        }));
        if (stats.hasErrors()) {
            printLog(chalk.red.bold(statsJSON.errors.length + ' error:\n'));
            printLog(statsJSON.errors.join('\n==========\n\n'));

            process.on('exit', function () {
                process.exit(1);
            });
        }

        if (callback) {
            callback(err, stats);
        }
    }

    if (options.watch) {
        printLog(chalk.blue('start watch\n'));
        compiler.watch(options.watch || 200, doneHandler);
    } else {
        printLog(chalk.blue('start compiler\n'));
        compiler.run(doneHandler);
    }
};
