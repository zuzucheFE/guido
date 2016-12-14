"use strict";

const path = require('path');
const postcssSprites = require('postcss-sprites');
const autoprefixer = require('autoprefixer');

const reSpriteFilter = /\?__sprite$/;

module.exports = function (options) {
    options || (options = {});

    function spritesGroupBy(image) {
        let groups = /\/images\/(.*?)\/.*/gi.exec(image.url);
        let groupName = groups ? groups[1] : group;
        image.retina = true;
        image.ratio = 1;
        if (groupName) {
            let ratio = /@(\d+)x$/gi.exec(groupName);
            if (ratio) {
                ratio = ratio[1];
                while (ratio > 10) {
                    ratio = ratio / 10;
                }
                image.ratio = ratio;
            }
        }
        return Promise.resolve(groupName);
    }

    function spritesOnUpdateRule(isDev, rule, comment, image){
        var spriteUrl = image.spriteUrl;
        image.spriteUrl = '/public/' + spriteUrl;
        postcssSprites.updateRule(rule, comment, image);
    }

    function spritesOnSaveSpritesheet(isDev, opts, groups) {
        let file = postcssSprites.makeSpritesheetPath(opts, groups);
        return file;
    }

    return function () {
        return [
            autoprefixer({
                browsers: options.browsers || ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
            })/*,
            postcssSprites({
                basePath: './',
                stylesheetPath: path.join('./', 'dist', options.cssDir),
                spritePath: path.join('./', 'dist', options.imageDir), // 雪碧图合并后存放地址
                verbose: true,
                retina: true, //支持retina
                //padding: 2,
                filterBy: function (image) {
                    console.log(image);
                    console.log(reSpriteFilter.test(image.url));
                    // 过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
                    //
                    if (reSpriteFilter.test(image.url)) {
                        return Promise.resolve();
                    }
                    return Promise.resolve();
                }/!*,
                groupBy: function (image) {
                    // 将图片分组，可以实现按照文件夹生成雪碧图
                    return spritesGroupBy(image);
                },
                hooks: {
                    onUpdateRule: function (rule, comment, image) {
                        //更新生成后的规则，这里主要是改变了生成后的url访问路径
                        return spritesOnUpdateRule(true, rule, comment, image);
                    },
                    onSaveSpritesheet: function(opts, groups) {
                        return spritesOnSaveSpritesheet(true, opts, groups);
                    }
                }*!/
            })*/
        ];
    };
};