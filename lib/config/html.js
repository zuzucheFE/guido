/**
 * html模板入口
 */
"use strict";

const path = require('path');
const url = require('url');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml');

const ReBodyClosureTag = /<\/body>/;
const ReScriptTag = /<script[^>].*src=[\'\"]?([^\'\"]*)[\'\"]?.*>[.\n]*<\/script>/g;
const ReStyleTag = /<link[^>].*href=[\'\"]?([^\'\"]*)[\'\"]?.*>/g;
const ReInlinePlaceholder = /\?__inline$/i;
const ReUrlPlaceholder = /\?__url$/i;
const ReUrl = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

function isType(s, typeString) {
    return {}.toString.call(s) === `[object ${typeString}]`;
}
function isObject(s) {
    return isType(s, 'Object');
}
function isFunction(s) {
    return isType(s, 'Function');
}
function isRegExp(s) {
    return isType(s, 'RegExp');
}
function isUndefined(s) {
    return isType(s, 'Undefined');
}


// 从源码提取扩展，支持模拟数据渲染
HtmlWebpackPlugin.prototype.executeTemplate = function (templateFunction, chunks, assets, compilation) {
    let self = this;
    return Promise.resolve()
    // Template processing
        .then(function () {
            let templateParams = {
                compilation: compilation,
                webpack: compilation.getStats().toJson(),
                webpackConfig: compilation.options,
                htmlWebpackPlugin: {
                    files: assets,
                    options: self.options
                },
                data: self.options.data // 方便模板引用，减少层级
            };
            let html = '';
            try {
                html = templateFunction(templateParams);
                html = htmlAssetsProcess.call(self, html, chunks, assets, compilation);
            } catch (e) {
                compilation.errors.push(new Error('Template execution failed: ' + e));
                return Promise.reject(e);
            }
            return html;
        });
};

/**
 * 处理js和css
 */
function htmlAssetsProcess(html, chunks, assets, compilation) {
    let self = this;

    if (self.options.inject !== false) {
        return html;
    }

    // 生成静态文件Map
    // key => index.js、list/index.js
    // value => js/index-2fff43fc.js、js/list/index-58356006.js
    let assetsMap = generateAssetsMap(compilation);

    let associateCssArr = [];

    // js注入
    if (ReScriptTag.test(html)) { // 替换页面js文件
        html = html.replace(ReScriptTag, function (match, p1, offset, string) {
            let result = match;

            // 链接不做处理
            if (ReUrl.test(p1)) {
                return result;
            }

            // ../js/list.js => list.js
            // /js/list.js => list.js
            // ../js/list/index.js => list/index.js
            // /js/list/index.js => list/index.js
            let relativeJsDirPath = toRelativeJsDirPath.call(self, p1);

            if (!assetsMap[relativeJsDirPath]) {
                return result;
            }

            if (compilation.options.devServer === undefined && ReInlinePlaceholder.test(p1)) { // 内联形式
                let source = compilation.assets[assetsMap[relativeJsDirPath].path].source();
                result = match.replace(/ src=[\'\"]?([^\'\"]*)[\'\"]/, '')
                    .replace('<\/script>', source + '<\/script>');
            } else { // 链接形式
                let publicPath = url.resolve(compilation.options.output.publicPath, assetsMap[relativeJsDirPath].path);
                result = match.replace(p1, publicPath);

                if (compilation.options.output.crossOriginLoading !== false &&
                    /crossorigin=[\'\"]?(?:anonymous|use\-credentials)[\'\"]?/.test(result) === false) {
                    result = result.replace('<script', '<script crossorigin="' + compilation.options.output.crossOriginLoading + '"');
                }
            }

            // js所关联的css
            let associateCssKey = path.basename(relativeJsDirPath, path.extname(relativeJsDirPath)) + '.css';
            if (assetsMap[associateCssKey]
                && (
                    assetsMap[associateCssKey].isInline
                    || assetsMap[associateCssKey].isUrl
                )) {
                associateCssArr.push(associateCssKey);
            }

            return result;
        });
    } else { // 没找到，自动插入
        /*let scriptHtml = [];
         let publicScriptUrl = compilation.options.output.publicPath;

         Object.keys(assetsMap).forEach(function (assetItem) {
         let extName = path.extname(assetItem);
         if (assetItem !== 'common.js' && extName === '.js') {
         scriptHtml.push(createScriptTag(
         path.join(publicScriptUrl, assetsMap[assetItem].path),
         compilation.options.crossOriginLoading
         ));

         let associateCssKey = path.basename(assetItem, extName) + '.css';
         if (assetsMap[associateCssKey]
         && (
         assetsMap[associateCssKey].isInline
         || assetsMap[associateCssKey].isUrl
         )
         ) {
         associateCssArr.push(associateCssKey);
         }
         }
         });
         scriptHtml = scriptHtml.join('\n');

         if (ReBodyClosureTag.test(html)) {
         html = html.replace(ReBodyClosureTag, scriptHtml + '\n</body>');
         } else {
         html += '\n' + scriptHtml;
         }*/
    }

    // 公共common注入
    // if (assetsMap.hasOwnProperty('common.js')) {
    //     let commonScriptHtml = createScriptTag(
    //         url.resolve(compilation.options.output.publicPath, assetsMap['common.js'].path),
    //         compilation.options.crossOriginLoading
    //     );
    //     html = html.replace(/<script/, commonScriptHtml + '\n<script');
    // }

    // css注入
    if (ReStyleTag.test(html)) {
        html = html.replace(ReStyleTag, function (match, p1, offset, string) {
            let result = match;

            // 链接不做处理
            if (ReUrl.test(p1)) {
                return result;
            }

            // ../css/style.css => list.css
            // ../css/list/index.css => list/index.css
            let relativeDirPath = toRelativeCssDirPath.call(self, p1);

            if (!assetsMap[relativeDirPath]) {
                return result;
            }

            if (compilation.options.devServer === undefined && ReInlinePlaceholder.test(p1)) { // 内联形式
                let source = compilation.assets[assetsMap[relativeDirPath].path].source();
                result = match.replace(match, createStyleTag(source));
            } else { // 链接形式
                let publicPath = url.resolve(compilation.options.output.publicPath, assetsMap[relativeDirPath].path);
                result = match.replace(p1, publicPath);
            }

            return result;
        });
    } else if (associateCssArr.length) { // 没找到，自动插入
        let styleHtml = [];
        associateCssArr.forEach(function (val) {
            let mapItem = assetsMap[val];
            if (mapItem.isInline) {
                // let source = compilation.assets[mapItem.path].source();
                let source = compilation.assets[mapItem.path]['children']['0'].source();
                styleHtml.push(createStyleTag(source));
            } else {
                styleHtml.push(createStyleSheetTag(
                    url.resolve(compilation.options.output.publicPath, mapItem.path)
                ));
            }
        });
        styleHtml = styleHtml.join('\n');

        html = html.replace('</head>', styleHtml + '\n</head>');
    }

    return html;
}

function generateAssetsMap(compilation) {
    let statesJSON = compilation.getStats().toJson({
        source: false
    });

    // 生成静态文件Map
    // key => index.js、list/index.js
    // value => js/index-2fff43fc.js、js/list/index-58356006.js
    let assetsMap = {};
    // let hasCommonFile = false;
    Object.keys(statesJSON.assetsByChunkName).forEach(function (chunkName) {
        let chunkNameArr = Array.isArray(statesJSON.assetsByChunkName[chunkName]) ?
            statesJSON.assetsByChunkName[chunkName] : [statesJSON.assetsByChunkName[chunkName]];
        chunkNameArr.forEach(function (chunkPath) {
            let extName = path.extname(chunkPath);

            switch (extName) {
                case '.css':
                    assetsMap[chunkName + extName] = {
                        path: chunkPath,
                        isInline: false, isUrl: false
                    };
                    compilation.namedChunks[chunkName].getModules().forEach(function (module) {
                        if (module.rawRequest) {
                            assetsMap[chunkName + extName].rawRequest = module.rawRequest;
                            let reRawRequest = new RegExp('\\.(scss|sass|css)\\?__(url|inline)$');
                            if (reRawRequest.test(module.rawRequest)) {
                                if (compilation.options.devServer === undefined && ReInlinePlaceholder.test(module.rawRequest)) {
                                    assetsMap[chunkName + extName].isInline = true;
                                } else if (ReUrlPlaceholder.test(module.rawRequest)) {
                                    assetsMap[chunkName + extName].isUrl = true;
                                }
                            }
                        }
                    });
                    break;
                case '.js':
                    assetsMap[chunkName + extName] = {
                        path: chunkPath
                    };

                    // if (!hasCommonFile &&
                    //     compilation.namedChunks[chunkName] &&
                    //     compilation.namedChunks[chunkName].name === 'common' &&
                    //     compilation.namedChunks[chunkName].filenameTemplate &&
                    //     compilation.namedChunks[chunkName].entry
                    // ) {
                    //     hasCommonFile = true;
                    // }
                    break;
            }
        });
    });

    return assetsMap;
}

function createScriptTag (url, crossorigin) {
    if (crossorigin !== 'use-credentials' || crossorigin !== 'anonymous') {
        crossorigin = 'anonymous'
    }
    return [
        '<script ',
        'crossorigin="' + crossorigin + '" ',
        'src="' + url + '"></script>'
    ].join('');
}
function createStyleSheetTag (url) {
    return '<link rel="stylesheet" href="' + url + '">';
}
function createStyleTag (content) {
    return '<style>\n' + content + '</style>';
}

function toRelativeOutputDirPath (outputType, result) {
    let self = this;

    if (ReInlinePlaceholder.test(result)) {
        result = result.replace(ReInlinePlaceholder, '');
    } else if (ReUrlPlaceholder.test(result)) {
        result = result.replace(ReUrlPlaceholder, '');
    }

    let outputAssetsDirOpts = self.options.assetsDir;
    let rootPath;
    if (/^\//.test(result)) {
        rootPath = path.join(outputAssetsDirOpts.output, result);
    } else {
        let outputTemplateDir = path.join(outputAssetsDirOpts.output, outputAssetsDirOpts.template);
        rootPath = path.normalize(path.join(outputTemplateDir, result));
    }

    let outputDir = path.join(outputAssetsDirOpts.output, outputAssetsDirOpts[outputType]) + '/';
    rootPath = rootPath.replace(outputDir, '');

    return rootPath;
}
function toRelativeCssDirPath (result) {
    return toRelativeOutputDirPath.call(this, 'css', path.normalize(result));
}
function toRelativeJsDirPath (result) {
    return toRelativeOutputDirPath.call(this, 'js', path.normalize(result));
}

const REG_VIEW_HANDLEBARS_NAME_RULE = /(\.view)$/;
module.exports = function (options, webpackConfig) {
    let htmlDirCwd = path.join(webpackConfig.context, 'src');
    let htmlFiles = glob.sync('**/*.view.{handlebars,hbs}', {
        cwd: htmlDirCwd,
        nodir: true,
        matchBase: true
    });

    let htmlConfig = isObject(webpackConfig.html) ? webpackConfig.html : {};

    let result = [];

    if (htmlFiles.length) {
        htmlFiles.forEach(function (file) {
            if (!isUndefined(htmlConfig.test)) {
                let filterResult = true;
                if (isFunction(htmlConfig.test)) {
                    filterResult = htmlConfig.test(path.join(htmlDirCwd, file));
                } else if (isRegExp(htmlConfig.test)) {
                    filterResult = htmlConfig.test.test(path.join(htmlDirCwd, file));
                }

                if (filterResult === false) {
                    return;
                }
            }

            let info = path.parse(file);
            let renderDataPath = path.join(webpackConfig.context, 'src', 'mock', info.name);
            let renderData = {};
            try {
                renderData = require(renderDataPath);
            } catch (e) {
                renderData = {};
            }

            let filename = path.join(
                webpackConfig.output.path,
                webpackConfig.output.templateDir,
                (info.name.replace(REG_VIEW_HANDLEBARS_NAME_RULE, '')) + '.html'
            );

            let HtmlWebpackPluginConfig = {
                filename: filename,
                template: path.join(htmlDirCwd, file),
                inject: false,
                hash: false,

                data: renderData,
                assetsDir: {
                    output: webpackConfig.output.path,
                    template: webpackConfig.output.templateDir,
                    image: webpackConfig.output.imageDir,
                    font: webpackConfig.output.fontDir,
                    css: webpackConfig.output.cssDir,
                    svg: webpackConfig.output.svgDir,
                    js: webpackConfig.output.jsDir
                }
            };

            // https://github.com/jantimon/html-webpack-plugin/pull/797
            /* istanbul ignore if  */
            if ((options.devServer && isObject(webpackConfig.devServer)) || (options.watch && webpackConfig.watch)) {
                HtmlWebpackPluginConfig.multihtmlCache = true;
            }

            if (isFunction(htmlConfig.beforeInitialization)) {
                htmlConfig.beforeInitialization(HtmlWebpackPluginConfig);
            }

            let obj = new HtmlWebpackPlugin(HtmlWebpackPluginConfig);

            if (isFunction(htmlConfig.afterInitialization)) {
                obj = htmlConfig.afterInitialization(obj);
            }

            result.push(obj);
        });
    }

    return result;
};
