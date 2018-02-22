'use strict';

const path = require('path');
const eslintFormatter = require('./eslint-formatter');

module.exports = function (webpackConfig) {
    return {
        configFile: path.join(webpackConfig.context, '.eslintrc'),
        // 报warning了就终止webpack编译
        failOnWarning: false,
        // 报error了就终止webpack编译
        failOnError: true,
        // 开启eslint的cache，cache存在node_modules/.cache目录里
        cache: false,
        formatter: eslintFormatter
    }
};
