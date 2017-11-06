"use strict";

const path = require('path');

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const chalk = require('chalk');
const del = require('del');

let getWebpackConfig = require('./get-webpack-config');
module.exports = function (options = {}, callback) {
    options.cwd = options.cwd ? options.cwd : process.cwd();
    options.tmpCacheDir = path.join(options.cwd, '.guido-cache');

    function printLog (msg) {
        options.quiet || (console.log('[Guido] ' + msg));
    }

    printLog(chalk.blue('载入配置...'));
    let webpackConfig = getWebpackConfig(options);

    // 回调出去用
    let webpackStateConfig = webpackConfig.stats;

    // Run compiler.
    const compiler = webpack(webpackConfig);

    let lastBuildStateHash;
    function doneHandler(err, stats) {
        // wait fix bug "Multiple compilation triggered in webpack2 watch mode"
        // https://github.com/webpack/webpack.js.org/issues/1096
        // https://runkit.com/kidney/multiple-compilation-triggered-in-webpack2-watch-mode
        if (lastBuildStateHash !== stats.hash) {
            lastBuildStateHash = stats.hash;

            if (callback) {
                callback(err, stats, webpackStateConfig);
            }
        }
    }
    del(options.tmpCacheDir);

    /* istanbul ignore next */
    if (options.watch) {
        printLog(chalk.blue('开始监听'));
        compiler.watch(webpackConfig.watchOptions || {}, doneHandler);
    } else if (options.devServer) {
        printLog(chalk.blue('启动本地服务'));
        printLog(chalk.blue('visit http://' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port));
        const server = new webpackDevServer(compiler, webpackConfig.devServer);
        server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host);
    } else {
        printLog(chalk.blue('开始运行'));
        compiler.run(doneHandler);
    }
};
