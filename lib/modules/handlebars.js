'use strict';
const path = require('path');

const appendModuleRule = require('../utils/appendModuleRule');
const isArray = require('../utils/typeof').isArray;

module.exports = function (config) {
    let handlebarsHelperDirs = [];

    if (isArray(config.handlebarsHelperDirs)) {
        handlebarsHelperDirs = handlebarsHelperDirs.concat(config.handlebarsHelperDirs);
    }
    handlebarsHelperDirs.push(path.join(__dirname, '../handlebars-helps/'));

    let handlebarsPartialDirs = [];
    if (isArray(config.handlebarsPartialDirs)) {
        handlebarsPartialDirs = handlebarsPartialDirs.concat(config.handlebarsPartialDirs);
    }

    config = appendModuleRule(config, [{
        test: /\.(handlebars|hbs)$/i,
        use: [{
            loader: 'handlebars-loader',
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
