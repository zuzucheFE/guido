/**
 * 输出webpack配置
 * @param options
 * @returns {*}
 */
"use strict";


const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const chalk = require('chalk');
const merge = require('merge');

function fileExists(path) {
    return fs.existsSync(path);
}

let generateHtmlEntry = require('./config/html');

module.exports = function (options) {
    function printLog (msg) {
        options.quiet || (console.log(msg + '\n'));
    }

    // 项目webpack配置
    const webpackConfigPath = path.join(options.cwd, 'webpack.config.js');
    const userWebpackConfig = fileExists(webpackConfigPath) ? require(webpackConfigPath) : {};

    // 系统默认webpack配置
    const webpackConfigDefault = require(path.join(__dirname, 'webpack.config.default.js'))(options);

    let userWebpackConfigPlugins = [];
    if (userWebpackConfig.plugins) {
        userWebpackConfigPlugins = userWebpackConfig.plugins;
        delete userWebpackConfig.plugins;
    }

    // mixin config
    let webpackConfig = merge.recursive(true, {}, webpackConfigDefault, userWebpackConfig);

    // 强制配置
    webpackConfig.output.crossOriginLoading = 'anonymous';
    webpackConfig.output.path = path.resolve(webpackConfig.context, webpackConfig.output.path);
    if (/\/$/.test(webpackConfig.output.path) === false) {
        webpackConfig.output.path += '/';
    }

    // === 插件配置
    // 插件不做merge, 否则会影响到原型链
    webpackConfig.plugins || (webpackConfig.plugins = []);
    if (Array.isArray(userWebpackConfigPlugins) && userWebpackConfigPlugins.length) {
        webpackConfig.plugins = webpackConfig.plugins.concat(userWebpackConfigPlugins);
    }

    switch (options.env) {
        case 'production':
            webpackConfig.devtool = 'cheap-module-source-map';
            webpackConfig.output.pathinfo = false;
            break;
        case 'development':
            webpackConfig.devtool = 'cheap-module-eval-source-map';
            webpackConfig.output.pathinfo = true;
            break;
    }

    if (!userWebpackConfig.override) { // 混合配置
        // === 配置别名
        // 在项目中可缩减引用路径
        webpackConfig.resolve || (webpackConfig.resolve = {});
        webpackConfig.resolve.alias || (webpackConfig.resolve.alias = {});

        // 用户package和webpack配置
        const pkgPath = path.join(options.cwd, 'package.json');
        const pkg = fileExists(pkgPath) ? require(pkgPath) : {};
        if (pkg.name) {
            webpackConfig.resolve.alias[pkg.name] = webpackConfig.context;
        }

        // === loader注入
        webpackConfig = require(path.join(__dirname, 'deploy/script'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/style'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/image'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/font'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/handlebars'))(options, webpackConfig);

        // 文件头banner设置
        if (pkg.name && pkg.version) {
            webpackConfig.plugins.push(new webpack.BannerPlugin({
                banner: pkg.name + ' v' + pkg.version
            }));
        }

        if (options.env === 'production') {
            webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
                output: {
                    ascii_only: true,
                },
                compress: {
                    warnings: false,
                }
            }));
        }

        // === 生成html
        let htmlEntryArr = generateHtmlEntry(options, webpackConfig);
        if (htmlEntryArr.length) {
            Array.prototype.push.apply(webpackConfig.plugins, htmlEntryArr);
        }

        if (options.quiet !== true) {
            webpackConfig.plugins.push(new webpack.ProgressPlugin(function (percentage, msg) {
                if (percentage === 1) {
                    printLog('[Guido] ' + chalk.green('Bundle build is now finished.'));
                } else if (process.stdout) {
                    const stream = process.stdout;
                    if (stream.isTTY) {
                        stream.cursorTo(0);
                        stream.write('[Guido] ' + chalk.magenta(msg));
                        stream.clearLine(1);
                    } else {
                        printLog(chalk.magenta(msg));
                    }
                }
            }));
        }
    }

    if (options.devServer) {
        webpackConfig.devServer || (webpackConfig.devServer = {});
        webpackConfig = require(path.join(__dirname, 'deploy/dev-server'))(options, webpackConfig);
        let devSeverClientUrl = 'http://' +
            webpackConfig.devServer.host + ':' +
            webpackConfig.devServer.port;

        Object.getOwnPropertyNames(webpackConfig.entry).map(function (name) {
            webpackConfig.entry[name] = []
                .concat(webpackConfig.entry[name])
                .concat('webpack-dev-server/client?' + devSeverClientUrl)
        });
    }

    delete webpackConfig.override;
    delete webpackConfig.output.templateDir;
    delete webpackConfig.output.jsDir;
    delete webpackConfig.output.cssDir;
    delete webpackConfig.output.imageDir;
    delete webpackConfig.output.fontDir;
    delete webpackConfig.output.browserslist;

    return webpackConfig;
};
