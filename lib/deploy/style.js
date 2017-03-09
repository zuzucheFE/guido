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

    // Module loader Config注入
    // ====================
    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        sourceMap: false, importLoaders: 1
    };
    // css-loader的module css配置
    let cssLoaderOptionsForModule = {
        modules: true, importLoaders: 1,
        localIdentName: '[local]--[hash:base64:5]',
        sourceMap: false, restructuring: false, autoprefixer: false
    };

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
                loader: 'sass-loader'
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
                loader: 'sass-loader'
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
                    loader: 'sass-loader'
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
                    loader: 'sass-loader'
                }]
            })
        }]
    }];

    webpackConfig.module.rules = webpackConfig.module.rules.concat(styleModuleRules);



    // Module loader Plugins 注入
    // ====================
    let stylePlugins = [
        new webpack.LoaderOptionsPlugin({
            test: /\.(scss|sass)/i,
            options: {
                sassLoader: require(path.join(__dirname, '../config/sass'))(options, webpackConfig)
            }
        })
    ];

    // ExtractTextPlugin注入
    const cssFileName = options.hash ? '[name]-[contenthash].css' : '[name].css';
    stylePlugins.push(new ExtractTextPlugin({
        filename: path.join(webpackConfig.output.cssDir, cssFileName),
        disable: false,
        allChunks: true
    }));

    webpackConfig.plugins = webpackConfig.plugins.concat(stylePlugins);

    return webpackConfig;
};
