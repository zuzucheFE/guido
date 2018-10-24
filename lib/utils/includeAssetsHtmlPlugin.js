/**
 * html资源注入
 *
 * <html>
 *     <head>
 *         {{assets.entryA.css.toComboTag}}
 *     </head>
 *     <body>
 *         {{assets.entryA.js.toComboTag}}
 *         {{#each assets.entryA.js}}
 *         <script src="{{url}}"></script>
 *         {{/each}}
 *     </body>
 */

'use strict';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlTags = require('html-webpack-plugin/lib/html-tags');

const includeAssetsHtmlPluginName = 'IncludeAssetsHtmlPlugin';


function injectAsset() {

}

class IncludeAssetsHtmlPlugin {
    constructor(options = {}) {
        const userOptions = options || {};

        const defaultOptions = {
            inject: injectAsset
        };

        this.options = Object.assign(defaultOptions, userOptions);
    }

    templateParametersGenerator(compilation, assets, assetTags, options) {
        let publicPath = assets.publicPath || '';
        if (publicPath !== '' && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        const xhtml = options.xhtml;
        const crossOriginLoading = compilation.options.output.crossOriginLoading;

        let newAssetFiles = {};

        compilation.entrypoints.forEach(function (EntryPoint) {
            let entryPointFiles = {js: [], css: []};

            EntryPoint.chunks.forEach(function (chunk) {
                let chunkName = chunk.name;
                chunk.files.forEach(function (file) {
                    let extName = path.extname(file).replace('.', '');
                    let tag = {};

                    let url = `${publicPath}${file}`;
                    if (extName === 'js') {
                        tag = {
                            tagName: 'script',
                            voidTag: false,
                            attributes: {
                                src: url
                            }
                        };

                        if (crossOriginLoading !== false) {
                            tag.attributes.crossorigin = crossOriginLoading;
                        }
                    } else if (extName === 'css') {
                        tag = {
                            tagName: 'link',
                            voidTag: true,
                            attributes: {
                                href: url,
                                rel: 'stylesheet'
                            }
                        };
                    }

                    entryPointFiles[extName].push({
                        chunkName, url,
                        source: compilation.assets[file].source(),
                        tag: htmlTags.htmlTagObjectToString(tag, xhtml)
                    });
                });
            });

            entryPointFiles.js.toComboTag = entryPointFiles.js.map((assetTagObject) => assetTagObject.tag).join('\n');
            entryPointFiles.css.toComboTag = entryPointFiles.css.map((assetTagObject) => assetTagObject.tag).join('\n');

            newAssetFiles[EntryPoint.name] = entryPointFiles;
        });

        return {
            assets: newAssetFiles
        }
    }

    apply(compiler) {
        let self = this;

        compiler.hooks.compilation.tap(includeAssetsHtmlPluginName, function (compilation) {
            const hooks = HtmlWebpackPlugin.getHooks(compilation);

            hooks.beforeAssetTagGeneration.tapAsync(includeAssetsHtmlPluginName, function (data, cb) {
                data.plugin.options.templateParameters = function (compilation, assets, assetTags, options) {
                    return self.templateParametersGenerator(compilation, assets, assetTags, options);
                };
                return cb(null, data);
            });
        });
    }
}

module.exports = IncludeAssetsHtmlPlugin;
