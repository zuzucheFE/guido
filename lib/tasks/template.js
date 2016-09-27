/**
 * 处理html
 */
"use strict";

// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');
const Datauri = require('datauri');

const gulp = require('gulp');
// const gulpif = require('gulp-if');
const replace = require('gulp-replace');

const util = require('./util');

let startTime;

const ReInlinePlaceholder = /\?__inline/i;

function getHtmlEntryFiles(path) {
    var htmlFileList = [];

    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item) {
        if (fs.statSync(path + '/' + item).isFile()) {
            htmlFileList.push(path + '/' + item);
        }
    });

    dirList.forEach(function(item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            htmlFileList.concat(getHtmlEntryFiles(path + '/' + item));
        }
    });

    return htmlFileList;
}

// see: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
function htmlReplace(match, p1, offset, string) {
    return p1 === '' || p1.indexOf('lang=') === -1 ? '<html lang="zh-CN"' + p1 + '>' : match;
}

function headerReplace(match, offset, string) {
    let result = [];
    if (/http-equiv="X-UA-Compatible"/.test(string) === false) {
        result.push('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
    }
    if (/name="renderer"/.test(string) === false) {
        result.push('<meta name="renderer" content="webkit">');
    }
    if (/rel="dns-prefetch"/.test(string) === false) {
        result.push('<link rel="dns-prefetch" href="//global.zuzuche.com/">');
        result.push('<link rel="dns-prefetch" href="//imgcdn1.zuzuche.com/">');
        result.push('<link rel="dns-prefetch" href="//imgcdn2.zuzuche.com/">');
        result.push('<link rel="dns-prefetch" href="//imgcdn3.zuzuche.com/">');
        result.push('<link rel="dns-prefetch" href="//imgcdn4.zuzuche.com/">');
    }

    result = result.join('\n    ');

    return result + '\n    <title>';
}
function bodyReplace(match, p1, offset, string) {
    let ie6 = ' class="ie6"', ie7 = ' class="ie7"',
        ie8 = ' class="ie8"', ie9 = ' class="ie9"',
        latest = '';
    if (p1.indexOf('class=') > -1) {
        let reBodyClass = /class=['"](.+)['"]/;
        ie6 = p1.replace(reBodyClass, 'class="ie6 $1"');
        ie7 = p1.replace(reBodyClass, 'class="ie7 $1"');
        ie8 = p1.replace(reBodyClass, 'class="ie8 $1"');
        ie9 = p1.replace(reBodyClass, 'class="ie9 $1"');
        latest = p1;
    } else {
        ie6 += p1;
        ie7 += p1;
        ie8 += p1;
        ie9 += p1;
        latest = p1;
    }
    return '<!--[if lt IE 7]><body' + ie6 + '><![endif]-->\n' +
        '<!--[if IE 7]><body' + ie7 + '><![endif]-->\n' +
        '<!--[if IE 8]><body' + ie8 + '><![endif]-->\n' +
        '<!--[if IE 9]><body' + ie9 + '><![endif]-->\n' +
        '<!--[if !IE]><!--><body' + latest + '><!--<![endif]-->';
}
function linkReplace(entryDir, outputDir, projectPath, match, p1, offset, string) {
    // entryDir like "/Users/kidney/Sites/zuzuche/static/lib"
    // outputDir like "/Users/kidney/Sites/zuzuche/static/dist/portalweb/fp/"
    // projectPath like "portalweb/fp/"
    // match like "<link rel="stylesheet" href="../css/index.css">"
    // p1 like "../css/index.css"

    let result = p1;

    let isInline = false;
    if (ReInlinePlaceholder.test(result)) {
        result = result.replace(ReInlinePlaceholder, '');
        isInline = true;
    }

    let newPathKey = path.join(projectPath, 'html', result);

    if (isInline) {
        let content = fs.readFileSync(path.join(outputDir, 'html', result), {
            encoding: 'utf8'
        });
        content = content.replace(/url\(\.\.\/images\//g, 'url(.\/images\/');

        result = match.replace(/ href=[\'\"]?([^\'\"]*)[\'\"]/, '')
                .replace(' rel="stylesheet"', '')
                .replace('<link', '<style') + '\n' + content + '\n<\/style>';
    } else {
        newPathKey = newPathKey.replace(path.extname(newPathKey), '');
        let assetsMapJSON = jsonfile.readFileSync(path.join(entryDir, '../assets-map.' + (util.isDebugMode() ? 'develop' : 'production') + '.json'));
        if (assetsMapJSON[newPathKey]) {
            result = match.replace(p1, assetsMapJSON[newPathKey].css);
        }
    }

    return result;
}

function imgReplace(httpPublicPath, entryDir, outputDir, projectPath, match, p1, offset, string) {
    // entryDir like "/Users/kidney/Sites/zuzuche/static/lib"
    // projectPath like "portalweb/fp/"
    // match like "<img border="0" src="../images/qrcode.png" width="148" height="148">"
    // p1 like "../images/qrcode.png"
    let result = p1;

    let isInline = false;
    if (ReInlinePlaceholder.test(result)) {
        result = result.replace(ReInlinePlaceholder, '');
        isInline = true;
    }

    // let newPathKey = path.join(projectPath, 'html', result);
    let sourcePath = path.join(entryDir, projectPath, 'html', result);

    if (isInline) {
        let   datauri = new Datauri(sourcePath);

        result = datauri.content;
    } else {
        let newImagePath = '';
        try {
            // let outputPath = path.join(entryDir, '../dist', newPathKey);
            let hash = util.md5(sourcePath + '@' + util.getTime(), 16);

            let info = path.parse(result);
            info.name += '-' + hash;

            newImagePath = path.join(outputDir, 'html', info.dir, info.name + info.ext);
            fs.copySync(sourcePath, newImagePath);
        } catch (err) {
            console.error(err)
        }

        if (newImagePath) {
            httpPublicPath += newImagePath.replace(outputDir, projectPath);
            result = match.replace(p1, httpPublicPath);
        }
    }

    return result;
}

function scriptReplace(entryDir, outputDir, projectPath, match, p1, offset, string) {
    // entryDir like "/Users/kidney/Sites/zuzuche/static/lib"
    // outputDir like "/Users/kidney/Sites/zuzuche/static/dist/portalweb/fp/"
    // projectPath like "portalweb/fp/"
    // match like "<script src="../js/index.js"></script>"
    // p1 like "../js/index.js"

    let result = p1;

    let isInline = false;
    if (ReInlinePlaceholder.test(result)) {
        result = result.replace(ReInlinePlaceholder, '');
        isInline = true;
    }

    let newPathKey = path.join(projectPath, 'html', result);

    if (isInline) {
        let content = fs.readFileSync(path.join(outputDir, 'html', result), {
            encoding: 'utf8'
        });
        result = match.replace(/ src=[\'\"]?([^\'\"]*)[\'\"]/, '')
            .replace('<\/script>', content + '<\/script>');
    } else {
        newPathKey = newPathKey.replace(path.extname(newPathKey), '');
        let assetsMapJSON = jsonfile.readFileSync(path.join(entryDir, '../assets-map.' + (util.isDebugMode() ? 'develop' : 'production') + '.json'));
        if (assetsMapJSON[newPathKey]) {
            result = match.replace(p1, assetsMapJSON[newPathKey].js);
        }
    }

    return result;
}

module.exports = function(options, callback) {
    startTime = util.getTime();

    //var htmlFileList = getHtmlEntryFiles(path.join(options.entryDir, options.projectPath, 'html'));
    var htmlFileList = [];
    var getHtmlEntryFiles = function(path) {
        var dirList = fs.readdirSync(path);
        dirList.forEach(function(item) {
            if (fs.statSync(path + '/' + item).isFile()) {
                htmlFileList.push(path + '/' + item);
            }
        });

        dirList.forEach(function(item) {
            if (fs.statSync(path + '/' + item).isDirectory()) {
                getHtmlEntryFiles(path + '/' + item);
            }
        });
    };
    getHtmlEntryFiles(path.join(options.entryDir, options.projectPath, 'html'));

    gulp.src([
        path.join(options.entryDir, options.projectPath, 'html/**/*.html'),
        path.join(options.entryDir, options.projectPath, 'html/**/*.handlebars'),
        path.join(options.entryDir, options.projectPath, 'html/**/*.hbs')
    ])
        // .pipe(gulpif(/\.(?:handlebars|hbs)$/, handlebars()))
        .pipe(replace(/<link[^>].*href=[\'\"]?([^\'\"]*)[\'\"]?.*>/, function(match, p1, offset, string) {
            return linkReplace.call(this, options.entryDir, options.outputDir, options.projectPath, match, p1, offset, string);
        }))
        .pipe(replace(/<script[^>].*src=[\'\"]?([^\'\"]*)[\'\"]?.*>[.\n]*<\/script>/, function(match, p1, offset, string) {
            return scriptReplace.call(this, options.entryDir, options.outputDir, options.projectPath, match, p1, offset, string);
        }))
        .pipe(replace(/<img[^>].*src=[\'\"]?([^\'\"]*)[\'\"]?.*>/, function(match, p1, offset, string) {
            return imgReplace.call(this, options.httpPublicPath, options.entryDir, options.outputDir, options.projectPath, match, p1, offset, string);
        }))
        .pipe(replace(/<html(.*)>/, htmlReplace))
        .pipe(replace(/<title>/, headerReplace))
        .pipe(replace(/<body(.*)>/, bodyReplace))
        .pipe(gulp.dest(path.join(options.outputDir, 'html')))
        .on('end', function() {
            callback(null, {
                startTime: startTime,
                endTime: util.getTime()
            });
        });
};