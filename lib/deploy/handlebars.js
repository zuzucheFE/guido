"use strict";

module.exports = function (options, webpackConfig) {
    let handlebarsModuleRules = [{
        test: /\.(handlebars|hbs)$/i,
        use: [{
            loader: 'handlebars-loader',
            options: {
                runtime: 'handlebars/runtime',
                inlineRequires: [
                    '^[\\.\\/\\w\\-]{0,}',
                    webpackConfig.output.imageDir.replace('/', '\\/'),
                    '\\/?',
                    '.*\\.', '(jpe?g|png|gif|svg)'
                ].join('')
            }
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(handlebarsModuleRules);

    return webpackConfig;
};
