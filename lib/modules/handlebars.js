'use strict';

const path = require('path');

const appendModuleRule = require('../utils/appendModuleRule');
const Typeof = require('../utils/typeof');

module.exports = function (config) {
    let handlebarsHelperDirs = [path.join(__dirname, '../fixtures/handlebars/helps/')];
    let handlebarsPartialDirs = [];

    if (Typeof.isObject(config.handlebars)) {
        if (Typeof.isArray(config.handlebars.helperDirs)) {
            handlebarsHelperDirs = handlebarsHelperDirs.concat(config.handlebars.helperDirs);
        }
        if (Typeof.isArray(config.handlebars.partialDirs)) {
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
