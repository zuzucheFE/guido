'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
	throw err;
});

const chalk = require('chalk');
const webpackDevServer = require('webpack-dev-server');

const print = require('../utils/print');
const createWebpackConfig = require('../utils/createWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');
const checkDetectPort = require('../utils/checkDetectPort');

const title = chalk.bold.blue(`====== Guido Server ======`);
print(title, {
	clear: true,
});

createWebpackConfig()
	.then(config => {
		return new Promise((resolve, reject) => {
			checkDetectPort(config.devServer.port, config.devServer.host)
				.then(() => {
					resolve(config);
				})
				.catch(err => {
					reject(err);
				});
		});
	})
	.then(config => {
		print(chalk.blue(`创建环境编译器`));

		let devServerConfig = config.devServer;
		config.devServer = {};
		webpackDevServer.addDevServerEntrypoints(config, devServerConfig);
		return createWebpackCompiler(config).then(compiler => {
			return Promise.resolve({ compiler, devServerConfig });
		});
	})
	.then(({ compiler, devServerConfig }) => {
		const server = new webpackDevServer(compiler, devServerConfig);
		server.listen(devServerConfig.port, devServerConfig.host, err => {
			if (err) {
				return console.log(err);
			}

			print(title, {
				clear: true,
			});
		});

		['SIGINT', 'SIGTERM'].forEach(sig => {
			process.on(sig, () => {
				server.close();
				process.exit();
			});
		});
	})
	.catch(err => {
		if (err && err.message) {
			console.log(err.message);
		}
		process.exit(1);
	});
