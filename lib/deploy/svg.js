/**
 * loader配置 - svg文件处理
 *
 * 支持inline|url|sprite模式
 */
"use strict";

const path = require('path');

// inline是内联到html中
// node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
let isInlineResourceQuery = require('../utils/is-inline-resource-query');
let isUrlResourceQuery = require('../utils/is-url-resource-query');

const REG_SPRITE_SVG = /__sprite/;

module.exports = function (options, webpackConfig) {
    const IMAGE_WEBPACK_LOADER_OPTIONS = require(path.join(__dirname, '../config/image.js'))(options, webpackConfig);

    const IS_PRODUCTION_MODE = options.env === 'production';

    // 生成环境才做图片压缩
    const LOADER_SLICE_MAX = IS_PRODUCTION_MODE ? 2 : 1;

    const OUTPUT_SVG_NAME = webpackConfig.output.imageDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]';
    const OUTPUT_SPRITE_SVG_NAME = webpackConfig.output.imageDir + '/sprite-' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]';

    const SVG_SPRITE_RUNTIME_GENERATOR_PATH = require.resolve(path.join(__dirname, '../config/svg-sprite-runtime-generator.js'));

    let svgModuleRules = [{
        test: /\.svg$/i,
        oneOf: [{
            // sprite
            resourceQuery: REG_SPRITE_SVG,
            use: [{
                loader: 'svg-sprite-loader',
                options: {
                    runtimeGenerator: SVG_SPRITE_RUNTIME_GENERATOR_PATH
                }
            }, {
                loader: 'svgo-loader',
                options: {
                    plugins: [{
                        removeTitle: true
                    },{
                        removeAttrs: {
                            attrs: ['path:fill']
                        }
                    }, {convertPathData: false}]
                }
            }]
        }, {
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
