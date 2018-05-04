'use strict';

const paths = require('./paths');

let config = {
    context: paths.appPath,
    output: {
        path: paths.appDist,

        chunkLoadTimeout: 30 * 1000,

        templateDir: 'html',
        jsDir: 'js',
        cssDir: 'css',
        imageDir: 'images',
        fontDir: 'fonts'
    },
    module: {
        rules: [{
            oneOf: []
        }]
    },
    plugins: [],
    resolve: {
        alias: {
            'root': paths.appEntry
        },
        modules: [
            paths.ownNodeModules,
            paths.appNodeModules
        ],
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
        mainFields: ['module', 'jsnext:main', 'browser', 'main']
    },
    optimization: {
        minimizer: []
    },

    stats: {
        hash: true, // 增加编译的哈希值
        version: false, // webpack版本信息
        timings: true, // 增加时间信息
        assets: true, // 增加资源信息
        builtAt: true,
        chunks: false, // 增加包信息（设置为 `false` 能允许较少的冗长输出）
        colors: true, // `webpack --colors` 等同于
        errorDetails: true, // 增加错误的详细信息（就像解析日志一样）
        modules: false, // 增加内置的模块信息
        warnings: true, // 增加提示
        publicPath: true // 增加 publicPath 的信息
    },

    browserslist: [
        'Chrome >= 45', 'last 2 Firefox versions',
        'ie >= 9', 'Edge >= 12',
        'iOS >= 9', 'Android >= 4', 'last 2 ChromeAndroid versions'
    ]
};

config = require('../modules/script')(config);
config = require('../modules/style')(config);
config = require('../modules/images')(config);
config = require('../modules/handlebars')(config);

module.exports = config;
