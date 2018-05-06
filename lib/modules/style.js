'use strict';

const path = require('path');
const extend = require('extend');
const postcss = require('postcss');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const postcssSprites = require('postcss-sprites');
const postcssIconFont = require('postcss-iconfont');

const paths = require('../config/paths');
const isInlineResourceQuery = require('../utils/isInlineResourceQuery');
const appendModuleRule = require('../utils/appendModuleRule');

function isCSSFile(filePath) {
    return /\.css$/i.test(filePath) && !/\.module\.css$/i.test(filePath);
}

function isSCSSFile(filePath) {
    return /\.(scss|sass)$/i.test(filePath) && !/\.module\.(scss|sass)$/i.test(filePath);
}

function isCSSModulesFile(filePath) {
    return /\.modules\.css$/i.test(filePath);
}

function isSCSSModulesFile(filePath) {
    return /\.modules\.(scss|sass)$/i.test(filePath);
}

function strSplice(str, start, delCount, newSubStr) {
    return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
}

function discernFontSVG() {
    return postcss.plugin('postcss-discern-font-svg', function () {
        return function (root) {
            root.walkAtRules('font-face', function (ruleItem) {
                ruleItem.walkDecls('src', function (decl) {
                    let searchValue = '.svg?';
                    let index = decl.value.indexOf(searchValue);
                    if (index > -1) {
                        decl.value = strSplice(decl.value, index + searchValue.length, 0, '__font&');
                        return false;
                    } else {
                        searchValue = '.svg';
                        index = decl.value.indexOf(searchValue);
                        if (index > -1) {
                            decl.value = strSplice(decl.value, index + searchValue.length, 0, '?__font');
                            return false;
                        }
                    }
                });
            });
        };
    });
}

const RE_SPRITES_FILTER = /\.(jpe?g|png|gif)\?__sprite$/;
let RE_SPRITES_PATH;
const RE_SPRITES_RETINA = new RegExp('@(\\d+)x\\.(jpe?g|png|gif)$', 'i');

function spritesGroupBy(image) {
    let groups = RE_SPRITES_PATH.exec(image.url);
    let groupName = groups && groups.length > 1 ? groups[1] : '';

    image.retina = true;
    image.ratio = 1;
    let ratio = RE_SPRITES_RETINA.exec(image.url);
    if (ratio) {
        ratio = ratio[1];
        while (ratio > 10) {
            ratio = ratio / 10;
        }
        image.ratio = ratio;
        image.groups = image.groups.filter(function (group) {
            return ('@' + ratio + 'x') !== group;
        });
        groupName += '@' + ratio + 'x';
    }

    return Promise.resolve(groupName);
}

function spritesOnUpdateRule(rule, comment, image) {
    let retina = image.retina;
    let ratio = image.ratio;
    let coords = image.coords;
    let spriteUrl = image.spriteUrl;

    let spriteWidth = image.spriteWidth;
    let spriteHeight = image.spriteHeight;

    let posX = -1 * Math.abs(coords.x / ratio);
    let posY = -1 * Math.abs(coords.y / ratio);
    let sizeX = spriteWidth / ratio;
    let sizeY = spriteHeight / ratio;

    let backgroundImageDecl = postcss.decl({
        prop: 'background-image',
        value: 'url(' + spriteUrl + '?__url)'
    });

    if (retina && ratio > 1) {
        let backgroundSizeDecl = postcss.decl({
            prop: 'background-size',
            value: sizeX + 'px ' + sizeY + 'px'
        });
        rule.insertAfter(comment, backgroundSizeDecl);
        rule.insertAfter(comment, backgroundImageDecl);
    } else {
        let backgroundPositionDecl = postcss.decl({
            prop: 'background-position',
            value: [
                posX ? posX + 'px' : posX,
                posY ? posY + 'px' : posY
            ].join(' ')
        });
        rule.insertAfter(comment, backgroundPositionDecl);
        rule.insertAfter(comment, backgroundImageDecl);
        ['width', 'height'].forEach(function (prop) {
            rule.insertAfter(rule.last, postcss.decl({
                prop: prop,
                value: image.coords[prop] + 'px'
            }));
        });
    }
}

function spritesOnSaveSpritesheet(opts, spritesheet) {
    let file = ['sprite'];

    if (spritesheet.groups.length) {
        let groupsStr = spritesheet.groups.join('-');
        groupsStr && file.push('-' + groupsStr);
    }

    file.push('.' + spritesheet.extension);
    return path.join(paths.appCache, file.join(''));
}

module.exports = function (config) {
    RE_SPRITES_PATH = new RegExp([
        config.output.imageDir.replace(/\//, '\\/'), '\\/(.*?)\\/.*'
    ].join(''), 'i');

    let isProductionMode = config.mode === 'production';

    // Module loader Config注入
    // ====================
    // style-loader的通用配置
    let styleLoaderOptions = {
        hmr: false
    };

    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        minimize: isProductionMode,
        sourceMap: false
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

    // scss-loader的通用配置
    let SCSSOptions = {
        outputStyle: isProductionMode ? 'compressed' : 'expanded',
        precision: 10,
        indentType: 'space',
        indentWidth: 2,
        sourceMap: false
    };

    let svg2fontOptions = extend(true, {}, config.svg2font);

    let postCSSOptions = {
        plugins: function () {
            return [
                autoprefixer({
                    browsers: config.browserslist.slice(0)
                }),
                postcssSprites({
                    verbose: false,
                    retina: true, // 支持retina
                    spritesmith: {},
                    filterBy: function (image) {
                        // 过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
                        if (RE_SPRITES_FILTER.test(image.originalUrl)) {
                            return Promise.resolve();
                        }
                        return Promise.reject();
                    },
                    groupBy: spritesGroupBy,
                    hooks: {
                        // 更新生成后的规则，这里主要是改变了生成后的url访问路径
                        onUpdateRule: spritesOnUpdateRule,
                        onSaveSpritesheet: spritesOnSaveSpritesheet
                    }
                }),
                postcssIconFont(svg2fontOptions),
                discernFontSVG()
            ];
        }
    };

    config = appendModuleRule(config, [{
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
        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: cssLoaderOptionsForModule
        }, {
            loader: 'postcss-loader',
            options: postCSSOptions
        }]
    }, {
        test: isSCSSModulesFile,
        use: [MiniCssExtractPlugin.loader, {
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
        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: cssLoaderOptionsForGeneral
        }, {
            loader: 'postcss-loader',
            options: postCSSOptions
        }]
    }, {
        test: isSCSSFile,
        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: cssLoaderOptionsForGeneralSCSS
        }, {
            loader: 'postcss-loader',
            options: postCSSOptions
        }, {
            loader: 'sass-loader',
            options: SCSSOptions
        }]
    }]);

    config.plugins.push(new MiniCssExtractPlugin({
        filename: isProductionMode ? '[name]-[contenthash].css' : '[name].css',
        chunkFilename: isProductionMode ? '[id]-[contenthash].css' : '[id].css'
    }));

    return config;
};
