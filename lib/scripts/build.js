'use strict';

const chalk = require('chalk');
const del = require('del');

const print = require('../utils/print');
const createWebpackConfig = require('../utils/createWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');

print(chalk.blue('载入配置...'));

let lastBuildStateHash = null;
createWebpackConfig()
    .then((config) => {
        print(chalk.blue(`创建 ${chalk.blue.bold(process.env.NODE_ENV)} 环境编译器`));
        return createWebpackCompiler(config);
    })
    .then((compiler) => {
        return new Promise((resolve, reject) => {
            del.sync(compiler.options.output.path);

            compiler.run((err, stats) => {
                if (err) {
                    return reject(err);
                }

                if (lastBuildStateHash !== stats.hash) {
                    lastBuildStateHash = stats.hash;

                    return resolve({stats: stats, statsConfig: compiler.options.stats});
                }
            });
        });
    })
    .then(({stats, statsConfig}) => {
        const messages = stats.toJson(statsConfig, true);

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


