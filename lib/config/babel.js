'use strict';
// https://segmentfault.com/a/1190000006930013
// http://leonshi.com/2016/03/16/babel6-es6-inherit-issue-in-ie10/

// https://ntucker.true.io/ntucker/webpack-2-uncaught-referenceerror-exports-is-not-defined/

const path = require('path');
const fileExists = require('../utils/file-exists');

module.exports = function (options, webpackConfig) {
    let babelrcPath = path.join(options.cwd, '.babelrc');

    let babelConfig = {
        cacheDirectory: options.tmpCacheDir,
        inputSourceMap: false
    };

    if (!fileExists(babelrcPath)) {
        babelConfig.presets = [
            [
                require.resolve('babel-preset-zuzuche'), {
                env: {
                    'targets': {
                        'browsers': webpackConfig.browserslist
                    },
                    'useBuiltIns': false,
                    'modules': false,
                    'debug': false
                },
                transformRuntime: {
                    'helpers': false,
                    'polyfill': true,
                    'regenerator': true
                }
            }]
        ];
        babelConfig.plugins = [];
    } else {
        babelConfig.babelrc = true;
    }

    return babelConfig;
};
