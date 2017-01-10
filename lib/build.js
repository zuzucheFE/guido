"use strict";

const webpack = require('webpack');
const chalk = require('chalk');

let getWebpackConfig = require('./get-webpack-config');
module.exports = function (options, callback) {
    options || (options = {});

    console.log(chalk.blue('load config...'));
    let webpackConfig = getWebpackConfig(options);

    // Run compiler.
    const compiler = webpack(webpackConfig);

    function doneHandler(err, stats) {
        const statsJSON = stats.toJson();

        if (statsJSON && statsJSON.errors.length) {
            console.log(chalk.red.bold(statsJSON.errors.length + ' error:\n'));
            console.log(statsJSON.errors.join('\n==========\n\n'));

            process.on('exit', function () {
                process.exit(1);
            });
        }

        if (callback) {
            callback(err, stats);
        }
    }

    if (options.watch) {
        console.log(chalk.blue('start watch\n'));
        compiler.watch(options.watch || 200, doneHandler);
    } else {
        console.log(chalk.blue('start compiler\n'));
        compiler.run(doneHandler);
    }
};
