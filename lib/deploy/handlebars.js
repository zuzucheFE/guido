"use strict";

module.exports = function (options, webpackConfig) {
    let handlebarsModuleRules = [{
        test: /\.(handlebars|hbs)$/i,
        use: [{
            loader: 'handlebars-loader',
            options: {
                runtime: 'handlebars/runtime',
                inlineRequires: [
                    '(?:',
                    [options.imageDir.replace('/', '\\/'), options.cssDir.replace('/', '\\/')].join('|'),
                    ')\\/?',
                    '.*\\.', '(jpe?g|png|gif|svg|css|scss|sass)'
                ].join('')
            }
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(handlebarsModuleRules);

    return webpackConfig;
};