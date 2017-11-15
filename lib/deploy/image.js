"use strict";

const path = require('path');

// inline是内联到html中
// node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
let isInlineResourceQuery = require('../utils/is-inline-resource-query');
let isUrlResourceQuery = require('../utils/is-url-resource-query');

const REG_GENERAL_IMAGE_FILE_NAME = /\.(jpg|jpeg|png|gif)$/i;

module.exports = function (options, webpackConfig) {
    const IMAGE_WEBPACK_LOADER_OPTIONS = require(path.join(__dirname, '../config/image'))(options, webpackConfig);

    const IS_PRODUCTION_MODE = options.env === 'production';

    // 生成环境才做图片压缩
    const LOADER_SLICE_MAX = IS_PRODUCTION_MODE ? 2 : 1;

    const OUTPUT_IMAGE_NAME = webpackConfig.output.imageDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]';

    let imageModuleRules = [{
        test: REG_GENERAL_IMAGE_FILE_NAME,
        oneOf: [{
            // 图片 内联模式
            resourceQuery: isInlineResourceQuery,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 0, name: OUTPUT_IMAGE_NAME
                }
            }, {
                loader: 'image-webpack-loader',
                options: IMAGE_WEBPACK_LOADER_OPTIONS
            }].slice(0, LOADER_SLICE_MAX)
        }, {
            // 图片 链接文件模式
            resourceQuery: isUrlResourceQuery,
            use: [{
                loader: 'file-loader',
                options: {
                    name: OUTPUT_IMAGE_NAME
                }
            }, {
                loader: 'image-webpack-loader',
                options: IMAGE_WEBPACK_LOADER_OPTIONS
            }].slice(0, LOADER_SLICE_MAX)
        }, {
            // 图片 默认处理是内联模式 >8kb文件走链接
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8000, name: OUTPUT_IMAGE_NAME
                }
            }, {
                loader: 'image-webpack-loader',
                options: IMAGE_WEBPACK_LOADER_OPTIONS
            }].slice(0, LOADER_SLICE_MAX)
        }]
    }];

    webpackConfig.module.rules = webpackConfig.module.rules.concat(imageModuleRules);

    return webpackConfig;
};
