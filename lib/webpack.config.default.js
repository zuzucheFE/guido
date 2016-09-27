"use strict";

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = function (options) {
    options || (options = {});

    const cwd = options.cwd ? options.cwd : process.cwd();

    const jsFileName = options.hash ? '[name]-[chunkhash:8].js' : '[name].js';
    const cssFileName = options.hash ? '[name]-[chunkhash:8].css' : '[name].css';
    const commonName = options.hash ? 'common-[chunkhash:8].js' : 'common.js';

    return {
        profile: true,

        output: {
            filename: jsFileName,

            chunkFilename: jsFileName,

            libraryTarget: 'var'
        },

        devtool: 'source-map',

        sassLoader: require('./config/sass')(options),
        postcss: require('./config/postcss')(options),
        babel: require('./config/babel')(options),

        module: {
            preLoaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }],

            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.handlebars$/,
                loader: 'handlebars-loader',
                query: {
                    runtime: 'handlebars/dist/handlebars.runtime'
                }
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader',
                    'css-loader!' +
                    'postcss-loader'
                )
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader',
                    'css-loader!' +
                    'postcss-loader!' +
                    'sass-loader'
                )
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loafer?name=[name]-[hash:8].[ext]'
            }, {
                test: /\.(png|jpg|gif)\?__inline$/,
                loader: 'url-loafer?limit=30000'
            }]
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
            modulesDirectories: [
                path.join(__dirname, '../node_modules'),
                path.join(cwd, 'node_modules')
            ],
            extensions: ['', '.js', '.jsx']
        },
        resolveLoader: {
            modulesDirectories: [
                path.join(__dirname, '../node_modules'),
                path.join(cwd, 'node_modules')
            ]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: commonName,
                minChunks: 3
            }),
            new ExtractTextPlugin(cssFileName, {
                disable: false,
                allChunks: true
            })
        ]
    }
};
