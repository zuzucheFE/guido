"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');


function fileExists(path) {
    return fs.existsSync(path);
}

module.exports = function (options, webpackConfig) {
    const REG_SCRIPT_FILE = /\.(js|jsx)$/i;

    const jsFileName = options.hash ? '[name]-[chunkhash].js' : '[name].js';
    webpackConfig.output.filename = path.join(webpackConfig.output.jsDir, jsFileName);

    const jsChunkFileName = options.hash ? '[name]-chunk-[chunkhash].js' : '[name]-chunk.js';
    webpackConfig.output.chunkFilename = path.join(webpackConfig.output.jsDir, jsChunkFileName);

    const eslintrcPath = path.join(webpackConfig.context, '.eslintrc');

    const REG_EXCLUDE = /node_modules/i;

    let scriptModuleRules = [{
        test: REG_SCRIPT_FILE,
        exclude: REG_EXCLUDE,
        enforce: 'pre',
        use: [{
            loader: 'eslint-loader',
            options: {
                configFile: fileExists(eslintrcPath) ? eslintrcPath : path.join(__dirname, '../.eslintrc'),
                // 报warning了就终止webpack编译
                failOnWarning: true,
                // 报error了就终止webpack编译
                failOnError: true,
                // 开启eslint的cache，cache存在node_modules/.cache目录里
                cache: false
            }
        }]
    }, {
        test: REG_SCRIPT_FILE,
        exclude: REG_EXCLUDE,
        use: [{
            loader: 'babel-loader'
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(scriptModuleRules);


    // Module loader Plugins 注入
    // ====================
    // const eslintrcPath = path.join(webpackConfig.context, '.eslintrc');
    let scriptPlugins = [
        new webpack.LoaderOptionsPlugin({
            test: REG_SCRIPT_FILE,
            options: {
                /*eslint: {
                    configFile: fileExists(eslintrcPath) ? eslintrcPath : path.join(__dirname, '../.eslintrc'),
                    // 报warning了就终止webpack编译
                    failOnWarning: true,
                    // 报error了就终止webpack编译
                    failOnError: true,
                    // 开启eslint的cache，cache存在node_modules/.cache目录里
                    cache: false
                },*/
                babel: require('../config/babel')()
            }
        }),
    ];
    webpackConfig.plugins = webpackConfig.plugins.concat(scriptPlugins);

    return webpackConfig;
};
