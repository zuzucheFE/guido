"use strict";

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = function (options) {
    options || (options = {});

    const cwd = options.cwd ? options.cwd : process.cwd();

    const jsFileName = options.hash ? '[name]-[chunkhash:8].js' : '[name].js';
    const jsChunkFileName = options.hash ? '[name]-chunk-[chunkhash:8].js' : '[name]-chunk.js';
    const cssFileName = options.hash ? '[name]-[chunkhash:8].css' : '[name].css';
    // const commonName = options.hash ? 'common-[chunkhash:8].js' : 'common.js';

    return {
        context: cwd,

        profile: true,

        output: {
            filename: path.join(options.jsDir, jsFileName),

            chunkFilename: path.join(options.jsDir, jsChunkFileName),

            libraryTarget: 'var'
        },

        devtool: 'source-map',

        imageWebpackLoader: require('./config/image')(options),
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
                test: /\.(handlebars|hbs)$/,
                loader: [
                    'handlebars-loader?runtime=handlebars/dist/handlebars.runtime'
                ].join('!')
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', [
                    'css-loader',
                    'postcss-loader'
                ].join('!'))
            }, {
                test: /\.(scss|sass)$/,
                loader: ExtractTextPlugin.extract('style-loader', [
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ].join('!'))
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: [
                    'url-loader?limit=10000&name=' + options.imageDir + '/[name]-[hash:8].[ext]',
                    // 'file-loader?name=' + options.imageDir + '/[name]-[hash:8].[ext]',
                    'image-webpack'
                ].join('!')
            }, {
                test: /\.(jpe?g|png|gif|svg)\?__link$/i,
                loader: [
                    'file-loader?name=' + options.imageDir + '/[name]-[hash:8].[ext]',
                    'image-webpack'
                ].join('!')
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
        debug: true,
        resolve: {
            root: [
                path.join(__dirname, '..'), path.join(cwd, 'node_modules')
            ],
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
            /*new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: commonName,
                chunks: Object.keys(entries),
                minChunks: 3
            }),*/
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(options.env),
            }),
            new ExtractTextPlugin(path.join(options.cssDir, cssFileName), {
                disable: false,
                allChunks: true
            })
        ]
    }
};
