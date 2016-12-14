/**
 * html模板入口
 */
"use strict";

const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ReBodyClosureTag = /<\/body>/;
const ReScriptTag = /<script[^>].*src=[\'\"]?([^\'\"]*)[\'\"]?.*>[.\n]*<\/script>/;
const ReStyleTag = /<link[^>].*href=[\'\"]?([^\'\"]*)[\'\"]?.*>/;
const ReInlinePlaceholder = /\?__inline$/i;
const ReUrlPlaceholder = /\?__url$/i;


// 从源码提取扩展，支持模拟数据渲染
HtmlWebpackPlugin.prototype.executeTemplate = function (templateFunction, chunks, assets, compilation) {
    let self = this;
    return Promise.resolve()
    // Template processing
        .then(function () {
            let templateParams = {
                compilation: compilation,
                webpack: compilation.getStats().toJson(), // webpack的stats对象
                webpackConfig: compilation.options, // webpack的配置项
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

    // 生成静态文件Map
    // key => index.js、list/index.js
    // value => js/index-2fff43fc.js、js/list/index-58356006.js
    let assetsMap = generateAssetsMap(compilation);

    let associateCssArr = [];

    // js注入
    if (ReScriptTag.test(html)) { // 替换页面js文件
        html = html.replace(ReScriptTag, function (match, p1, offset, string) {
            // let args = Array.prototype.slice.call(arguments);

            let result = match;

            // ../js/list.js => list.js
            // ../js/list/index.js => list/index.js
            let relativeJsDirPath = toRelativeJsDirPath.call(self, p1);

            if (ReInlinePlaceholder.test(p1)) { // 内联形式
                let source = compilation.assets[assetsMap[relativeJsDirPath].path].source();
                result = match.replace(/ src=[\'\"]?([^\'\"]*)[\'\"]/, '')
                    .replace('<\/script>', source + '<\/script>');
            } else { // 链接形式
                let publicPath = compilation.options.output.publicPath + assetsMap[relativeJsDirPath].path;
                result = match.replace(p1, publicPath);

                if (/crossorigin=[\'\"]?(?:anonymous|use\-credentials)[\'\"]?/.test(result) === false) {
                    result = result.replace('<script', '<script crossorigin="anonymous"');
                }
            }

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
    if (assetsMap.hasOwnProperty('common.js')) {
        let commonScriptHtml = createScriptTag(
            path.join(compilation.options.output.publicPath, assetsMap['common.js'].path),
            compilation.options.crossOriginLoading
        );
        html = html.replace(/<script/, commonScriptHtml + '\n<script');
    }

    // css注入
    if (associateCssArr.length) {
        let styleHtml = [];
        associateCssArr.forEach(function (val) {
            let mapItem = assetsMap[val];
            if (mapItem.isInline) {
                // let source = compilation.assets[mapItem.path].source();
                let source = compilation.assets[mapItem.path]['children']['0'].source();
                styleHtml.push(createStyleTag(source));
            } else {
                styleHtml.push(createStyleSheetTag(
                    path.join(compilation.options.output.publicPath, mapItem.path)
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
        statesJSON.assetsByChunkName[chunkName].forEach(function (chunkPath) {
            let extName = path.extname(chunkPath);

            switch (extName) {
                case '.css':
                    assetsMap[chunkName + extName] = {
                        path: chunkPath,
                        isInline: false, isUrl: false
                    };
                    compilation.namedChunks[chunkName].modules.forEach(function (module) {
                        if (module.rawRequest) {
                            assetsMap[chunkName + extName].rawRequest = module.rawRequest;
                            let reRawRequest = new RegExp('\\.(scss|sass|css)\\?__(url|inline)$');
                            if (reRawRequest.test(module.rawRequest)) {
                                if (ReInlinePlaceholder.test(module.rawRequest)) {
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


function toRelativeJsDirPath (result) {
    let self = this;

    if (ReInlinePlaceholder.test(result)) {
        result = result.replace(ReInlinePlaceholder, '');
    }
    if (ReUrlPlaceholder.test(result)) {
        result = result.replace(ReUrlPlaceholder, '');
    }

    let outputAssetsDir = self.options.assetsDir;
    let outputTemplateDir = path.join(outputAssetsDir.output, outputAssetsDir.template);
    let rootJSPath = path.normalize(path.join(outputTemplateDir, result));

    let outputJSDir = path.join(outputAssetsDir.output, outputAssetsDir.js) + '/';
    rootJSPath = rootJSPath.replace(outputJSDir, '');

    return rootJSPath;
}


module.exports = function (options) {
    let htmlDirCwd = path.join(options.cwd, 'src', options.templateDir);
    let htmlFiles = glob.sync('*', {
        cwd: htmlDirCwd,
        nodir: true,
        matchBase: true
    });

    let result = [
        //new MyHtmlWebpackPlugin()
    ];

    if (htmlFiles.length) {
        htmlFiles.forEach(function (file) {
            let info = path.parse(file);
            if (/[\.\-]?module$/.test(info.name) === false) {
                let renderDataPath = path.join(options.cwd, 'src', 'mock', info.name);
                let renderData = {};
                try {
                    renderData = require(renderDataPath);
                } catch (e) {
                    renderData = {};
                }

                result.push(new HtmlWebpackPlugin({
                    filename: path.join(options.cwd, 'dist', options.templateDir, info.name + '.html'),
                    template: path.join(htmlDirCwd, file),
                    inject: false,
                    hash: false,

                    data: renderData,
                    assetsDir: {
                        output: options.outputDir,
                        template: options.templateDir,
                        image: options.imageDir,
                        font: options.fontDir,
                        css: options.cssDir,
                        svg: options.svgDir,
                        js: options.jsDir
                    }
                }));
            }
        })
    }

    return result;
};

//
// function MyHtmlWebpackPlugin(options) {
// }
// MyHtmlWebpackPlugin.prototype.apply = function (compiler) {
//     var self = this;
//     compiler.plugin('compilation', function(compilation) {
//         compilation.plugin('html-webpack-plugin-alter-chunks', function(chunks, htmlPluginData) { // 1
//             var args = arguments;
//             console.log('\n==========\nhtml-webpack-plugin-alter-chunks');
//             console.log(args);
//             return chunks;
//         });
//
//         compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) { // 2
//             var args = arguments;
//             console.log('\n==========\nhtml-webpack-plugin-before-html-generation');
//             console.log(args);
//             callback(null);
//         });
//         compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) { // 3
//             var args = arguments;
//             console.log('\n==========\nhtml-webpack-plugin-before-html-processing');
//             console.log(args);
//             callback(null);
//         });
//         compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) { // 4
//             var args = arguments;
//             console.log('\n==========\nhtml-webpack-plugin-alter-asset-tags');
//             console.dir(args);
//             callback(null);
//         });
//         compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) { // 5
//             var args = arguments;
//             console.log('\n==========\nhtml-webpack-plugin-after-html-processing');
//             console.log(args);
//             callback(null);
//         });
//         compilation.plugin('html-webpack-plugin-after-emit', function(htmlPluginData, callback) { // 6
//             var args = arguments;
//             console.log('\n==========\nhtml-webpack-plugin-after-emit');
//             console.log(args);
//             callback(null);
//         });
//     });
// };
