'use strict';

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
	throw err;
});

const del = require('del');
const createWebpackConfig = require('../utils/createWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');

module.exports = createWebpackConfig()
	.then(config => {
		return Promise.all([
			createWebpackCompiler(config),
			del(config.output.path),
		]);
	})
	.then(([compiler]) => {
		return new Promise((resolve, reject) => {
			compiler.run((err, stats) => {
				if (err) {
					return reject(err);
				}

				stats = stats.toJson({
					errorDetails: true,
				});
				if (stats.errors.length > 0) {
					process.exit(1);
				}

				return resolve(null);
			});
		});
	})
	.then(() => {
		process.exit(0);
	})
	.catch(() => {
		process.exit(1);
	});
