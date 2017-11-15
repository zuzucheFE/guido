"use strict";

let lastDevBuildStateHash;

module.exports = function (options, webpackConfig) {
    webpackConfig.devServer.host || (webpackConfig.devServer.host = '0.0.0.0');
    webpackConfig.devServer.port || (webpackConfig.devServer.port = '8080');
    webpackConfig.devServer.compress = true; // 强制启动gzip
    webpackConfig.devServer.contentBase = webpackConfig.output.path;

    if (!webpackConfig.devServer.publicPath) {
        webpackConfig.devServer.publicPath = '//' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port + '/';
    }

    if (webpackConfig.stats) {
        webpackConfig.devServer.stats = webpackConfig.stats;
    }

    // 修复一次修改可能会多次触发 console.log https://webpack.js.org/api/node/#watching
    // 代替 webpack-dev-middleware -> Shared.js -> defaultReporter 方法
    // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/Shared.js#L37
    webpackConfig.devServer.reporter = function (reporterOptions) {
        let state = reporterOptions.state;
        let stats = reporterOptions.stats;
        let opts = reporterOptions.options;

        if(state) {
            if (lastDevBuildStateHash !== stats.hash) {
                let displayStats = (!opts.quiet && opts.stats !== false);
                if(displayStats && !(stats.hasErrors() || stats.hasWarnings()) &&
                    opts.noInfo)
                    displayStats = false;
                if(displayStats) {
                    opts.log(stats.toString(opts.stats));
                }
                if(!opts.noInfo && !opts.quiet) {
                    let msg = "Compiled successfully.";
                    if(stats.hasErrors()) {
                        msg = "Failed to compile.";
                    } else if(stats.hasWarnings()) {
                        msg = "Compiled with warnings.";
                    }
                    opts.log("webpack: " + msg);
                }

                lastDevBuildStateHash = stats.hash;
            }
        }
    };

    return webpackConfig;
};
