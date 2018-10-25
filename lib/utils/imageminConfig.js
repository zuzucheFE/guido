'use strict';

const extend = require('extend');

const isObject = require('./typeof').isObject;

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

module.exports = function (imageMinConfig) {
    return isObject(imageMinConfig) ?
        extend(true, {}, DEFAULT_CONFIG, imageMinConfig) :
        extend(true, {}, DEFAULT_CONFIG);
};
