'use strict';

const ignoredFiles = require('./ignoredFiles');

module.exports = function(config = {}) {
	return {
		watchOptions: {
			ignored: ignoredFiles(config.context),
		},
		host: process.env.HOST || '0.0.0.0',
		port: parseInt(process.env.PORT, 10) || 3000,
		disableHostCheck: true,

		quiet: true,
		clientLogLevel: 'none',
		watchContentBase: true,
		overlay: true,
		hot: true,
		contentBase: config.output.path,
		publicPath: config.output.publicPath || '',

        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
        },
        compress: true,
        client: {
            webSocketURL: {
                // Enable custom sockjs pathname for websocket connection to hot reloading server.
                // Enable custom sockjs hostname, pathname and port for websocket connection
                // to hot reloading server.
                // hostname: sockHost,
                // pathname: sockPath,
                // port: sockPort,
            },
            overlay: {
                errors: true,
                warnings: false,
            },
        },
	};
};
