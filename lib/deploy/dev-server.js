"use strict";

const path = require('path');

function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

module.exports = function (options, webpackConfig) {
    webpackConfig.devServer.host || (webpackConfig.devServer.host = '0.0.0.0');
    webpackConfig.devServer.port || (webpackConfig.devServer.port = '8080');
    webpackConfig.devServer.compress = true; // 强制启动gzip
    webpackConfig.devServer.contentBase = [webpackConfig.output.path, path.join(webpackConfig.context, 'src', 'mock')];
    // webpackConfig.devServer.publicPath = webpackConfig.output.publicPath;
    webpackConfig.devServer.stats = {
        colors: true
    };

    if (webpackConfig.devServer.historyApiFallback === undefined) {
        webpackConfig.devServer.historyApiFallback = {
            rewrites: []
        };
    }

    if (isObject(webpackConfig.devServer.historyApiFallback) &&
        Array.isArray(webpackConfig.devServer.historyApiFallback.rewrites)
    ) {
        webpackConfig.devServer.historyApiFallback.rewrites.push({
            from: /^\/api\/*./,
            to: function (context) {
                return context.parsedUrl.pathname.replace(/^\/api\//, '/');
            }
        });
    }

    return webpackConfig;
};
