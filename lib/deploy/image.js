"use strict";

const path = require('path');
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

    const regGeneralImageFileName = /\.(jpe?g|png|gif|svg)$/i;

    const imageWebpackLoaderOptions = require(path.join(__dirname, '../config/image'))(options);
    // const imageWebpackLoaderOptions = {};

    let outputImageName = options.imageDir + '/[name]-[hash].[ext]';

    let imageModuleRules = [{
        oneOf: [{
            test: regGeneralImageFileName,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: -1, name: outputImageName
                }
            }, {
                loader: 'image-webpack-loader',
                options: imageWebpackLoaderOptions
            }]
        }, {
            test: regGeneralImageFileName,
            resourceQuery: isUrlResourceQuery,
            use: [{
                loader: 'file-loader',
                options: {
                    name: outputImageName
                }
            }, {
                loader: 'image-webpack-loader',
                options: imageWebpackLoaderOptions
            }]
        }, {
            test: regGeneralImageFileName,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8000, name: outputImageName
                }
            }, {
                loader: 'image-webpack-loader',
                options: imageWebpackLoaderOptions
            }]
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(imageModuleRules);

    return webpackConfig;
};