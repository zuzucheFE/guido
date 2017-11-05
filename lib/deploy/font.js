"use strict";

module.exports = function (options, webpackConfig) {
    const isProductionMode = options.env === 'production';

    let outputImageName = webpackConfig.output.fontDir + '/[name]' + (isProductionMode ? '-[hash]' : '') + '.[ext]';

    const RE_FONT_TEST = new RegExp(`(?:${options.tmpCacheDir}|${webpackConfig.output.fontDir})\\/.*\\.(?:ttf|eot|woff|woff2)$`);
    const RE_FONT_SVG_TEST = new RegExp(`(?:${options.tmpCacheDir}|${webpackConfig.output.fontDir})\\/.*\\.svg$`);

    const LOADER_USE = [{
        loader: 'file-loader',
        options: {
            name: outputImageName
        }
    }];

    let fontModuleRules = [{
        oneOf: [{
            test: RE_FONT_TEST,
            use: LOADER_USE
        }, {
            test: RE_FONT_SVG_TEST,
            resourceQuery: function (queryStr) {
                return queryStr.indexOf('__font') > -1;
            },
            use: LOADER_USE
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(fontModuleRules);

    return webpackConfig;
};
