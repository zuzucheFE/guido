"use strict";

const path = require('path');
const fs = require('fs');
const HappyPack = require('happypack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const isUndefined = require('../utils/is-undefined');

const REG_SCRIPT_FILE = /\.(js|jsx)$/i;
const REG_EXCLUDE = /node_modules/i;

module.exports = function (options, webpackConfig) {
    if (isUndefined(webpackConfig.output.filename)) {
        webpackConfig.output.filename = options.env === 'production' ? '[name]-[chunkhash].js' : '[name].js';
    }
    webpackConfig.output.filename = path.join(webpackConfig.output.jsDir, webpackConfig.output.filename);

    if (isUndefined(webpackConfig.output.chunkFilename)) {
        webpackConfig.output.chunkFilename = options.env === 'production' ? '[name]-chunk-[chunkhash].js' : '[name]-chunk.js';
    }
    webpackConfig.output.chunkFilename = path.join(webpackConfig.output.jsDir, webpackConfig.output.chunkFilename);

    webpackConfig.plugins.push(new HappyPack({
        id: 'babel',
        loaders: [{
            loader: 'babel-loader',
            options: require(path.join(__dirname, '../config/babel'))(options, webpackConfig)
        }]
    }));
    webpackConfig.module.rules.push({
        test: REG_SCRIPT_FILE,
        exclude: REG_EXCLUDE,
        use: ['happypack/loader?id=babel']
    });

    if (fs.existsSync(path.join(webpackConfig.context, '.eslintrc'))) {
        webpackConfig.plugins.unshift(new HappyPack({
            id: 'eslint',
            loaders: [{
                loader: 'eslint-loader',
                options: require(path.join(__dirname, '../config/eslint'))(webpackConfig)
            }]
        }));
        webpackConfig.module.rules.unshift({
            test: REG_SCRIPT_FILE,
            exclude: REG_EXCLUDE,
            enforce: 'pre',
            use: ['happypack/loader?id=eslint']
        });
    }

    if (options.env === 'production') {
        webpackConfig.plugins.push(new ParallelUglifyPlugin({
            cacheDir: options.tmpCacheDir,
            uglifyJS: {
                // https://www.npmjs.com/package/uglify-js#output-options
                output: {
                    ascii_only: true,
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },

                // https://www.npmjs.com/package/uglify-js#compress-options
                compress: {
                    warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                    drop_console: false, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
                    drop_debugger: true, // 移除 `debugger;` 声明
                    collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                    reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                }
            }
        }));
    }

    return webpackConfig;
};
