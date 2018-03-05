'use strict';

module.exports = function (options, config) {
    return {
        https: false,
        host: '0.0.0.0',
        port: '8080',
        compress: true,
        contentBase: config.output.path,

        watchOptions: {
            ignored: ''
        }
    };
};
