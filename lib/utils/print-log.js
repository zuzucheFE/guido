'use strict';

const isObject = require('./is-object');

module.exports = function printLog(msg, options) {
    if (!isObject(options)) {
        options = {};
    }

    options.prefix || (options.prefix = '[Guido] ');
    console.log(`${options.prefix}${msg}`);
};
