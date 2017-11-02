"use strict";
const HappyPack = require('happypack');

module.exports = function (options, webpackConfig) {
    webpackConfig.plugins.push(new HappyPack({
        id: 'handlebars0',
        loaders: [{
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
    }));
    webpackConfig.module.rules.push({
        test: /\.(handlebars|hbs)$/i,
        use: ['happypack/loader?id=handlebars0']
    });

    return webpackConfig;
};
