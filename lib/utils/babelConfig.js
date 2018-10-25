'use strict';

const paths = require('../config/paths');
const getCacheIdentifier = require('./getCacheIdentifier');
const getENV = require('./env').getENV;

module.exports = {
    default: function (config) {
        return {
            babelrc: false,
            configFile: false,
            compact: false,
            cacheDirectory: paths.appCache,
            cacheCompression: true,
            cacheIdentifier: getCacheIdentifier(getENV(), [
                'babel-preset-zuzuche'
            ]),
            sourceMaps: false,

            inputSourceMap: false,
            highlightCode: true,

            presets: [
                [require.resolve('babel-preset-zuzuche'), {
                    'env': {
                        targets: {
                            browsers: config.browserslist
                        }
                    }
                }]
            ],
            plugins: []
        };
    },
    dependencies: function (config) {
        return {
            babelrc: false,
            configFile: false,
            compact: false,
            cacheDirectory: paths.appCache,
            cacheCompression: true,
            cacheIdentifier: getCacheIdentifier(getENV(), [
                'babel-preset-zuzuche'
            ]),
            sourceMaps: false,

            inputSourceMap: false,
            highlightCode: true,

            sourceType: 'unambiguous',
            presets: [
                [require.resolve('babel-preset-zuzuche/dependencies'), {
                    env: {
                        targets: {
                            browsers: config.browserslist
                        }
                    }
                }]
            ],
            plugins: []
        };
    }
};
