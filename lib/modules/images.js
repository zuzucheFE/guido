'use strict';

const path = require('path');
const env = require('../utils/env');
const resourceQuery = require('../utils/resource-query');
const appendModuleRule = require('../utils/appendModuleRule');

const getImageMinConfig = require('../utils/imageminConfig');

const regFile = /\.(jp?eg|png|gif)$/i;

module.exports = function (config) {
    const isProd = env.isProd();
    const OUTPUT_IMAGE_NAME = path.join(config.output.imageDir, '[name]' + (isProd ? '-[hash:8]' : '') + '.[ext]');

    let imageWebpackLoaderOptions;
    let loaderSliceMax = isProd ? 2 : 1;
    if (config.imagemin === false) {
        loaderSliceMax = 1;
    } else {
        imageWebpackLoaderOptions = getImageMinConfig(config.imagemin);
    }

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
        // 图片 默认处理是内联模式 >10kb文件走链接
        test: regFile,
        use: [{
            loader: require.resolve('url-loader'),
            options: {
                limit: 10000, name: OUTPUT_IMAGE_NAME
            }
        }, {
            loader: require.resolve('image-webpack-loader'),
            options: imageWebpackLoaderOptions
        }].slice(0, loaderSliceMax)
    }]);

    return config;
};
