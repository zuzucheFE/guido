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
    options.cwd = options.cwd ? options.cwd : process.cwd();

    // 用户package和webpack配置
    const pkgPath = path.join(options.cwd, 'package.json');
    const pkg = fileExists(pkgPath) ? require(pkgPath) : {};

    pkg.build || (pkg.build = {});
    options.publicPath = pkg.build.publicPath || '';
    options.outputDir = pkg.build.outputDir || 'dist';
    options.templateDir = pkg.build.templateDir || 'html';
    options.jsDir = pkg.build.jsDir || 'js';
    options.cssDir = pkg.build.cssDir || 'css';
    options.imageDir = pkg.build.imageDir || 'images';
    options.fontDir = pkg.build.fontDir || 'fonts';
    options.svgDir = pkg.build.svgDir || 'svg';

    function printLog (msg) {
        options.quiet || (console.log(msg));
    }

    const webpackConfigPath = path.join(options.cwd, 'webpack.config.js');
    const userWebpackConfig = fileExists(webpackConfigPath) ? require(webpackConfigPath) : {};

    let webpackConfig;
    if (pkg.build && pkg.build.webpackOverride === true) { // 直接覆盖配置
        webpackConfig = merge.recursive(true, {}, userWebpackConfig);
    } else { // 混合配置
        // 系统默认webpack配置
        const webpackConfigDefault = require(path.join(__dirname, './webpack.config.default.js'))(options);

        webpackConfig = merge.recursive(true, {}, webpackConfigDefault, userWebpackConfig);

        // === 配置别名
        // 在项目中可缩减引用路径
        webpackConfig.resolve || (webpackConfig.resolve = {});
        webpackConfig.resolve.alias || (webpackConfig.resolve.alias = {});

        if (pkg.name) {
            webpackConfig.resolve.alias[pkg.name] = options.cwd;
        }

        // === 插件配置
        webpackConfig.plugins = webpackConfig.plugins || [];

        webpackConfig = require(path.join(__dirname, './deploy/script.js'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, './deploy/style.js'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, './deploy/image.js'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, './deploy/handlebars.js'))(options, webpackConfig);

        // 按入口文件数使用common模块
        let entryArr = Object.keys(webpackConfig.entry);
        if (entryArr.length > 1) {
            webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: path.join(options.jsDir, (options.hash ? 'common-[chunkhash:8].js' : 'common.js')),
                // chunks: entryArr,
                minChunks: 2
            }));
        }

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

        // webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

        // 生成html
        let htmlEntryArr = generateHtmlEntry(options);
        if (htmlEntryArr.length) {
            Array.prototype.push.apply(webpackConfig.plugins, htmlEntryArr);
        }
        /*webpackConfig.plugins.push(new webpack.ProgressPlugin(function handler(percentage, msg) {
            if (percentage < 0.71) {
                const stream = process.stdout;
                if (stream.isTTY) {
                    stream.cursorTo(0);
                    stream.write(chalk.magenta(msg));
                    stream.clearLine(1);
                } else {
                    printLog(chalk.magenta(msg));
                }
            } else if (percentage === 1) {
                printLog('\n' + chalk.green('bundle build is now finished.') + '\n');
            }
        }));*/
    }

    webpackConfig.output.crossOriginLoading = 'anonymous';
    webpackConfig.output.path = path.join(options.cwd, options.outputDir + '/');
    webpackConfig.output.publicPath = options.publicPath;

    return webpackConfig;
};
