'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const postcssSprites = require('postcss-sprites');


const env = require('../utils/env');
const isInlineResourceQuery = require('../utils/isInlineResourceQuery');
const appendModuleRule = require('../utils/appendModuleRule');
const sprites = require('../fixtures/postcss/sprites');
const discernFontSVG = require('../fixtures/postcss/discernFontSVG');

function isCSSFile(filePath) {
    return /\.css$/i.test(filePath) && !/\.module\.css$/i.test(filePath);
}

function isSCSSFile(filePath) {
    return /\.(scss|sass)$/i.test(filePath) && !/\.module\.(scss|sass)$/i.test(filePath);
}

function isCSSModulesFile(filePath) {
    return /\.modules\.css$/i.test(filePath);
}

function isSCSSModulesFile(filePath) {
    return /\.modules\.(scss|sass)$/i.test(filePath);
}

module.exports = function (config) {
    const RE_SPRITES_PATH = new RegExp([
        config.output.imageDir.replace(/\//, '\\/'), '\\/(.*?)\\/.*'
    ].join(''), 'i');

    const isProd = env.isProd();

    // Module loader Config注入
    // ====================
    // style-loader的通用配置
    let styleLoaderOptions = {
        hmr: false
    };

    // css-loader的通用配置
    let cssLoaderOptionsForGeneral = {
        minimize: isProd,
        sourceMap: false
    };
    let cssLoaderOptionsForGeneralSCSS = cssLoaderOptionsForGeneral;

    // css-loader的module css配置
    let cssLoaderOptionsForModule = {
        minimize: isProd,
        modules: true, importLoaders: 1,
        localIdentName: '[local]--[hash:base64:5]',
        sourceMap: false,

        // cssnano配置
        autoprefixer: false
    };
    let cssLoaderOptionsForModuleSCSS = cssLoaderOptionsForModule;

    // scss-loader的通用配置
    let SCSSOptions = {
        outputStyle: isProd ? 'compressed' : 'expanded',
        precision: 10,
        indentType: 'space',
        indentWidth: 2,
        sourceMap: false
    };

    let plugins = [
        autoprefixer({
            browsers: config.browserslist.slice(0)
        }),
        postcssSprites({
            verbose: false,
            retina: true, // 支持retina
            spritesmith: {},
            filterBy: sprites.spritesFilterBy,
            groupBy: function (image) {
                return sprites.spritesGroupBy(RE_SPRITES_PATH, image);
            },
            hooks: {
                // 更新生成后的规则，这里主要是改变了生成后的url访问路径
                onUpdateRule: sprites.spritesOnUpdateRule,
                onSaveSpritesheet: sprites.spritesOnSaveSpritesheet
            }
        }),
        discernFontSVG()
    ];

    let postCSSOptions = {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: function () {
            return plugins;
        }
    };

    config = appendModuleRule(config, [{
        test: isCSSModulesFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: require.resolve('style-loader'),
            options: styleLoaderOptions
        }, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForModule
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }]
    }, {
        test: isSCSSModulesFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: require.resolve('style-loader'),
            options: styleLoaderOptions
        }, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForModuleSCSS
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }, {
            loader: require.resolve('sass-loader'),
            options: SCSSOptions
        }]
    }, {
        test: isCSSFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: require.resolve('style-loader'),
            options: styleLoaderOptions
        }, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForGeneral
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }]
    }, {
        test: isSCSSFile,
        resourceQuery: isInlineResourceQuery,
        use: [{
            loader: require.resolve('style-loader'),
            options: styleLoaderOptions
        }, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForGeneralSCSS
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }, {
            loader: require.resolve('sass-loader'),
            options: SCSSOptions
        }]
    }, {
        test: isCSSModulesFile,
        use: [MiniCssExtractPlugin.loader, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForModule
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }]
    }, {
        test: isSCSSModulesFile,
        use: [MiniCssExtractPlugin.loader, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForModuleSCSS
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }, {
            loader: require.resolve('sass-loader'),
            options: SCSSOptions
        }]
    }, {
        test: isCSSFile,
        use: [MiniCssExtractPlugin.loader, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForGeneral
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }]
    }, {
        test: isSCSSFile,
        use: [MiniCssExtractPlugin.loader, {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptionsForGeneralSCSS
        }, {
            loader: require.resolve('postcss-loader'),
            options: postCSSOptions
        }, {
            loader: require.resolve('sass-loader'),
            options: SCSSOptions
        }]
    }]);

    config.plugins.push(new MiniCssExtractPlugin({
        filename: isProd ? '[name]-[contenthash:8].css' : '[name].css',
        chunkFilename: isProd ? '[name]-chunk-[contenthash:8].css' : '[name]-chunk.css'
    }));

    return config;
};
