"use strict";

module.exports = function (options) {
    return {
        outputStyle: options.env === 'development' ? 'expanded' : 'compressed',
        precision: 10,
        indentType: 'space',
        indentWidth: 2,
        sourceMap: false
    }
};
