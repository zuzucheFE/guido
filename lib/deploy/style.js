"use strict";

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options, webpackConfig) {
    function isCSSFile (filePath) {
        return /\.css$/i.test(filePath) && !/\.module\.css$/i.test(filePath);
    }
    function isSCSSFile (filePath) {
        return /\.(scss|sass)$/i.test(filePath) && !/\.module\.(scss|sass)$/i.test(filePath);
    }
    function isCSSModulesFile (filePath) {
        return /\.modules\.css$/i.test(filePath);
    }
    function isSCSSModulesFile (filePath) {
        return /\.modules\.(scss|sass)$/i.test(filePath);
    }

    // 默认是内联
    // node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
    function isInlineResourceQuery(queryStr) {
        return queryStr === '?__inline';
    }

    const postCSSOptions = {
        plugins: require(path.join(__dirname, '../config/postcss'))(options, webpackConfig)
    };

    const isProductionMode = options.env === 'production';

    // Module loader Config注入
    // ====================
    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        minimize: isProductionMode,
        sourceMap: false, importLoaders: 1
    };
    // css-loader的module css配置
    let cssLoaderOptionsForModule = {
        minimize: isProductionMode,
        modules: true, importLoaders: 1,
        localIdentName: '[local]--[hash:base64:5]',
        sourceMap: false, restructuring: false, autoprefixer: false
    };

    // scss-loader的通用配置
    let SCSSOptions = require(path.join(__dirname, '../config/sass'))(options, webpackConfig);

    let styleModuleRules = [{
        oneOf: [{
            test: isCSSModulesFile,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: cssLoaderOptionsForModule
            }, {
                loader: 'postcss-loader',
                options: postCSSOptions
            }]
        }, {
            test: isSCSSModulesFile,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: cssLoaderOptionsForModule
            }, {
                loader: 'postcss-loader',
                options: postCSSOptions
            }, {
                loader: 'sass-loader',
                options: SCSSOptions
            }]
        }, {
            test: isCSSFile,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: cssLoaderOptionsForGeneral
            }, {
                loader: 'postcss-loader',
                options: postCSSOptions
            }]
        }, {
            test: isSCSSFile,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: cssLoaderOptionsForGeneral
            }, {
                loader: 'postcss-loader',
                options: postCSSOptions
            }, {
                loader: 'sass-loader',
                options: SCSSOptions
            }]
        }, {
            test: isCSSModulesFile,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: cssLoaderOptionsForModule
                }, {
                    loader: 'postcss-loader',
                    options: postCSSOptions
                }]
            })
        }, {
            test: isSCSSModulesFile,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: cssLoaderOptionsForModule
                }, {
                    loader: 'postcss-loader',
                    options: postCSSOptions
                }, {
                    loader: 'sass-loader',
                    options: SCSSOptions
                }]
            })
        }, {
            test: isCSSFile,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: cssLoaderOptionsForGeneral
                }, {
                    loader: 'postcss-loader',
                    options: postCSSOptions
                }]
            })
        }, {
            test: isSCSSFile,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: cssLoaderOptionsForGeneral
                }, {
                    loader: 'postcss-loader',
                    options: postCSSOptions
                }, {
                    loader: 'sass-loader',
                    options: SCSSOptions
                }]
            })
        }]
    }];

    webpackConfig.module.rules = webpackConfig.module.rules.concat(styleModuleRules);


    // Module loader Plugins 注入
    // ====================
    // ExtractTextPlugin注入
    const cssFileName = options.env === 'production' ? '[name]-[contenthash].css' : '[name].css';
    webpackConfig.plugins.push(new ExtractTextPlugin({
        filename: path.join(webpackConfig.output.cssDir, cssFileName),
        disable: false,
        allChunks: true
    }));

    return webpackConfig;
};
