/**
 * loader配置 - svg文件处理
 *
 * 支持inline|url|sprite模式
 */
"use strict";

const path = require('path');

// inline是内联到html中
// node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
function isInlineResourceQuery(queryStr) {
    return queryStr === '?__inline';
}
function isUrlResourceQuery(queryStr) {
    return queryStr === '?__url';
}

module.exports = function (options, webpackConfig) {
    const IMAGE_WEBPACK_LOADER_OPTIONS = require(path.join(__dirname, '../config/image'))(options, webpackConfig);

    const IS_PRODUCTION_MODE = options.env === 'production';

    // 生成环境才做图片压缩
    const LOADER_SLICE_MAX = IS_PRODUCTION_MODE ? 2 : 1;

    const OUTPUT_SVG_NAME = webpackConfig.output.imageDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]';

    let svgModuleRules = [{
        test: /\.svg$/i,
        oneOf: [{
            // SVG 内联模式
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'svg-url-loader',
                options: {
                    limit: 0, noquotes: true, encoding: 'base64'
                }
            }]
        }, {
            resourceQuery: isUrlResourceQuery,
            use: [{
                loader: 'file-loader',
                options: {
                    name: OUTPUT_SVG_NAME
                }
            }, {
                loader: 'image-webpack-loader',
                options: IMAGE_WEBPACK_LOADER_OPTIONS
            }].slice(0, LOADER_SLICE_MAX)
        }, {
            resourceQuery: function (queryStr) {
                return queryStr.indexOf('__font') > -1;
            },
            use: [{
                loader: 'file-loader',
                options: {
                    name: webpackConfig.output.fontDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]'
                }
            }]
        }, {
            use: [{
                loader: 'file-loader',
                options: {
                    name: OUTPUT_SVG_NAME
                }
            }, {
                loader: 'image-webpack-loader',
                options: IMAGE_WEBPACK_LOADER_OPTIONS
            }].slice(0, LOADER_SLICE_MAX)
        }]
    }];

    webpackConfig.module.rules = webpackConfig.module.rules.concat(svgModuleRules);

    return webpackConfig;
};
