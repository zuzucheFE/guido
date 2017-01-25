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

        devtool: 'sourcemap',

        // debug: true,

        // imageWebpackLoader: require('./config/image')(options),
        // sassLoader: require('./config/sass')(options),
        // postcss: require('./config/postcss')(options),
        // babel: require('./config/babel')(options),

        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader'
                }]
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            }, {
                test: /\.(handlebars|hbs)$/,
                use: [{
                    loader: 'handlebars-loader',
                    options: {
                        runtime: 'handlebars/dist/handlebars.runtime',
                        inlineRequires: [
                            '(?:',
                            [options.imageDir.replace('/', '\\/'), options.cssDir.replace('/', '\\/')].join('|'),
                            ')\\/?',
                            '.*\\.', '(jpe?g|png|gif|svg|css|scss|sass)'
                        ].join('')
                    }
                }]
            }, {
                test: /\.module\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: cssModuleLocalIdentName,
                        sourceMap: false, restructuring: false, autoprefixer: false
                    }
                }, {
                    loader: 'postcss-loader'
                }]/*,
                loader: [
                    'style-loader',
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader'
                ].join('!'),*/
            }, {
                test: /\.module\.css\?__(url|inline)$/,
                loader: ExtractTextPlugin.extract({
                    loader: [
                        'css-loader?sourceMap&-restructuring&modules&localIdentName=' + cssModuleLocalIdentName + '&-autoprefixer',
                        'postcss-loader'
                    ].join('!')
                })/*,
                loader: ExtractTextPlugin.extract([
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader'
                ].join('!')),*/
            }, {
                test: /\.module\.(scss|sass)$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: cssModuleLocalIdentName,
                        sourceMap: false, restructuring: false, autoprefixer: false
                    }
                }, {
                    loader: 'postcss-loader'
                }, {
                    loader: 'sass-loader'
                }]/*,
                loader: [
                    'style-loader',
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer',
                    'postcss-loader',
                    'sass-loader'
                ].join('!'),*/
            }, {
                test: /\.module\.(scss|sass)\?__(url|inline)$/,
                loader: ExtractTextPlugin.extract([
                    'css-loader?sourceMap&-restructuring&modules&localIdentName=' + cssModuleLocalIdentName + '&-autoprefixer',
                    'postcss-loader',
                    'sass-loader'
                ].join('!')),
            }, {
                test: function (filePath) {
                    return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
                },
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false
                    }
                }, {
                    loader: 'postcss-loader'
                }]/*,
                loader: [
                    'style-loader',
                    'css-loader?-sourceMap',
                    'postcss-loader'
                ].join('!')*/
            }, {
                test: function (filePath) {
                    return /\.css\?__(url|inline)$/.test(filePath) && !/\.module\.css$/.test(filePath);
                }, // inline是内联到html中
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?-sourceMap!postcss-loader'
                })
            }, {
                test: function (filePath) {
                    return /\.(scss|sass)$/.test(filePath) && !/\.module\.(scss|sass)$/.test(filePath);
                },
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        minimize: true, sourceMap: false
                    }
                }, {
                    loader: 'postcss-loader'
                }, {
                    loader: 'sass-loader'
                }]/*,
                loader: [
                    'style-loader',
                    'css-loader?minimize&-sourceMap',
                    'postcss-loader',
                    'sass-loader'
                ].join('!')*/
            }, {
                test: function (filePath) {
                    return /\.(scss|sass)\?__(url|inline)$/.test(filePath) &&
                        !/\.module\.(scss|sass)\?__(url|inline)$/.test(filePath);
                }, // inline是内联到html中
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?minimize&-sourceMap!postcss-loader!sass-loader'
                })
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000, name: options.imageDir + '/[name]-[hash].[ext]'
                    }
                }, {
                    loader: 'image-webpack'
                }]/*,
                loader: [
                    'url-loader?limit=10000&name=' + options.imageDir + '/[name]-[hash].[ext]',
                    'image-webpack'
                ].join('!')*/
            }, {
                test: /\.(jpe?g|png|gif|svg)\?__url$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: options.imageDir + '/[name]-[hash].[ext]'
                    }
                }, {
                    loader: 'image-webpack'
                }]/*,
                loader: [
                    'file-loader?name=' + options.imageDir + '/[name]-[hash].[ext]',
                    'image-webpack'
                ].join('!')*/
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
            }),*/
            new ExtractTextPlugin({
                filename: path.join(options.cssDir, cssFileName),
                disable: false,
                allChunks: true
            })
        ]
    }
};
