"use strict";

module.exports = function (options, webpackConfig) {
    const IS_PRODUCTION_MODE = options.env === 'production';

    const LOADER_USE = [{
        loader: 'file-loader',
        options: {
            name: webpackConfig.output.fontDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]'
        }
    }];

    let fontModuleRules = [{
        oneOf: [{
            test: /\.(?:ttf|eot|woff|woff2)$/,
            use: LOADER_USE
        }, {
            test: /\.svg$/,
            resourceQuery: function (queryStr) {
                return queryStr.indexOf('__font') > -1;
            },
            use: LOADER_USE
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(fontModuleRules);

    return webpackConfig;
};
