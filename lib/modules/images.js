'use strict';

const path = require('path');
const extend = require('extend');

const isObject = require('../utils/typeof').isObject;

let resourceQuery = require('../utils/resource-query');
const appendModuleRule = require('../utils/appendModuleRule');

const regFile = /\.(jp?eg|png|gif)$/i;

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
    mozjpeg: {
        quality: 75
    },
    pngquant: {
        quality: '65-90',
        speed: 4
    },
    svgo:{
        plugins: [{
            removeViewBox: false
        }, {
            removeEmptyAttrs: false
        }]
    }
};

module.exports = function (options, config) {
    const LOADER_SLICE_MAX = IS_PRODUCTION_MODE ? 2 : 1;

    const OUTPUT_IMAGE_NAME = path.join(config.output.imageDir, '[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]');

    let imageWebpackLoaderOptions = isObject(config.imagemin) ?
        extend(true, {}, DEFAULT_CONFIG, config.imagemin) :
        extend(true, {}, DEFAULT_CONFIG);

    config = appendModuleRule(config, [{
        // 图片 内联模式
        test: regFile,
        resourceQuery: resourceQuery.isInline,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 0, name: OUTPUT_IMAGE_NAME
            }
        }, {
            loader: 'image-webpack-loader',
            options: imageWebpackLoaderOptions
        }].slice(0, LOADER_SLICE_MAX)
    }, {
        // 图片 链接文件模式
        test: regFile,
        resourceQuery: resourceQuery.isUrl,
        use: [{
            loader: 'file-loader',
            options: {
                name: OUTPUT_IMAGE_NAME
            }
        }, {
            loader: 'image-webpack-loader',
            options: imageWebpackLoaderOptions
        }].slice(0, LOADER_SLICE_MAX)
    }, {
        // 图片 默认处理是内联模式 >8kb文件走链接
        test: regFile,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 8192, name: OUTPUT_IMAGE_NAME
            }
        }, {
            loader: 'image-webpack-loader',
            options: imageWebpackLoaderOptions
        }].slice(0, LOADER_SLICE_MAX)
    }]);

    return config;
};
