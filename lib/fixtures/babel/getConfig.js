'use strict';

const fs = require('fs');
const path = require('path');

const paths = require('../../config/paths');

module.exports = function (options = {}) {

    let babelConfig = {
        cacheDirectory: paths.appCache,
        inputSourceMap: false,
        highlightCode: true,
        compact: true
    };

    let babelRCPath = path.join(paths.appPath, '.babelrc');

    if (fs.existsSync(babelRCPath)) {
        babelConfig.babelrc = true;
    } else {
        babelConfig.presets = [
            [
                require.resolve('babel-preset-zuzuche'), {
                env: {
                    'targets': {
                        'browsers': options.browserslist
                    },
                    'useBuiltIns': false,
                    'modules': false,
                    'debug': false,
                },
                transformRuntime: {
                    'helpers': false,
                    'polyfill': true,
                    'regenerator': true
                }
            }]
        ];
        babelConfig.plugins = [];
    }

    return babelConfig;
};
