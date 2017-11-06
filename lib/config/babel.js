'use strict';
// https://segmentfault.com/a/1190000006930013
// http://leonshi.com/2016/03/16/babel6-es6-inherit-issue-in-ie10/

// https://ntucker.true.io/ntucker/webpack-2-uncaught-referenceerror-exports-is-not-defined/

module.exports = function (options, webpackConfig) {
    let babelConfig = {
        cacheDirectory: options.tmpCacheDir,
        presets: [
            [require.resolve('babel-preset-env'), {
                'targets': {
                    'browsers': webpackConfig.browserslist
                },
                'useBuiltIns': false,
                'modules': false,
                'debug': false
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
    /* istanbul ignore if  */
    if (webpackConfig.devServer && webpackConfig.devServer.hot === 2) {
        babelConfig.plugins.unshift(require.resolve('react-hot-loader/babel'));
    }
    return babelConfig;
};
