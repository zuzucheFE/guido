"use strict";

const path = require('path');

module.exports = function (options, webpackConfig) {
    webpackConfig.devServer.host || (webpackConfig.devServer.host = '0.0.0.0');
    webpackConfig.devServer.port || (webpackConfig.devServer.port = '8080');
    webpackConfig.devServer.compress = true; // 强制启动gzip
    webpackConfig.devServer.contentBase = webpackConfig.output.path;
    webpackConfig.devServer.publicPath = '//' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port + '/';
    if (webpackConfig.stats) {
        webpackConfig.devServer.stats = webpackConfig.stats;
    }

    return webpackConfig;
};
