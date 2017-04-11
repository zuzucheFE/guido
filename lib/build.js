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
    options.tmpCacheDir = '.tmpCache';

    function printLog (msg) {
        options.quiet || (console.log('[Guido] ' + msg));
    }

    printLog(chalk.blue('Load Config...'));
    let webpackConfig = getWebpackConfig(options);

    // Run compiler.
    const compiler = webpack(webpackConfig);

    function doneHandler(err, stats) {
        del(path.join(options.cwd, options.tmpCacheDir));

        if (callback) {
            callback(err, stats);
        }
    }

    if (options.devServer) {
        printLog(chalk.blue('Start Dev Server'));
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, function () {
            printLog(chalk.blue('Starting server on http://' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port));
        });
    } else {
        let msg = options.watch ? 'Start Watch' : 'Start Compiler';
        printLog(chalk.blue(msg));
        compiler.run(doneHandler);
    }
};
