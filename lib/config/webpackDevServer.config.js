'use strict';

const paths = require('./paths');
const ignoredFiles = require('../utils/ignoredFiles');

module.exports = function (options, config) {
    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.HOST || '8080';

    return {
        watchOptions: {
            ignored: ignoredFiles(paths.appSrc),
        },
        host,
        port,
        compress: true,
        contentBase: config.output.path,

        before(app) {
            config.devServer.before(app);
        }
    };
};
