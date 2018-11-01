'use strict';

const chalk = require('chalk');
const detect = require('detect-port-alt');
const getProcessForPort = require('./getProcessForPort');

function isRoot() {
	return process.getuid && process.getuid() === 0;
}

function checkDetectPort(port, host) {
	port = parseInt(port, 10) || 0;
	return new Promise((resolve, reject) => {
		detect(port, host, (err, _port) => {
			if (err) {
				reject(err);
			} else {
				if (port === _port) {
					resolve(port);
				} else {
					let message = `目前 ${chalk.bold(port)} 端口被占用`;

					if (
						process.platform !== 'win32' &&
						port < 1024 &&
						!isRoot()
					) {
						message =
							'`在1024以下的端口上运行服务器需要管理员权限`';
					}

					const existingProcess = getProcessForPort(port);
					if (existingProcess) {
						message += `，该端口使用情况:\n  ${existingProcess}`;
					}

					reject({
						message: chalk.yellow(message),
					});
				}
			}
		});
	});
}

module.exports = checkDetectPort;
