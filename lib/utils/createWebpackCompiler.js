'use strict';

const webpack = require('webpack');
const isObject = require('../utils/typeof').isObject;

module.exports = function (config) {
    return new Promise((resolve, reject) => {
        isObject(config) ? resolve(webpack(config)) : reject(new Error('webpack配置不能为空'));
    });
};
