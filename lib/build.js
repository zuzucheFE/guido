"use strict";

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const del = require('del');

let getWebpackConfig = require('./get-webpack-config');
module.exports = function (options, callback) {
    options || (options = {});

    options.cwd = options.cwd ? options.cwd : process.cwd();
    options.tmpSpritesImageDir = '.tmpSpritesImage';

    function printLog (msg) {
        options.quiet || (console.log('[Guido] ' + msg));
    }

    printLog(chalk.blue('Load Config...'));
    let webpackConfig = getWebpackConfig(options);

    // Run compiler.
    const compiler = webpack(webpackConfig);

    function doneHandler(err, stats) {
        del(path.join(options.cwd, options.tmpSpritesImageDir));

        const statsJSON = stats.toJson();

        if (stats.hasErrors()) {
            printLog(chalk.red.bold(statsJSON.errors.length + ' error:\n'));
            printLog(statsJSON.errors.join('\n==========\n\n'));
        }

        if (stats.hasWarnings()) {
            printLog(chalk.yellow.bold(statsJSON.warnings.length + ' warnings:\n'));
            printLog(statsJSON.warnings.join('\n==========\n\n'));
        }

        if (callback) {
            callback(err, stats);
        }
    }

    if (options.watch) {
        printLog(chalk.blue('Start Watch\n'));
        compiler.watch(options.watch || 200, doneHandler);
    } else if (options.devServer) {
        printLog(chalk.blue('Start Dev Server\n'));
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, function () {
            printLog(chalk.blue('Starting server on http://' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port));
        });
    } else {
        printLog(chalk.blue('Start Compiler\n'));
        compiler.run(doneHandler);
    }
};
