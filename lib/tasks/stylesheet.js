/**
 * 处理css
 */
"use strict";

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssRevReplace = require('./task/css-rev-replace/index');
const spriter = require('./task/css-spriter/index');
const iconfont = require('gulp-iconfont');
const base64 = require('gulp-base64');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const outputAssets = require('./output-assets');

const util = require('./util');

let startTime;

module.exports = function(options, callback) {
    startTime = util.getTime();

    options || (options = {});
    typeof callback !== 'function' && (callback = function() {});

    var projectConfig = jsonfile.readFileSync(path.join(options.entryDir, options.projectPath, 'package.json'));

    let timestamp = util.getTime();

    let spriteFileNameHash = util.md5(timestamp, 16);
    let spriteFileName = 'sprite-' + spriteFileNameHash + '.png';
    let retinaSpriteFileName = 'sprite-' + spriteFileNameHash + '@2x.png';

    let spriteFilePath = path.join(options.outputDir, 'images', spriteFileName);
    let retinaSpriteFilePath = path.join(options.outputDir, 'images', retinaSpriteFileName);

    gulp.src([
        path.join(options.entryDir, options.projectPath, 'css/**/*.scss'),
        '!' + path.join(options.entryDir, options.projectPath, 'css/**/_*.scss')
    ]).pipe(sass({ // sass to css
            outputStyle: util.isDebugMode() ? 'expanded' : 'compressed',
            precision: 10,
            indentType: 'space',
            indentWidth: 2,
            functions: {
                'svg2font($defaultConfig)': function(defaultConfig, done) {
                    let config = {};
                    for (let i = 0, len = defaultConfig.getLength(); i < len; i++) {
                        config[defaultConfig.getKey(i).getValue()] = defaultConfig.getValue(i).getValue();
                    }

                    let fontsFileNameHash = util.md5(config.fontName + '-' + util.getTime(), 16);
                    let glyphsArr = [];
                    let formats = ['eot', 'woff', 'ttf', 'svg']; // default, 'woff2' and 'svg' are available

                    gulp.src([
                        path.join(options.entryDir, options.projectPath, 'fonts/*.svg')
                    ]).pipe(iconfont({
                        fontName: config.fontName, // required
                        prependUnicode: false, // recommended option
                        formats: formats,
                        startUnicode: 0xEA01,
                        timestamp: util.getTime() // recommended to get consistent builds when watching files
                    })).on('glyphs', function(glyphs, setting) {
                        glyphsArr = glyphs;
                    }).pipe(rename(function (path) {
                        path.basename = 'font-' + fontsFileNameHash;
                    })).pipe(gulp.dest(
                        path.join(options.outputDir, 'fonts')
                    )).on('finish', function() {
                        let self = this;

                        let nodeSass = require('node-sass');
                        let outputMap = new nodeSass.types.Map(4);
                        outputMap.setKey(0, new nodeSass.types.String('fontName'));
                        outputMap.setValue(0, new nodeSass.types.String(config.fontName));


                        let httpFontsPath = options.httpPublicPath + path.join(options.projectPath, options.httpFontsDir);
                        outputMap.setKey(1, new nodeSass.types.String('httpFontsPath'));
                        outputMap.setValue(1, new nodeSass.types.String(httpFontsPath));

                        // src生成
                        let srcList = new nodeSass.types.List(formats.length);
                        formats.forEach(function(currentValue, index) {
                            let itemMap = new nodeSass.types.Map(3);

                            itemMap.setKey(0, new nodeSass.types.String('url'));
                            itemMap.setValue(0, new nodeSass.types.String(httpFontsPath + 'font-' + fontsFileNameHash + '.' + currentValue));
                            itemMap.setKey(1, new nodeSass.types.String('type'));
                            itemMap.setValue(1, new nodeSass.types.String(currentValue));

                            let formatType = '';
                            switch (currentValue) {
                                case 'eot':
                                    formatType = 'embedded-opentype';
                                    break;
                                case 'woff':
                                    formatType = 'woff';
                                    break;
                                case 'ttf':
                                    formatType = 'truetype';
                                    break;
                                case 'svg':
                                    formatType = 'svg';
                                    break;
                            }
                            itemMap.setKey(2, new nodeSass.types.String('formatType'));
                            itemMap.setValue(2, new nodeSass.types.String(formatType));

                            srcList.setValue(index, itemMap);
                        });
                        outputMap.setKey(2, new nodeSass.types.String('srcList'));
                        outputMap.setValue(2, srcList);

                        // 选择器生成
                        let selectorList = new nodeSass.types.List(glyphsArr.length);
                        glyphsArr.forEach(function(currentValue, index) {
                            let selectorListItem = new nodeSass.types.List(2);
                            selectorListItem.setValue(0, new nodeSass.types.String(currentValue['name']));

                            let codePoint = currentValue['unicode'][0].charCodeAt(0).toString(16).toUpperCase();
                            selectorListItem.setValue(1, new nodeSass.types.String(codePoint));

                            selectorList.setValue(index, selectorListItem);
                        });

                        outputMap.setKey(3, new nodeSass.types.String('selectorList'));
                        outputMap.setValue(3, selectorList);

                        done(outputMap);
                    });
                }
            }
        }).on('error', sass.logError)
    ).pipe(cssRevReplace({
        outputDir: options.outputDir,
        httpPublicPath: options.httpPublicPath + options.projectPath,
        httpImagesDir: options.httpImagesDir,
        httpFontsDir: options.httpFontsDir
    })).pipe(spriter({ // 合并雪碧图
        spriteSheet: spriteFilePath,
        retinaSpriteSheet: retinaSpriteFilePath,
        pathToSpriteSheetFromCSS: options.httpPublicPath + path.join(options.projectPath, options.httpImagesDir, spriteFileName), // 输出http路径
        retinaPathToSpriteSheetFromCSS: options.httpPublicPath + path.join(options.projectPath, options.httpImagesDir, retinaSpriteFileName), // 输出http路径
        spritesmithOptions: {
            padding: 2
        },
        httpPublicPath: options.httpPublicPath + options.projectPath,
        httpImagesDir: options.httpImagesDir
    })).pipe(base64({ // 图片内嵌
        baseDir: path.join(options.entryDir, options.projectPath, 'images'),
        extensions: [/\.(?:jpg|gif|png|svg)\?__inline/i],
        maxImageSize: 4 * 1024 // bytes
    })).pipe(autoprefixer({ // 私有css属性补全
        // https://github.com/ai/browserslist#queries
        browsers: projectConfig.browsers || ['Chrome > 0', 'Firefox > 0', 'Safari >= 5', 'ie > 6'],
        cascade: true
    })).pipe(outputAssets({ // 输出静态JSON
        cwd: options.entryDir,
        httpPublicPath: options.httpPublicPath,
        outputFileName: path.join(process.cwd(), 'assets-map.' + (util.isDebugMode() ? 'develop' : 'production') + '.json')
    })).pipe(gulp.dest(path.join(options.outputDir, 'css')))
        .on('end', function(err) {
            callback(err, {
                startTime: startTime,
                endTime: util.getTime()
            });
        });
};