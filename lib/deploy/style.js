"use strict";

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options, webpackConfig) {
    // inline是内联到html中
    // node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
    function isInlineResourceQuery(queryStr) {
        return queryStr === '?__inline';
    }
    function isUrlResourceQuery(queryStr) {
        return queryStr === '?__url';
    }

    // Module loader Config注入
    // ====================
    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        sourceMap: false
    };
    // css-loader的module css配置
    let cssLoaderOptionsForModule = {
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
        sourceMap: false, restructuring: false, autoprefixer: false
    };

    function isCSSFile (filePath) {
        return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
    }
    function isSCSSFile (filePath) {
        return /\.(scss|sass)$/.test(filePath) && !/\.module\.(scss|sass)$/.test(filePath);
    }

    let styleModuleRules = [{
        test: /\.module\.css$/i,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',
            options: cssLoaderOptionsForModule
        }, {
            loader: 'postcss-loader'
        }]
    }, {
        test: /\.module\.css$/i,
        resourceQuery: isUrlResourceQuery,
        use: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: [{
                loader: 'css-loader',
                options: cssLoaderOptionsForModule
            }, {
                loader: 'postcss-loader'
            }]
        })
    }, {
        test: /\.module\.(scss|sass)$/i,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',
            options: cssLoaderOptionsForModule
        }, {
            loader: 'postcss-loader'
        }, {
            loader: 'sass-loader'
        }]
    }, {
        test: /\.module\.(scss|sass)$/,
        resourceQuery: isUrlResourceQuery,
        use: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: [{
                loader: 'css-loader',
                options: cssLoaderOptionsForModule
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'sass-loader'
            }]
        })
    }, {
        test: isCSSFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',
            options: cssLoaderOptionsForGeneral
        }, {
            loader: 'postcss-loader'
        }]
    }, {
        test: isCSSFile,
        resourceQuery: isUrlResourceQuery,
        use: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: [{
                loader: 'css-loader',
                options: cssLoaderOptionsForGeneral
            }, {
                loader: 'postcss-loader'
            }]
        })
    }, {
        test: isSCSSFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',
            options: cssLoaderOptionsForGeneral
        }, {
            loader: 'postcss-loader'
        }, {
            loader: 'sass-loader'
        }]
    }, {
        test: isSCSSFile,
        resourceQuery: isUrlResourceQuery,
        use: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: [{
                loader: 'css-loader',
                options: cssLoaderOptionsForGeneral
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'sass-loader'
            }]
        })
    }];

    webpackConfig.module.rules = webpackConfig.module.rules.concat(styleModuleRules);



    // Module loader Plugins 注入
    // ====================
    let stylePlugins = [
        new webpack.LoaderOptionsPlugin({
            test: /\.(scss|sass)/i,
            options: {
                sassLoader: require('../config/sass')(options)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.(css|scss|sass)/i,
            options: {
                postcss: require('../config/postcss')(options)
            }
        })
    ];

    // ExtractTextPlugin注入
    const cssFileName = options.hash ? '[name]-[contenthash].css' : '[name].css';
    stylePlugins.push(new ExtractTextPlugin({
        filename: path.join(options.cssDir, cssFileName),
        disable: false,
        allChunks: true
    }));

    webpackConfig.plugins = webpackConfig.plugins.concat(stylePlugins);

    return webpackConfig;
};