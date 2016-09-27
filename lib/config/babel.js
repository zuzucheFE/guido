"use strict";

const tmpDir = require('os').tmpdir();

module.exports = function (options) {
    options || (options = {});

    return {
        cacheDirectory: tmpDir,
        presets: [
            // http://leonshi.com/2016/03/16/babel6-es6-inherit-issue-in-ie10/
            require.resolve('babel-preset-es2015-ie'),
            require.resolve('babel-preset-react'),
            require.resolve('babel-preset-stage-0'),
        ],
        plugins: [
            require.resolve('babel-plugin-add-module-exports'),
            require.resolve('babel-plugin-transform-decorators-legacy'),
        ],
    }
};
