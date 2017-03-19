"use strict";

const fs = require('fs');
const path = require('path');

function fileExists(path) {
    return fs.existsSync(path);
}

module.exports = function (webpackConfig) {
    const eslintrcPath = path.join(webpackConfig.context, '.eslintrc');

    return {
        configFile: fileExists(eslintrcPath) ? eslintrcPath : path.join(__dirname, '../.eslintrc'),
        // 报warning了就终止webpack编译
        failOnWarning: true,
        // 报error了就终止webpack编译
        failOnError: true,
        // 开启eslint的cache，cache存在node_modules/.cache目录里
        cache: false
    }
};
