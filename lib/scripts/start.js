'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
	throw err;
});

const chalk = require('chalk');
const address = require('address');
const webpackDevServer = require('webpack-dev-server');

const print = require('../utils/print');
const createWebpackConfig = require('../utils/createWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');
const checkBrowsers = require('../utils/checkBrowsers');
const checkDetectPort = require('../utils/checkDetectPort');
const paths = require('../config/paths');

const title = chalk.bold.blue(`====== Guido Server ======`);
print(title, {
	clear: true,
});

checkBrowsers(paths.appPath)
    .then(() => {
        return createWebpackConfig();
    })
    .then(config => {
        return Promise.all([
            config,
            checkDetectPort(config.devServer.host, config.devServer.port)
        ]);
    })
    .then(config => {
        return createWebpackCompiler(config);
    })
    .then(compiler => {

    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });

// createWebpackConfig()
// 	// .then(config => {
// 	// 	return new Promise((resolve, reject) => {
// 	// 		checkDetectPort(config.devServer.host, config.devServer.port)
// 	// 			.then(() => {
// 	// 				resolve(config);
// 	// 			})
// 	// 			.catch(err => {
// 	// 				reject(err);
// 	// 			});
// 	// 	});
// 	// })
// 	.then(config => {
//         return checkDetectPort(config.devServer.host, config.devServer.port)
//             .then()
//     })
// 	.then(config => {
// 		let devServerConfig = config.devServer;
// 		config.devServer = {};
// 		webpackDevServer.addDevServerEntrypoints(config, devServerConfig);
// 		return createWebpackCompiler(config).then(compiler => {
// 			compiler.hooks.invalid.tap('invalid', () => {
// 				print(`${title}`, { clear: true });
// 			});
// 			compiler.hooks.done.tap('done', stats => {
// 				let protocol =
// 					Boolean(devServerConfig.https) === false ? 'http' : 'https';
// 				let title = chalk.bgBlue.black('', 'I', '');
// 				print(
// 					`${title}  ${chalk.bold('本地访问地址:')} ${protocol}://${
// 						devServerConfig.host
// 					}:${devServerConfig.port}/`
// 				);
// 				print(
// 					`${title}  ${chalk.bold(
// 						'外网访问地址:'
// 					)} ${protocol}://${address.ip()}:${devServerConfig.port}/`
// 				);
// 			});
// 			return Promise.resolve({ compiler, devServerConfig });
// 		});
// 	})
// 	.then(({ compiler, devServerConfig }) => {
// 		const server = new webpackDevServer(compiler, devServerConfig);
// 		server.listen(devServerConfig.port, devServerConfig.host, err => {
// 			err && console.log(err);
// 		});
//
// 		['SIGINT', 'SIGTERM'].forEach(sig => {
// 			process.on(sig, () => {
// 				server.close();
// 				process.exit();
// 			});
// 		});
// 	})
// 	.catch(err => {
// 		if (err && err.message) {
// 			console.log(err.message);
// 		}
// 		process.exit(1);
// 	});
