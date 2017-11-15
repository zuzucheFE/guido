"use strict";
const path = require('path');
const HappyPack = require('happypack');

const isArray = require('../utils/is-array');

module.exports = function (options, webpackConfig) {
    let handlebarsHelperDirs = [];

    if (isArray(webpackConfig.handlebarsHelperDirs)) {
        handlebarsHelperDirs = handlebarsHelperDirs.concat(webpackConfig.handlebarsHelperDirs);
    }
    handlebarsHelperDirs.push(path.join(__dirname, '../handlebars-helps/'));

    let handlebarsPartialDirs = [];
    if (isArray(webpackConfig.handlebarsPartialDirs)) {
        handlebarsPartialDirs = handlebarsPartialDirs.concat(webpackConfig.handlebarsPartialDirs);
    }

    webpackConfig.plugins.push(new HappyPack({
        id: 'handlebars0',
        loaders: [{
            loader: 'handlebars-loader',
            options: {
                runtime: 'handlebars/runtime',
                helperDirs: handlebarsHelperDirs,
                partialDirs: handlebarsPartialDirs,
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
