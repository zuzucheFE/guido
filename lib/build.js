'use strict';

const path = require('path');

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const chalk = require('chalk');
const del = require('del');

const Utils = require('./utils');

let getWebpackConfig = require('./get-webpack-config');
module.exports = function (options = {}, callback) {
    options.cwd = options.cwd ? options.cwd : process.cwd();
    options.tmpCacheDir = path.join(options.cwd, '.guido-cache');

    function printLog (msg) {
        options.quiet || (Utils.printLog(msg));
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
        let uri = Utils.isUndefined(webpackConfig.devServer.https) ? 'http' : 'https';
        uri += '://' + webpackConfig.devServer.host;
        if (webpackConfig.devServer.port !== '80') {
            uri += ':' + webpackConfig.devServer.port;
        }

        printLog(chalk.blue('启动本地服务'));
        const server = new webpackDevServer(compiler, webpackConfig.devServer);
        server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, function () {
            if (webpackConfig.devServer.open) {
                let openOptions = {};

                if (Utils.isString(webpackConfig.devServer.open)) {
                    openOptions = {
                        app: webpackConfig.devServer.open
                    };
                }

                if (Utils.isString(webpackConfig.devServer.openPage) && webpackConfig.devServer.openPage.length) {
                    uri += webpackConfig.devServer.openPage;
                }

                let opn = require('opn');
                opn(uri, openOptions).catch(function () {
                    printLog(chalk.yellow(`无法打开浏览器，请自行打开${uri}`));
                });
            }
        });
    } else {
        printLog(chalk.blue('开始运行'));
        compiler.run(doneHandler);
    }
};
