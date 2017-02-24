"use strict";

module.exports = function (options, webpackConfig) {
    webpackConfig.devServer.host || (webpackConfig.devServer.host = '0.0.0.0');
    webpackConfig.devServer.port || (webpackConfig.devServer.port = '8080');
    webpackConfig.devServer.compress = true;
    webpackConfig.devServer.contentBase = webpackConfig.output.path;
    webpackConfig.devServer.publicPath = webpackConfig.output.publicPath;
    webpackConfig.devServer.stats = {
        colors: true
    };

    return webpackConfig;
};
