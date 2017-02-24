"use strict";

module.exports = function (options, webpackConfig) {
    options || (options = {});

    return {
        outputStyle: 'compressed',
        precision: 10,
        indentType: 'space',
        indentWidth: 2
    }
};
