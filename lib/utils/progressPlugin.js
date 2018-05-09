'use strict';

const chalk = require('chalk');

let lastState;
let lastStateTime;

module.exports = function progressPlugin(percentage, msg) {
    if (percentage === 0) {
        lastState = null;
        lastStateTime = Date.now();
    }

    if (percentage < 1) {
        percentage = Math.floor(percentage * 100);
        msg = `${percentage}% ${msg}`;
    }

    chalk.magenta('优化所有资源文件...');
};
