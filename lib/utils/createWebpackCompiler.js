'use strict';

const webpack = require('webpack');
const TypeOf = require('../utils/typeof');

module.exports = function (config) {
    return new Promise((resolve, reject) => {
        TypeOf.isObject(config) ? resolve(webpack(config)) : reject(new Error('webpack配置不能为空'));
    });
};
