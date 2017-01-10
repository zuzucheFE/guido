"use strict";

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options) {
    options || (options = {});

    const cwd = options.cwd ? options.cwd : process.cwd();

    const jsFileName = options.hash ? '[name]-[chunkhash].js' : '[name].js';
    const jsChunkFileName = options.hash ? '[name]-chunk-[chunkhash].js' : '[name]-chunk.js';
    const cssFileName = options.hash ? '[name]-[contenthash].css' : '[name].css';
    // const commonName = options.hash ? 'common-[chunkhash].js' : 'common.js';

    return {
        context: cwd,

        profile: true,

        output: {
            filename: path.join(options.jsDir, jsFileName),

            chunkFilename: path.join(options.jsDir, jsChunkFileName),

            libraryTarget: 'var',

            publicPath: ''
        },

        devtool: 'sourcemap',

        debug: true,

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
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: [
                    'babel-loader'
                ].join('!')
            }, {
                test: /\.(handlebars|hbs)$/,
                loader: [
                    'handlebars-loader'
                ].join('!'),
                query: {
                    runtime: 'handlebars/dist/handlebars.runtime',
                    inlineRequires: [
                        '(?:',
                        [options.imageDir.replace('/', '\\/'), options.cssDir.replace('/', '\\/')].join('|'),
                        ')\\/?',
                        '.*\\.', '(jpe?g|png|gif|svg|css|scss|sass)'
                    ].join('')
                }
            }, {
                test: /\.json$/,
                loader: [
                    'json-loader'
                ].join('!')
            }, {
                test: /\.module\.css$/,
                loader: [
                    'style-loader',
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader'
                ].join('!'),
            }, {
                test: /\.module\.css\?__(url|inline)$/,
                loader: ExtractTextPlugin.extract([
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader'
                ].join('!')),
            }, {
                test: /\.module\.(scss|sass)$/,
                loader: [
                    'style-loader',
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader',
                    'sass-loader'
                ].join('!'),
            }, {
                test: /\.module\.(scss|sass)\?__(url|inline)$/,
                loader: ExtractTextPlugin.extract([
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader',
                    'sass-loader'
                ].join('!')),
            }, {
                test: function (filePath) {
                    return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
                },
                loader: [
                    'style-loader',
                    'css-loader?-sourceMap',
                    'postcss-loader'
                ].join('!')
            }, {
                test: function (filePath) {
                    return /\.css\?__(url|inline)$/.test(filePath) && !/\.module\.css$/.test(filePath);
                }, // inline是内联到html中
                loader: ExtractTextPlugin.extract('style-loader', [
                    'css-loader?-sourceMap',
                    'postcss-loader'
                ].join('!'))
            }, {
                test: function (filePath) {
                    return /\.(scss|sass)$/.test(filePath) && !/\.module\.(scss|sass)$/.test(filePath);
                },
                loader: [
                    'style-loader',
                    'css-loader?minimize&-sourceMap',
                    'postcss-loader',
                    'sass-loader'
                ].join('!')
            }, {
                test: function (filePath) {
                    return /\.(scss|sass)\?__(url|inline)$/.test(filePath) && !/\.module\.(scss|sass)\?__(url|inline)$/.test(filePath);
                }, // inline是内联到html中
                loader: ExtractTextPlugin.extract('style-loader', [
                    'css-loader?minimize&-sourceMap',
                    'postcss-loader',
                    'sass-loader'
                ].join('!'))
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: [
                    'url-loader?limit=10000&name=' + options.imageDir + '/[name]-[hash].[ext]',
                    'image-webpack'
                ].join('!')
            }, {
                test: /\.(jpe?g|png|gif|svg)\?__url$/i,
                loader: [
                    'file-loader?name=' + options.imageDir + '/[name]-[hash].[ext]',
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

        resolve: {
            root: [
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
