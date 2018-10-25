/**
 * 资源注入到html
 *
 * webpack.config.js:
 * html: {
 *     inject: function(data) {
 *         // data.file, data.compilation, data.tag, data.options
 *         return file.file;
 *     }
 * }
 *
 * output files:
 *  dist/
 *    css/
 *      commons~pageA~pageB~pageD-chunk-327fe913.css
 *    js/
 *      commons~pageA~pageB~pageC~pageD-chunk-2b8836d9.js
 *      commons~pageA~pageB~pageD-chunk-3e461ae1.js
 *      pageA-0476b1b3.js
 *      vendor-chunk-66e793b2.js
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
 *
 * output html:
 * <html>
 *     <head>
 *         <link rel="stylesheet" href="../css/commons~pageA~pageB~pageD-chunk-327fe913.css">
 *     </head>
 *     <body>
 *         <script src="../js/vendor-chunk-66e793b2.js"></script>
 *         <script src="../js/commons~pageA~pageB~pageC~pageD-chunk-2b8836d9.js"></script>
 *         <script src="../js/commons~pageA~pageB~pageD-chunk-3e461ae1.js"></script>
 *         <script src="../js/pageA-0476b1b3.js"></script>
 *     </body>
 * </html>
 *
 */

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlTags = require('html-webpack-plugin/lib/html-tags');
const TypeOf = require('./typeof');

const includeAssetsHtmlPluginName = 'IncludeAssetsHtmlPlugin';

class IncludeAssetsHtmlPlugin {
    constructor(options = {}) {
        const userOptions = options || {};

        const defaultOptions = {
            inject: false,
            limit: false
        };

        this.options = Object.assign(defaultOptions, userOptions);

        if (this.options.limit) {
            this.options.limit = parseInt(this.options.limit, 10);
        }
    }

    templateParametersGenerator(compilation, assets, assetTags, options) {
        let self = this;
        let publicPath = assets.publicPath || '';
        if (publicPath !== '' && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        const xhtml = options.xhtml;
        const inject = self.options.inject;
        const limit = self.options.limit;
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
                        if (!limit || source.length < limit) {
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
                        if (!limit || source.length < limit) {
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
                            file = inject({file, compilation, tag, options: self.options});
                        }
                        entryPointFiles[extName].push(file);
                    }
                });
            });

            ['js', 'css'].forEach((fileType) => {
                entryPointFiles[fileType].toComboTag = entryPointFiles[fileType].map((assetObj) => {
                    return assetObj.tag;
                }).join('\n');
            });

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
