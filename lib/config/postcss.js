"use strict";

const path = require('path');
const autoprefixer = require('autoprefixer');
const postCssSprites = require('postcss-sprites');

const reSpriteFilter = /\?__sprite$/;

module.exports = function (options) {
    options || (options = {});

    return function () {
        return [
            autoprefixer({
                browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
            })/*,
             postCssSprites({
             stylesheetPath: '',
             spritePath: path.join(options.cwd, 'dist/iamges/'), // 雪碧图合并后存放地址
             retina: true, //支持retina
             padding: 2,
             filterBy: function (image) {
             // 过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
             //
             if (reSpriteFilter.test(image.url)) {
             return Promise.resolve();
             }
             return Promise.reject();
             }/!*,
             groupBy: function (image) {
             // 将图片分组，可以实现按照文件夹生成雪碧图
             return spritesGroupBy(image);
             }*!/
             })*/
        ];
    };
};