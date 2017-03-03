"use strict";

module.exports = function (options, webpackConfig) {
    let outputImageName = webpackConfig.output.fontDir + '/[name]-[hash].[ext]';

    let fontModuleRules = [{
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        use: [{
            loader: 'file-loader',
            options: {
                limit: -1, name: outputImageName
            }
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(fontModuleRules);

    return webpackConfig;
};
