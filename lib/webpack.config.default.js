"use strict";

const path = require('path');
const webpack = require('webpack');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options) {
    options || (options = {});

    const cwd = options.cwd ? options.cwd : process.cwd();

    const jsFileName = options.hash ? '[name]-[chunkhash].js' : '[name].js';
    const jsChunkFileName = options.hash ? '[name]-chunk-[chunkhash].js' : '[name]-chunk.js';
    const cssFileName = options.hash ? '[name]-[contenthash].css' : '[name].css';
    // const commonName = options.hash ? 'common-[chunkhash].js' : 'common.js';
    const cssModuleLocalIdentName = '[local]___[hash:base64:5]';

    return {
        context: cwd,

        profile: true,

        output: {
            filename: path.join(options.jsDir, jsFileName),

            chunkFilename: path.join(options.jsDir, jsChunkFileName),

            libraryTarget: 'var',

            publicPath: ''
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
                path.join(__dirname, '..'), path.join(cwd, 'node_modules')
            ],
            // 配置别名，在项目中可缩减引用路径
            alias: {
                // handlebars-loader默认所使用的runtime，每次都会重新构建
                // 此方法不用重新构建，加快整体构建速度
                'handlebars/runtime': require.resolve('handlebars/dist/handlebars.runtime')
            }
            /*modulesDirectories: ['node_modules'],
            modulesDirectories: [
                path.join(__dirname, '../node_modules'),
                path.join(cwd, 'node_modules')
            ],*/
            //extensions: ['', '.js', '.jsx']
        },
        resolveLoader: {
            /*modulesDirectories: [
                path.join(__dirname, '../node_modules'),
                path.join(cwd, 'node_modules')
            ]*/
        },
        plugins: [
            /*new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(options.env),
            }),
            new ExtractTextPlugin({
                filename: path.join(options.cssDir, cssFileName),
                disable: false,
                allChunks: true
            })*/
        ]
    }
};
