'use strict';

const path = require('path');
const extend = require('extend');

const isObject = require('../utils/typeof').isObject;
const env = require('../utils/env');
const resourceQuery = require('../utils/resource-query');
const appendModuleRule = require('../utils/appendModuleRule');

const regFile = /\.(jp?eg|png|gif)$/i;


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

module.exports = function (config) {
    const isProd = env.isProd();
    const loaderSliceMax = isProd ? 2 : 1;

    const OUTPUT_IMAGE_NAME = path.join(config.output.imageDir, '[name]' + (isProd ? '-[hash]' : '') + '.[ext]');

    let imageWebpackLoaderOptions = isObject(config.imagemin) ?
        extend(true, {}, DEFAULT_CONFIG, config.imagemin) :
        extend(true, {}, DEFAULT_CONFIG);

    config = appendModuleRule(config, [{
        // 图片 内联模式
        test: regFile,
        resourceQuery: resourceQuery.isInline,
        use: [{
            loader: require.resolve('url-loader'),
            options: {
                limit: 0, name: OUTPUT_IMAGE_NAME
            }
        }, {
            loader: require.resolve('image-webpack-loader'),
            options: imageWebpackLoaderOptions
        }].slice(0, loaderSliceMax)
    }, {
        // 图片 链接文件模式
        test: regFile,
        resourceQuery: resourceQuery.isUrl,
        use: [{
            loader: require.resolve('file-loader'),
            options: {
                name: OUTPUT_IMAGE_NAME
            }
        }, {
            loader: require.resolve('image-webpack-loader'),
            options: imageWebpackLoaderOptions
        }].slice(0, loaderSliceMax)
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
        }].slice(0, loaderSliceMax)
    }]);

    return config;
};
