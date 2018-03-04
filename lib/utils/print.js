'use strict';

const isObject = require('./typeof').isObject;
const isUndefined = require('./typeof').isUndefined;

module.exports = function print(msg, options) {
    if (!isObject(options)) {
        options = {};
    }

    if (isUndefined(options.prefix)) {
        options.prefix = '[Guido] ';
    }
    console.log(`${options.prefix}${msg}`);
};
