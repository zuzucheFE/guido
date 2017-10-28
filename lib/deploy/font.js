"use strict";

module.exports = function (options, webpackConfig) {
    const isProductionMode = options.env === 'production';

    let outputImageName = webpackConfig.output.fontDir + '/[name]' + (isProductionMode ? '-[hash]' : '') + '.[ext]';

    const RE_FONT_TEST = new RegExp(`${options.tmpCacheDir}\\/.*\\.(?:svg|ttf|eot|woff|woff2)$`);

    let fontModuleRules = [{
        test: RE_FONT_TEST,
        use: [{
            loader: 'file-loader',
            options: {
                name: outputImageName
            }
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(fontModuleRules);

    return webpackConfig;
};
