"use strict";

const path = require('path');
const postcss = require('postcss');
const extend = require('extend');
const postcssSprites = require('postcss-sprites');
const postcssIconFont = require('postcss-iconfont');
const autoprefixer = require('autoprefixer');

module.exports = function (options, webpackConfig) {
    const RE_SPRITES_FILTER = /\.(jpe?g|png|gif)\?__sprite$/;
    const RE_SPRITES_PATH = new RegExp([
        webpackConfig.output.imageDir.replace(/\//, '\\/'), '\\/(.*?)\\/.*'
    ].join(''), 'i');
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
            ['width', 'height'].forEach(function(prop) {
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
        return path.join(options.tmpCacheDir, file.join(''));
    }

    let browserslist = webpackConfig.browserslist.slice(0);
    let svg2fontOptions = extend(true, {}, webpackConfig.svg2font);
    return function () {
        return [
            autoprefixer({
                browsers: browserslist
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
    };
};

function strSplice(str, start, delCount, newSubStr) {
    return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
}

function discernFontSVG() {
    return postcss.plugin('postcss-discern-font-svg', function () {
        return function (root, result) {
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
