"use strict";

module.exports = function (options, webpackConfig) {
    const isProductionMode = options.env === 'production';

    let outputImageName = webpackConfig.output.fontDir + '/[name]' + (isProductionMode ? '-[hash]' : '') + '.[ext]';

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
