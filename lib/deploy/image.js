"use strict";

const webpack = require('webpack');

module.exports = function (options, webpackConfig) {
    // inline是内联到html中
    // node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
    function isInlineResourceQuery(queryStr) {
        return queryStr === '?__inline';
    }
    function isUrlResourceQuery(queryStr) {
        return queryStr === '?__url';
    }

    function isImageFile (s) {
        return /\.(jpe?g|png|gif|svg)$/i.test(s);
    }

    let outputImageName = options.imageDir + '/[name]-[hash].[ext]'

    let imageModuleRules = [{
        test: isImageFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 8000, name: outputImageName
            }
        }/*, {
            loader: 'image-webpack-loader'
        }*/]
    }, {
        test: isImageFile,
        resourceQuery: isUrlResourceQuery,
        use: [{
            loader: 'file-loader',
            options: {
                name: outputImageName
            }
        }/*, {
            loader: 'image-webpack-loader'
        }*/]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(imageModuleRules);

    // Module loader Plugins 注入
    // ====================
    let imagePlugins = [
        new webpack.LoaderOptionsPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            options: {
                imageWebpackLoader: require('../config/image')(options)
            }
        }),
    ];
    webpackConfig.plugins = webpackConfig.plugins.concat(imagePlugins);

    return webpackConfig;
};