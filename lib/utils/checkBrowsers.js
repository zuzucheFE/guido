'use strict';

const fs = require('fs');
const os = require('os');

const browserslist = require('browserslist');
const chalk = require('chalk');
const pkgUp = require('pkg-up');

const isInteractive = process.stdout.isTTY;

const defaultBrowsers = {
    production: ['>0.2%', 'not dead', 'not op_mini all'],
    development: [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version',
    ],
};

function checkBrowsers(dir) {
    const current = browserslist.loadConfig({ path: dir });
    if (current !== undefined && current !== null) {
        return Promise.resolve(current);
    }

    console.log(`${chalk.yellow("发现没有指定支持的browsers设置")}\n将添加默认值到 ${chalk.bold('package.json')} 文件中`);

    return pkgUp({ cwd: dir })
        .then(function (filePath) {
            if (filePath == null) {
                return Promise.reject();
            }
            const pkg = JSON.parse(fs.readFileSync(filePath));
            pkg['browserslist'] = defaultBrowsers;

            fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + os.EOL);

            browserslist.clearCaches();
            console.log();
            console.log(
                `${chalk.green('设置browsers:')} ${chalk.cyan(
                    JSON.stringify(defaultBrowsers, null, 2)
                )}`
            );
            console.log();
        })
        .catch(() => {});
}

module.exports = checkBrowsers;

