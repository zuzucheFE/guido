'use strict';

let isType = require('./is-type');
module.exports = function isArray(s) {
    return Array.isArray ? Array.isArray(s) : isType(s, 'Array');
};
