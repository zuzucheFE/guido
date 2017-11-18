"use strict";

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
let isInlineResourceQuery = require('../utils/is-inline-resource-query');

module.exports = function (options, webpackConfig) {
    const postCSSOptions = {
        plugins: require(path.join(__dirname, '../config/postcss'))(options, webpackConfig)
    };

    const isProductionMode = options.env === 'production';

    // Module loader Config注入
    // ====================
    // style-loader的通用配置
    let styleLoaderOptions = {
        hmr: !!(webpackConfig.devServer && webpackConfig.devServer.hot)
    };

    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        minimize: isProductionMode,
        sourceMap: false, importLoaders: 1
    };
    let cssLoaderOptionsForGeneralSCSS = cssLoaderOptionsForGeneral;

    // css-loader的module css配置
    let cssLoaderOptionsForModule = {
        minimize: isProductionMode,
        modules: true, importLoaders: 1,
        localIdentName: '[local]--[hash:base64:5]',
        sourceMap: false, restructuring: false, autoprefixer: false
    };
    let cssLoaderOptionsForModuleSCSS = cssLoaderOptionsForModule;

    cssLoaderOptionsForModuleSCSS.importLoaders = cssLoaderOptionsForGeneralSCSS.importLoaders = 2;

    // scss-loader的通用配置
    let SCSSOptions = require(path.join(__dirname, '../config/sass'))(options, webpackConfig);

    let styleModuleRules = [{
        test: /\.(scss|css|sass)$/,
        oneOf: [{
            test: isCSSModulesFile,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'style-loader',
                options: styleLoaderOptions
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
                loader: 'style-loader',
                options: styleLoaderOptions
            }, {
                loader: 'css-loader',
                options: cssLoaderOptionsForModuleSCSS
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
                loader: 'style-loader',
                options: styleLoaderOptions
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
                loader: 'style-loader',
                options: styleLoaderOptions
            }, {
                loader: 'css-loader',
                options: cssLoaderOptionsForGeneralSCSS
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
                    options: cssLoaderOptionsForModuleSCSS
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
                    options: cssLoaderOptionsForGeneralSCSS
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
    let cssFileName = path.basename(webpackConfig.output.filename, '.js');
    cssFileName = cssFileName.replace(/\[(?:hash|chunkhash)\]/g, '[contenthash]') + '.css';

    webpackConfig.plugins.push(new ExtractTextPlugin({
        filename: path.join(webpackConfig.output.cssDir, cssFileName),
        disable: false,
        allChunks: true
    }));

    return webpackConfig;
};
