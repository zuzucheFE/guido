"use strict";

const path = require('path');

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
        enforce: 'pre',
        use: [{
            loader: 'eslint-loader',
            options: require(path.join(__dirname, '../config/eslint'))(webpackConfig)
        }]
    }, {
        test: REG_SCRIPT_FILE,
        exclude: REG_EXCLUDE,
        use: [{
            loader: 'babel-loader',
            options: require(path.join(__dirname, '../config/babel'))()
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(scriptModuleRules);

    return webpackConfig;
};
