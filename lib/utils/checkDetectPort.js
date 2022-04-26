'use strict';

const chalk = require('chalk');
const detect = require('detect-port-alt');
const getProcessForPort = require('./getProcessForPort');

function isRoot() {
	return process.getuid && process.getuid() === 0;
}

function checkDetectPort(inputHost, inputPort) {
    return detect(inputPort, inputHost)
        .then(function(port) {
            if (port === inputPort) {
                return Promise.resolve(port);
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

                Promise.reject({
                    message: chalk.yellow(message),
                });
            }
        })
        .catch(function(err) {
            throw new Error(
                chalk.red(`无法激活 ${chalk.bold(inputHost)} 的 ${chalk.bold(inputPort)} 为可用端口.`) +
                '\n' +
                ('Network error message: ' + err.message || err) +
                '\n'
            );
        });
}

module.exports = checkDetectPort;
