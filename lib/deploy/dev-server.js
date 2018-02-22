'use strict';

const chalk = require('chalk');
const Utils = require('../utils');

let lastDevBuildStateHash;

module.exports = function (options, webpackConfig) {
    webpackConfig.devServer.host || (webpackConfig.devServer.host = '0.0.0.0');
    webpackConfig.devServer.port || (webpackConfig.devServer.port = '8080');
    webpackConfig.devServer.compress = true; // 强制启动gzip
    webpackConfig.devServer.contentBase = webpackConfig.output.path;

    if (!webpackConfig.devServer.publicPath) {
        let uri = Utils.isUndefined(webpackConfig.devServer.https) ? 'http' : 'https';
        uri += '://' + webpackConfig.devServer.host;
        if (webpackConfig.devServer.port !== '80') {
            uri += ':' + webpackConfig.devServer.port;
        }
        webpackConfig.devServer.publicPath = `${uri}/`;
    }

    if (webpackConfig.stats) {
        webpackConfig.devServer.stats = webpackConfig.stats;
    }
    if (Utils.isUndefined(webpackConfig.devServer.open)) {
        webpackConfig.devServer.open = true;
    }
    if (webpackConfig.devServer.open && Utils.isUndefined(webpackConfig.devServer.openPage)) {
        webpackConfig.devServer.openPage = '';
    }

    // 修复一次修改可能会多次触发 console.log https://webpack.js.org/api/node/#watching
    // 注意：
    // ### 目前 webpack-dev-server@2.x 都是使用 WDM 1.x版本
    // 代替 webpack-dev-middleware -> Shared.js -> defaultReporter 方法
    // https://github.com/webpack/webpack-dev-middleware/blob/v1.12.2/lib/Shared.js#L40
    //
    // ### webpack-dev-server@3.x 都是使用 WDM 2.x版本，reporter有破坏性更新：
    //      https://github.com/webpack/webpack-dev-middleware/blob/master/breaking-changes.md
    webpackConfig.devServer.reporter = function (reporterOptions) {
        let state = reporterOptions.state;
        let stats = reporterOptions.stats;
        let opts = reporterOptions.options;

        if (lastDevBuildStateHash) {
            Utils.clearConsole();
        }

        if (state) {
            if (lastDevBuildStateHash !== stats.hash) {
                let displayStats = (!opts.quiet && opts.stats !== false);
                if (displayStats && !(stats.hasErrors() || stats.hasWarnings()) &&
                    opts.noInfo) {
                    displayStats = false;
                }

                if (displayStats) {
                    if (stats.hasErrors()) {
                        opts.error(stats.toString(opts.stats));
                    } else if (stats.hasWarnings()) {
                        opts.warn(stats.toString(opts.stats));
                    } else {
                        opts.log(stats.toString(opts.stats));
                    }
                }
                if (!opts.noInfo && !opts.quiet) {
                    let msg = chalk.green('Compiled successfully.');
                    if (stats.hasErrors()) {
                        msg = chalk.red('Failed to compile.');
                    } else if (stats.hasWarnings()) {
                        msg = chalk.yellow('Compiled with warnings.');
                    }
                    opts.log('[Guido] ' + msg);
                }

                lastDevBuildStateHash = stats.hash;
            }
        }
    };

    return webpackConfig;
};
