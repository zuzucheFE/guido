"use strict";

const path = require('path');

module.exports = function (options, webpackConfig) {
    // inline是内联到html中
    // node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
    function isInlineResourceQuery(queryStr) {
        return queryStr === '?__inline';
    }
    function isUrlResourceQuery(queryStr) {
        return queryStr === '?__url';
    }

    const regGeneralImageFileName = /\.(jpe?g|png|gif)$/i;

    const imageWebpackLoaderOptions = require(path.join(__dirname, '../config/image'))(options, webpackConfig);

    const isProductionMode = options.env === 'production';

    let outputImageName = webpackConfig.output.imageDir + '/[name]' + (isProductionMode ? '-[hash]' : '') + '.[ext]';

    // 生成环境才做图片压缩
    let loaderSliceMax = options.env === 'production' ? 2 : 1;

    let imageModuleRules = [{
        oneOf: [{
            test: regGeneralImageFileName,
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 0, name: outputImageName
                }
            }, {
                loader: 'image-webpack-loader',
                options: imageWebpackLoaderOptions
            }].slice(0, loaderSliceMax)
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
            }].slice(0, loaderSliceMax)
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
            }].slice(0, loaderSliceMax)
        }]
    }];
    webpackConfig.module.rules = webpackConfig.module.rules.concat(imageModuleRules);

    return webpackConfig;
};
