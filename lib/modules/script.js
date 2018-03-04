'use strict';

const isUndefined = require('./ut');

module.exports = function (options, webpackConfig) {
    if (isUndefined(webpackConfig.output.filename)) {
        webpackConfig.output.filename = options.env === 'production' ? '[name]-[chunkhash].js' : '[name].js';
    }
    webpackConfig.output.filename = path.join(webpackConfig.output.jsDir, webpackConfig.output.filename);

    if (isUndefined(webpackConfig.output.chunkFilename)) {
        webpackConfig.output.chunkFilename = options.env === 'production' ? '[name]-chunk-[chunkhash].js' : '[name]-chunk.js';
    }
    webpackConfig.output.chunkFilename = path.join(webpackConfig.output.jsDir, webpackConfig.output.chunkFilename);
};
