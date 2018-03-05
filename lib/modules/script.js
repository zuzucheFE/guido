'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('../config/paths');


const eslintFormatter = require('../utils/eslintFormatter');
const appendModuleRule = require('../utils/appendModuleRule');

module.exports = function (options, config) {
    const regScriptFile = /\.(js|jsx|mjs)$/;
    const regExclude = [/[/\\\\]node_modules[/\\\\]/];

    // eslint
    if (fs.existsSync(path.join(config.context, '.eslintrc'))) {
        config.module.rules.unshift({
            test: regScriptFile,
            enforce: 'pre',

            include: [paths.appEntry],
            exclude: regExclude,

            use: [{
                loader: require.resolve('eslint-loader'),
                options: {
                    configFile: path.join(config.context, '.eslintrc'),
                    // 报warning了就终止webpack编译
                    failOnWarning: false,
                    // 报error了就终止webpack编译
                    failOnError: true,
                    formatter: eslintFormatter
                }
            }]
        });
    }

    config = appendModuleRule(config, [{
        test: regScriptFile,

        include: [paths.appEntry],
        exclude: regExclude,

        use: [{
            loader: require.resolve('babel-loader'),
            options: {
                configFile: path.join(config.context, '.eslintrc'),
                // 报warning了就终止webpack编译
                failOnWarning: false,
                // 报error了就终止webpack编译
                failOnError: true,
                formatter: eslintFormatter
            }
        }]
    }, {
        test: /\.js$/i,

        use: [{
            loader: require.resolve('babel-loader'),
            options: {

            }
        }]
    }]);

    return config;
};
