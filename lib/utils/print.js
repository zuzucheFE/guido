'use strict';

const isObject = require('./typeof').isObject;
const clearConsole = require('./clearConsole');

module.exports = function print(msg, options = {}) {
    if (!isObject(options)) {
        options = {};
    }

    if (options.clear) {
        clearConsole();
    }

    console.log(`${(options.prefix || '')}${msg}`);
};
