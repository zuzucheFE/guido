/**
 * 默认webpack配置
 */
"use strict";

const path = require('path');

module.exports = function (options) {
    options || (options = {});

    const cwd = options.cwd ? options.cwd : process.cwd();

    return {
        context: cwd,

        profile: true,

        output: {
            libraryTarget: 'var',

            publicPath: '',

            path: 'dist',

            templateDir: 'html',
            jsDir: 'js',
            cssDir: 'css',
            imageDir: 'images',
            fontDir: 'fonts'
        },

        module: {
            rules: []
        },

        externals: [{
            'react': {
                root: 'React',
                var: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
                umd: 'react'
            },

            'react-dom': {
                root: 'ReactDOM',
                var: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
                umd: 'react-dom'
            },

            'jquery': {
                root: 'window.jQuery',
                var: 'window.jQuery',
                commonjs2: 'jquery',
                commonjs: 'jquery',
                amd: 'jquery',
                umd: 'jquery'
            }
        }],

        resolve: {
            modules: [
                path.join(__dirname, '..'),
                path.join(__dirname, '..', 'node_modules'),
                path.join(cwd, 'node_modules')
            ],
            // 配置别名，在项目中可缩减引用路径
            alias: {
                // handlebars-loader默认所使用的runtime，每次都会重新构建
                // 此方法不用重新构建，加快整体构建速度
                'handlebars/runtime': require.resolve('handlebars/dist/handlebars.runtime')
            }
        },
        resolveLoader: {
            modules: [
                path.join(__dirname, '..', 'node_modules'),
                path.join(cwd, 'node_modules')
            ]
        },
        plugins: []
    }
};
