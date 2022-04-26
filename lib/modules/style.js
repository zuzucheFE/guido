'use strict';

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// const autoprefixer = require('autoprefixer');
const postcssSprites = require('postcss-sprites');

const ENV = require('../utils/env');
const Typeof = require('../utils/typeof');
const env = require('../utils/env');
const isInlineResourceQuery = require('../utils/isInlineResourceQuery');
const appendModuleRule = require('../utils/appendModuleRule');
const sprites = require('../utils/postcssSprites');
const discernFontSVG = require('../utils/postcssDiscernFontSVG');
const getCSSModuleLocalIdent = require('../utils/getCSSModuleLocalIdent');

function isCSSFile(filePath) {
    return /\.css$/i.test(filePath) && !/\.module\.css$/i.test(filePath);
}

function isSCSSFile(filePath) {
    return (
        /\.(scss|sass)$/i.test(filePath) &&
        !/\.module\.(scss|sass)$/i.test(filePath)
    );
}

function isCSSModulesFile(filePath) {
    return /\.modules\.css$/i.test(filePath);
}

function isSCSSModulesFile(filePath) {
    return /\.modules\.(scss|sass)$/i.test(filePath);
}

module.exports = function(config) {
    const RE_SPRITES_PATH = new RegExp(
        [config.output.imageDir.replace(/\//, '\\/'), '\\/(.*?)\\/.*'].join(''),
        'i'
    );

    const isProd = env.isProd();
    const isDev = env.isDev();

    const shouldUseSourceMap =
        !Typeof.isUndefined(config.devtool) && config.devtool !== false;

    // Module loader Config注入
    // ====================

    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        sourceMap: shouldUseSourceMap,
        importLoaders: 1,
        modules: {
            mode: 'icss',
        }
    };
    let cssLoaderOptionsForGeneralSCSS = Object.assign(
        {},
        cssLoaderOptionsForGeneral
    );
    cssLoaderOptionsForGeneralSCSS.importLoaders = 2;

    // css-loader的module css配置
    let cssLoaderOptionsForModule = {
        modules: {
            mode: 'local',
            getLocalIdent: getCSSModuleLocalIdent,
        },
        importLoaders: 1,
        sourceMap: isProd ? shouldUseSourceMap : isDev,
    };
    let cssLoaderOptionsForModuleSCSS = Object.assign(
        {},
        cssLoaderOptionsForModule
    );
    cssLoaderOptionsForModuleSCSS.importLoaders = 2;

    // scss-loader的通用配置
    let SCSSOptions = {
        sassOptions: {
            outputStyle: 'compressed',
            precision: 10,
            indentType: 'space',
            indentWidth: 2,
            // sourceMap: shouldUseSourceMap,
        },
        sourceMap: shouldUseSourceMap,
    };

    // let autoprefixerOptions = {};
    // if (Typeof.isArray(config.browserslist)) {
    //     autoprefixerOptions.overrideBrowserslist = config.browserslist.slice(0);
    // }
    let postCSSOptions = {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        config: false,
        plugins: [
            'postcss-flexbugs-fixes',
            [
                'postcss-preset-env',
                {
                    autoprefixer: {
                        flexbox: 'no-2009',
                    },
                    stage: 3,
                },
            ],
            [
                'postcss-sprites',
                {
                    verbose: false,
                    retina: true, // 支持retina
                    spritesmith: {},
                    filterBy: sprites.spritesFilterBy,
                    groupBy: function(image) {
                        return sprites.spritesGroupBy(RE_SPRITES_PATH, image);
                    },
                    hooks: {
                        // 更新生成后的规则，这里主要是改变了生成后的url访问路径
                        onUpdateRule: sprites.spritesOnUpdateRule,
                        onSaveSpritesheet: sprites.spritesOnSaveSpritesheet,
                    },
                }
            ],
            // autoprefixer(autoprefixerOptions),
            discernFontSVG(),
            'postcss-normalize',
        ],
        sourceMap: shouldUseSourceMap,
    };

    config = appendModuleRule(config, [
        {
            test: isCSSModulesFile,
            resourceQuery: isInlineResourceQuery,
            use: [
                {
                    loader: require.resolve('style-loader'),
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForModule,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
            ],
        },
        {
            test: isSCSSModulesFile,
            resourceQuery: isInlineResourceQuery,
            use: [
                {
                    loader: require.resolve('style-loader'),
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForModuleSCSS,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
                {
                    loader: require.resolve('sass-loader'),
                    options: SCSSOptions,
                },
            ],
        },
        {
            test: isCSSFile,
            resourceQuery: isInlineResourceQuery,
            use: [
                {
                    loader: require.resolve('style-loader'),
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForGeneral,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
            ],
            sideEffects: true,
        },
        {
            test: isSCSSFile,
            resourceQuery: isInlineResourceQuery,
            use: [
                {
                    loader: require.resolve('style-loader'),
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForGeneralSCSS,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
                {
                    loader: require.resolve('sass-loader'),
                    options: SCSSOptions,
                },
            ],
            sideEffects: true,
        },
        {
            test: isCSSModulesFile,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForModule,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
            ],
        },
        {
            test: isSCSSModulesFile,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForModuleSCSS,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
                {
                    loader: require.resolve('sass-loader'),
                    options: SCSSOptions,
                },
            ],
        },
        {
            test: isCSSFile,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForGeneral,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
            ],
            sideEffects: true,
        },
        {
            test: isSCSSFile,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: require.resolve('css-loader'),
                    options: cssLoaderOptionsForGeneralSCSS,
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCSSOptions,
                },
                {
                    loader: require.resolve('sass-loader'),
                    options: SCSSOptions,
                },
            ],
            sideEffects: true,
        },
    ]);

    if (ENV.isProd()) {
        config.optimization.minimizer.push(
            new CssMinimizerPlugin()
        );

        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: path.join(
                    config.output.cssDir,
                    '[name].[contenthash:8].css'
                ),
                chunkFilename: path.join(
                    config.output.cssDir,
                    '[name].[contenthash:8].chunk.css'
                )
            })
        );
    }

    return config;
};
