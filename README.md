# Guido

[![npm](https://img.shields.io/npm/v/guido.svg)](https://www.npmjs.com/package/guido)
[![Travis branch](https://img.shields.io/travis/kidney/guido/master.svg)](https://travis-ci.org/kidney/guido)
[![Coveralls branch](https://img.shields.io/coveralls/kidney/guido/master.svg)](https://coveralls.io/github/kidney/guido)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/kidney/guido/master/LICENSE)

适用于`cmd` `amd` `react` `jquery` `sass` `handlebars`开发体系的构建工具，还内置静态资源（样式、图片）内联外链、自动化雪碧图、资源to base64、资源文件注入模板、dev server等构建、调试、打包部署功能，减少同体系开发环境的重复配置。

**这是基于webpack2的构建工具**


## 安装 & 使用

```shell
npm install guido -g
guido -v
```



## 特性

- [x] 模块化
- [x] jsx转换
- [x] ES6 to ES5
- [x] ESLint语法检查
- [x] 公共代码抽离
- [x] scss to css
- [x] css modules
- [x] 雪碧图合并、切割分组、retina
- [x] autoprefixer
- [x] handlebars
- [x] 资源文件dataurl
- [x] svg to webfont
- [x] 本地服务




## 使用文档

- [快速开始](https://github.com/kidney/guido/blob/master/docs/get-started.md)
- [配置](https://github.com/kidney/guido/blob/master/docs/configuration.md)
- [CSS Sprite图片合并](https://github.com/kidney/guido/blob/master/docs/css-images-sprite.md)
- [嵌入资源](https://github.com/kidney/guido/blob/master/docs/resource-inline.md)
