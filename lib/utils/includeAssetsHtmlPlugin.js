/**
 * 资源注入到html
 *
 * webpack.config.js:
 * html: {
 *     injectAsset: function(assetFile) {
 *         return
 *     }
 * }
 *
 * output files:
 *  dist/
 *
 *
 * hbs tpl:
 * <html>
 *     <head>
 *         {{{assets.entryA.css.toComboTag}}}
 *     </head>
 *     <body>
 *         {{{assets.entryA.js.toComboTag}}}
 *         {{#each assets.entryA.js}}
 *         <script src="{{url}}"></script>
 *         {{/each}}
 *     </body>
 * </html>
 */

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlTags = require('html-webpack-plugin/lib/html-tags');
const TypeOf = require('./typeof');

const includeAssetsHtmlPluginName = 'IncludeAssetsHtmlPlugin';


function injectAsset(file) {
    return file;
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
        let self = this;
        let publicPath = assets.publicPath || '';
        if (publicPath !== '' && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        const xhtml = options.xhtml;
        const inject = self.options.inject;
        const crossOriginLoading = compilation.options.output.crossOriginLoading;

        let newAssetFiles = {};

        compilation.entrypoints.forEach((EntryPoint) => {
            let entryPointFiles = {js: [], css: []};

            EntryPoint.chunks.forEach((chunk) => {
                let chunkName = chunk.name;
                chunk.files.forEach((file) => {
                    let extName = path.extname(file).replace('.', '');
                    let tag = {};

                    let url = `${publicPath}${file}`;
                    let source = compilation.assets[file].source();
                    if (extName === 'js') {
                        tag = {
                            tagName: 'script',
                            voidTag: false
                        };
                        if (TypeOf.isNumber(inject) && source.length < inject) {
                            tag.innerHTML = source;
                        } else {
                            tag.attributes = {
                                src: url
                            };
                            if (crossOriginLoading !== false) {
                                tag.attributes.crossorigin = crossOriginLoading;
                            }
                        }
                    } else if (extName === 'css') {
                        if (TypeOf.isNumber(inject) && source.length < inject) {
                            tag = {
                                tagName: 'style',
                                voidTag: false,
                                innerHTML: source
                            };
                        } else {
                            tag = {
                                tagName: 'link',
                                voidTag: true,
                                attributes: {
                                    rel: 'stylesheet',
                                    href: url
                                }
                            };
                        }
                    }

                    if (tag.tagName) {
                        let file = {
                            chunkName, url, source,
                            tag: htmlTags.htmlTagObjectToString(tag, xhtml)
                        };
                        if (TypeOf.isFunction(inject)) {
                            file = inject(file);
                        }
                        entryPointFiles[extName].push(file);
                    }
                });
            });

            entryPointFiles.js.toComboTag = entryPointFiles.js.map((assetObj) => {
                return assetObj.tag;
            }).join('\n');
            entryPointFiles.css.toComboTag = entryPointFiles.css.map((assetObj) => {
                return assetObj.tag;
            }).join('\n');

            newAssetFiles[EntryPoint.name] = entryPointFiles;
        });

        return {
            assets: newAssetFiles
        }
    }

    apply(compiler) {
        let self = this;

        compiler.hooks.compilation.tap(includeAssetsHtmlPluginName, (compilation) => {
            const hooks = HtmlWebpackPlugin.getHooks(compilation);

            hooks.beforeAssetTagGeneration.tapAsync(
                includeAssetsHtmlPluginName, (data, cb) => {
                    data.plugin.options.templateParameters = (
                        compilation, assets, assetTags, options
                    ) => {
                        return self.templateParametersGenerator(
                            compilation, assets, assetTags, options
                        );
                    };
                    return cb(null, data);
                });
        });
    }
}

module.exports = IncludeAssetsHtmlPlugin;
