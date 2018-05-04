'use strict';

module.exports = function (options, config) {
    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.HOST || '8080';

    return {
        host,
        port,
        compress: true,
        contentBase: config.output.path,

        watchOptions: {
            ignored: ''
        },
        before(app) {
            config.devServer.before(app);
        }
    };
};
