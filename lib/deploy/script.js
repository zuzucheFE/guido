"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');


function fileExists(path) {
    return fs.existsSync(path);
}

module.exports = function (options, webpackConfig) {
    function isScriptFile (s) {
        return /\.(js|jsx)$/i.test(s);
    }

    const exclude = /node_modules/;

    let scriptModuleRules = [{
        test: isScriptFile,
        exclude: exclude,
        enforce: 'pre',
        use: [{
            loader: 'eslint-loader'
        }]
    }, {
        test: isScriptFile,
        exclude: exclude,
        use: [{
            loader: 'babel-loader'
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(scriptModuleRules);

    // Module loader Plugins 注入
    // ====================
    const eslintrcPath = path.join(options.cwd, '.eslintrc');
    let scriptPlugins = [
        new webpack.LoaderOptionsPlugin({
            test: /\.(js|jsx)$/i,
            options: {
                eslint: {
                    configFile: fileExists(eslintrcPath) ? eslintrcPath : path.join(__dirname, '../.eslintrc'),
                    // 报warning了就终止webpack编译
                    failOnWarning: true,
                    // 报error了就终止webpack编译
                    failOnError: true,
                    // 开启eslint的cache，cache存在node_modules/.cache目录里
                    cache: false
                },
                babel: require('../config/babel')(options)
            }
        }),
    ];
    webpackConfig.plugins = webpackConfig.plugins.concat(scriptPlugins);

    return webpackConfig;
};