"use strict";

const path = require('path');
const postcss = require('postcss');
const postcssSprites = require('postcss-sprites');
const autoprefixer = require('autoprefixer');

module.exports = function (options) {
    options || (options = {});

    const RE_SPRITES_FILTER = /\?__sprite$/;
    const RE_SPRITES_PATH = new RegExp([
        options.imageDir.replace(/\//, '\\/'), '\\/(.*?)\\/.*'
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
        rule.insertAfter(comment, backgroundImageDecl);

        if (retina && ratio > 1) {
            let backgroundSizeDecl = postcss.decl({
                prop: 'background-size',
                value: sizeX + 'px ' + sizeY + 'px'
            });
            rule.insertAfter(backgroundImageDecl, backgroundSizeDecl);
        } else {
            let backgroundPositionDecl = postcss.decl({
                prop: 'background-position',
                value: posX + 'px ' + posY + 'px'
            });
            rule.insertAfter(backgroundImageDecl, backgroundPositionDecl);
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
        return path.join(options.cwd, options.tmpSpritesImageDir, file.join(''));
    }

    return function () {
        return [
            autoprefixer({
                browsers: options.browsers || ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
            }),
            postcssSprites({
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
            })
        ];
    };
};