'use strict';

const path = require('path');

const appendModuleRule = require('../utils/appendModuleRule');
const isObject = require('../utils/typeof').isObject;
const isArray = require('../utils/typeof').isArray;

module.exports = function (config) {
    let handlebarsHelperDirs = [path.join(__dirname, '../fixtures/handlebars/helps/')];
    let handlebarsPartialDirs = [];

    if (isObject(config.handlebars)) {
        if (isArray(config.handlebars.helperDirs)) {
            handlebarsHelperDirs = handlebarsHelperDirs.concat(config.handlebars.helperDirs);
        }
        if (isArray(config.handlebars.partialDirs)) {
            handlebarsPartialDirs = handlebarsPartialDirs.concat(config.handlebars.partialDirs);
        }
    }


    config = appendModuleRule(config, [{
        test: /\.(handlebars|hbs)$/i,
        use: [{
            loader: require.resolve('handlebars-loader'),
            options: {
                runtime: 'handlebars/runtime',
                helperDirs: handlebarsHelperDirs,
                partialDirs: handlebarsPartialDirs,
                inlineRequires: [
                    '^[\\.\\/\\w\\-]{0,}',
                    config.output.imageDir.replace('/', '\\/'),
                    '\\/?',
                    '.*\\.', '(jpe?g|png|gif|svg)'
                ].join('')
            }
        }]
    }]);

    return config;
};
