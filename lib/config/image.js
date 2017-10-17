"use strict";

const extend = require('extend');

function isType(s, typeString) {
    return {}.toString.call(s) === `[object ${typeString}]`;
}

function isObject(s) {
    return isType(s, 'Object');
}

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

module.exports = function (options, webpackConfig) {
    let imageMiniOptions = {};

    if (isObject(webpackConfig.imagemin)) {
        extend(true, imageMiniOptions, DEFAULT_CONFIG, webpackConfig.imagemin);
    } else {
        extend(true, imageMiniOptions, DEFAULT_CONFIG);
    }

    return imageMiniOptions
};
