'use strict';

const fs = require('fs');
const chalk = require('chalk');
const del = require('del');

const paths = require('../config/paths');
const isFunction = require('../utils/typeof').isFunction;
const isObject = require('../utils/typeof').isObject;
const print = require('../utils/print');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const filterWebpackConfig = require('../utils/filterWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');

print(chalk.blue('载入配置...'));

let appWebpackConfig = null;
if (fs.existsSync(paths.appWebpackConfig)) {
    appWebpackConfig = require(paths.appWebpackConfig);
}

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
let config = require('../config/webpack.config.prod');

if (isObject(appWebpackConfig)) {
    if (appWebpackConfig.mode === 'development') {
        config = require('../config/webpack.config.dev');
        process.env.NODE_ENV = 'development';
        process.env.BABEL_ENV = 'development';
    }

    config = mergeWebpackConfig(config, appWebpackConfig);
}

config = filterWebpackConfig(config);

print(chalk.blue(`创建 ${chalk.blue.bold(process.env.NODE_ENV)} 环境编译器`));

let lastBuildStateHash = null;
createWebpackCompiler(config)
    .then((compiler) => {
        return new Promise((resolve, reject) => {
            del.sync(config.output.path);

            compiler.run((err, stats) => {
                if (err) {
                    return reject(err);
                }

                if (lastBuildStateHash !== stats.hash) {
                    lastBuildStateHash = stats.hash;

                    return resolve(stats);
                }
            });
        });
    })
    .then((stats) => {
        const messages = stats.toJson(config.stats, true);

        if (stats.hasErrors()) {
            return Promise.reject(new Error(messages.errors.join('\n\n')));
        } else {
            if (stats.hasWarnings()) {
                print(chalk.yellow('Compiled with warnings.'));
            } else {
                print(chalk.green('Compiled successfully.'));
            }
        }
    })
    .catch((err) => {
        if (err && err.message) {
            print(chalk.red(err.message));
        }
        process.exit(1);
    });


