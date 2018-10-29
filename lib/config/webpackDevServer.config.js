'use strict';

const paths = require('./paths');
const ignoredFiles = require('../utils/ignoredFiles');

module.exports = function (config = {}) {
    return {
        watchOptions: {
            ignored: ignoredFiles(paths.appSrc),
        },
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || '3000',
        disableHostCheck: true,
        compress: true,
        clientLogLevel: 'none',
        watchContentBase: true,
        overlay: true,
        hot: true,
        contentBase: config.output.path,
        publicPath: config.output.publicPath || ''
    };
};
