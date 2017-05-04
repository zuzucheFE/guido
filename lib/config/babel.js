'use strict';
// https://segmentfault.com/a/1190000006930013
// http://leonshi.com/2016/03/16/babel6-es6-inherit-issue-in-ie10/

// https://ntucker.true.io/ntucker/webpack-2-uncaught-referenceerror-exports-is-not-defined/

const tmpDir = require('os').tmpdir();

module.exports = function (webpackConfig) {
    let babelConfig = {
        cacheDirectory: tmpDir,
        presets: [

            [require.resolve('babel-preset-es2015'), {
                modules: false // tree-shaking优化, http://imweb.io/topic/5868e1abb3ce6d8e3f9f99bb
            }],
            require.resolve('babel-preset-react'),
            require.resolve('babel-preset-stage-1')
        ],
        plugins: [
            require.resolve('babel-plugin-syntax-dynamic-import'), // Allow parsing of import()
            [require.resolve('babel-plugin-transform-runtime'), {
                'helpers': false,
                'polyfill': true,
                'regenerator': true
            }],
            require.resolve('babel-plugin-transform-decorators-legacy')
        ]
    };

    // 开启react代码的模块热替换（HMR）
    if (webpackConfig.devServer && webpackConfig.devServer.hot === 2) {
        babelConfig.plugins.unshift(require.resolve('react-hot-loader/babel'));
    }
    return babelConfig;
};
