"use strict";

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

module.exports = function (options, webpackConfig) {
    const REG_SCRIPT_FILE = /\.(js|jsx)$/i;

    const jsFileName = options.env === 'production' ? '[name]-[chunkhash].js' : '[name].js';
    webpackConfig.output.filename = path.join(webpackConfig.output.jsDir, jsFileName);

    const jsChunkFileName = options.env === 'production' ? '[name]-chunk-[chunkhash].js' : '[name]-chunk.js';
    webpackConfig.output.chunkFilename = path.join(webpackConfig.output.jsDir, jsChunkFileName);

    const REG_EXCLUDE = /node_modules/i;

    let scriptModuleRules = [{
        test: REG_SCRIPT_FILE,
        exclude: REG_EXCLUDE,
        use: [{
            loader: 'babel-loader',
            options: require(path.join(__dirname, '../config/babel'))(webpackConfig)
        }]
    }];

    if (fs.existsSync(path.join(webpackConfig.context, '.eslintrc'))) {
        scriptModuleRules.unshift({
            test: REG_SCRIPT_FILE,
            exclude: REG_EXCLUDE,
            enforce: 'pre',
            use: [{
                loader: 'eslint-loader',
                options: require(path.join(__dirname, '../config/eslint'))(webpackConfig)
            }]
        });
    }

    webpackConfig.module.rules = webpackConfig.module.rules.concat(scriptModuleRules);

    if (options.env === 'production') {
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
            output: {
                ascii_only: true
            },
            beautify: false, // 最紧凑的输出
            comments: false, // 删除所有的注释
            compress: {
                warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                drop_console: true, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
            }
        }));
    }

    return webpackConfig;
};
