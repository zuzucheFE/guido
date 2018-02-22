'use strict';

const isObject = require('./is-object');
const isUndefined = require('./is-undefined');

module.exports = function printLog(msg, options) {
    if (!isObject(options)) {
        options = {};
    }

    if (isUndefined(options.prefix)) {
        options.prefix = '[Guido] ';
    }
    console.log(`${options.prefix}${msg}`);
};
