'use strict';

const paths = require('./paths');
const ignoredFiles = require('../utils/ignoredFiles');

module.exports = function (options, config) {
    return {
        watchOptions: {
            ignored: ignoredFiles(paths.appSrc),
        },
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || '8080',
        compress: true,
        contentBase: config.output.path,

        before(app) {
            config.devServer.before(app);
        }
    };
};
