"use strict";

module.exports = function (options, webpackConfig) {
    const devServerConfig = options.devServerConfig;
    webpackConfig.devServer = {
        host: devServerConfig.host || '0.0.0.0',
        port: devServerConfig.port || 8080,
        compress: true,
        contentBase: webpackConfig.output.path,
        stats: {
            colors: true
        }
    };

    return webpackConfig;
};