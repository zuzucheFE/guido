'use strict';

const tmpDir = require('os').tmpdir();

module.exports = function () {
    return {
        cacheDirectory: tmpDir,
        presets: [
            // http://leonshi.com/2016/03/16/babel6-es6-inherit-issue-in-ie10/
            ['es2015', {
                loose: true
            }],
            'react',
            'stage-1'
        ]
        ,plugins: [
            [require.resolve('babel-plugin-transform-runtime'), {
                'helpers': false,
                'polyfill': true,
                'regenerator': true
            }],
            require.resolve('babel-plugin-add-module-exports'),
            require.resolve('babel-plugin-transform-decorators-legacy')
        ]
    }
};
