'use strict';

const env = require('../utils/env');
const appendModuleRule = require('../utils/appendModuleRule');

const regFontFile = /\.(?:ttf|eot|woff|woff2|svg)$/;

module.exports = function (config) {
    const isProd = env.isProd();

    config = appendModuleRule(config, [{
        test: regFontFile,

        use: [{
            loader: require.resolve('file-loader'),
            options: {
                name: config.output.fontDir + '/[name]' + (isProd ? '-[hash:8]' : '') + '.[ext]'
            }
        }]
    }]);

    return config;
};
