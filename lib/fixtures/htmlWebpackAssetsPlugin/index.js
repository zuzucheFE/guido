'use strict';
const path = require('path');
const url = require('url');

const isUndefined = require('../../utils/typeof').isUndefined;

const includeAssetsPluginName = 'HtmlWebpackIncludeAssetsPlugin';

const ReScriptTag = /<script[^>].*src=['"]?([^'"]*)['"]?.*>[.\n]*<\/script>/g;
const ReStyleTag = /<link[^>].*?href=['"]?([^'"]*)['"]?.*?>/g;
const ReInlinePlaceholder = /\?__inline$/i;
const ReUrlPlaceholder = /\?__url$/i;
const ReUrl = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-\/]))?$/;

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
                    break;
            }
        });
    });

    return assetsMap;
}

function createStyleSheetTag (url) {
    return '<link rel="stylesheet" href="' + url + '">';
}
function createStyleTag (content) {
    return '<style>\n' + content + '</style>';
}

function HtmlWebpackIncludeAssetsPlugin(options = {}) {
    this.options = options;
}
HtmlWebpackIncludeAssetsPlugin.prototype.toRelativeOutputDirPath = function (compilation, outputType, result) {
    if (ReInlinePlaceholder.test(result)) {
        result = result.replace(ReInlinePlaceholder, '');
    } else if (ReUrlPlaceholder.test(result)) {
        result = result.replace(ReUrlPlaceholder, '');
    }

    let outputAssetsDirOpts = this.options.assetsDir;
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
};
HtmlWebpackIncludeAssetsPlugin.prototype.toRelativeCssDirPath = function (compilation, result) {
    return this.toRelativeOutputDirPath(compilation, 'css', path.normalize(result));
};
HtmlWebpackIncludeAssetsPlugin.prototype.toRelativeJsDirPath = function (compilation, result) {
    return this.toRelativeOutputDirPath(compilation, 'js', path.normalize(result));
};
HtmlWebpackIncludeAssetsPlugin.prototype.apply = function (compiler) {
    let self = this;

    function onCompilation(compilation) {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(includeAssetsPluginName, (data, cb) => {
            let html = data.html;

            // 生成静态文件Map
            // key => index.js、list/index.js
            // value => js/index-2fff43fc.js、js/list/index-58356006.js
            let assetsMap = generateAssetsMap(compilation);

            let associateCssArr = [];

            // js注入
            if (ReScriptTag.test(html)) { // 替换页面js文件
                html = html.replace(ReScriptTag, (match, p1, offset, string) => {
                    let result = match;

                    // 链接不做处理
                    if (ReUrl.test(p1)) {
                        return result;
                    }

                    // ../js/list.js => list.js
                    // /js/list.js => list.js
                    // ../js/list/index.js => list/index.js
                    // /js/list/index.js => list/index.js
                    let relativeJsDirPath = self.toRelativeJsDirPath(compilation, p1);

                    if (!assetsMap[relativeJsDirPath]) {
                        return result;
                    }

                    if (isUndefined(compilation.options.devServer) && ReInlinePlaceholder.test(p1)) { // 内联形式
                        let source = compilation.assets[assetsMap[relativeJsDirPath].path].source();
                        result = match.replace(/ src=['"]?([^'"]*)['"]/, '')
                            .replace('</script>', source + '</script>');
                    } else { // 链接形式
                        let publicPath = url.resolve(compilation.options.output.publicPath || '', assetsMap[relativeJsDirPath].path);
                        result = match.replace(p1, publicPath);

                        if (compilation.options.output.crossOriginLoading !== false &&
                            /crossorigin=['"]?(?:anonymous|use\-credentials)['"]?/.test(result) === false) {
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
                html = html.replace(ReStyleTag, (match, p1, offset, string) => {
                    let result = match;

                    // 链接不做处理
                    if (ReUrl.test(p1)) {
                        return result;
                    }

                    // ../css/style.css => list.css
                    // ../css/list/index.css => list/index.css
                    let relativeDirPath = self.toRelativeCssDirPath(compilation, p1);

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

            cb(null, {html});
        });
    }

    compiler.hooks.compilation.tap('htmlWebpackIncludeAssetsPlugin', onCompilation);
};

module.exports = HtmlWebpackIncludeAssetsPlugin;
