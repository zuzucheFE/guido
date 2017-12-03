/**
 * loader配置 - svg文件处理
 *
 * 支持inline|url|sprite模式
 */
"use strict";

const path = require('path');
const extend = require('extend');
const HappyPack = require('happypack');

// inline是内联到html中
// node_modules/webpack/lib/RuleSet.js:387 => RuleSet.prototype._run
const Utils = require('../utils/index');

const REG_SPRITE_SVG = /__sprite$/;
const REG_SPRITE_SVG_NOT_REACT = /__sprite&notrc$/;

const DEFAULT_SVG_SPRITE_OPTIONS = {
    esModule: true,
    svgo: {
        plugins: [{
            removeTitle: true
        },{
            removeAttrs: {
                attrs: ['path:fill']
            }
        }, {convertPathData: false}]
    }
};

module.exports = function (options, webpackConfig) {
    const IMAGE_WEBPACK_LOADER_OPTIONS = require(path.join(__dirname, '../config/image.js'))(options, webpackConfig);

    const IS_PRODUCTION_MODE = options.env === 'production';

    // 生成环境才做图片压缩
    const LOADER_SLICE_MAX = IS_PRODUCTION_MODE ? 2 : 1;

    const OUTPUT_SVG_NAME = webpackConfig.output.imageDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]';
    const OUTPUT_SPRITE_SVG_NAME = webpackConfig.output.imageDir + '/sprite-' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]';

    const SVG_SPRITE_RUNTIME_GENERATOR_PATH = require.resolve(path.join(__dirname, '../config/svg-sprite-runtime-generator.js'));
    const SVG_SPRITE_RUNTIME_GENERATOR_PATH_NOT_REACT = require.resolve(path.join(__dirname, '../config/svg-sprite-runtime-generator-not-react.js'));

    const SVG_SPRITE_OPTIONS = Utils.isUndefined(webpackConfig.svgSprite) ? {} : webpackConfig.svgSprite;

    let svgSpriteOptions;
    if (Utils.isObject(webpackConfig.svgSprite)) {
        svgSpriteOptions = extend(true, {}, DEFAULT_SVG_SPRITE_OPTIONS, SVG_SPRITE_OPTIONS);
    } else {
        svgSpriteOptions = extend(true, {}, DEFAULT_SVG_SPRITE_OPTIONS);
    }
    let svgSpriteSvgGoOptions = svgSpriteOptions.svgo;
    delete svgSpriteOptions.svgo;

    let svgSpriteOptionsForNotReact = extend(true, {}, svgSpriteOptions, {
        runtimeGenerator: SVG_SPRITE_RUNTIME_GENERATOR_PATH_NOT_REACT
    });
    let svgSpriteOptionsForReact = extend(true, {}, svgSpriteOptions, {
        runtimeGenerator: SVG_SPRITE_RUNTIME_GENERATOR_PATH
    });

    webpackConfig.plugins.push(new HappyPack({
        id: 'svgBabel',
        loaders: [{
            loader: 'babel-loader',
            options: require(path.join(__dirname, '../config/babel'))(options, webpackConfig)
        }]
    }));

    let svgModuleRules = [{
        test: /\.svg$/i,
        oneOf: [{
            // sprite for without react
            resourceQuery: REG_SPRITE_SVG_NOT_REACT,
            use: [{
                loader: 'happypack/loader?id=svgBabel'
            }, {
                loader: 'svg-sprite-loader',
                options: svgSpriteOptionsForNotReact
            }, {
                loader: 'svgo-loader',
                options: svgSpriteSvgGoOptions
            }]
        }, {
            // sprite for react
            resourceQuery: REG_SPRITE_SVG,
            use: [{
                loader: 'happypack/loader?id=svgBabel'
            }, {
                loader: 'svg-sprite-loader',
                options: svgSpriteOptionsForReact
            }, {
                loader: 'svgo-loader',
                options: svgSpriteSvgGoOptions
            }]
        }, {
            // SVG 内联模式
            resourceQuery: Utils.isInlineResourceQuery,
            use: [{
                loader: 'svg-url-loader',
                options: {
                    limit: 0, noquotes: true, encoding: 'base64'
                }
            }]
        }, {
            resourceQuery: Utils.isUrlResourceQuery,
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
