'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
    throw err;
});

const chalk = require('chalk');
const del = require('del');

const print = require('../utils/print');
const createWebpackConfig = require('../utils/createWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');
const formatWebpackMessages = require('../utils/formatWebpackMessages');
const printBuildError = require('../utils/printBuildError');
const getCompileTime = require('../utils/getCompileTime');

const title = chalk.bold.blue(`====== Guido Build ======`);
print(title, {
    clear: true
});

createWebpackConfig()
    .then((config) => {
        print(chalk.blue(`创建环境编译器`));
        return createWebpackCompiler(config);
    })
    .then((compiler) => {
        return new Promise((resolve, reject) => {
            del.sync(compiler.options.output.path);

            compiler.run((err, stats) => {
                let messages = '';
                if (err) {
                    if (!err.message) {
                        return reject(err);
                    }
                    messages = formatWebpackMessages({
                        errors: [err.message],
                        warnings: [],
                    });
                } else {
                    messages = formatWebpackMessages(
                        stats.toJson({ all: false, warnings: true, errors: true })
                    );
                }
                if (messages.errors.length) {
                    if (messages.errors.length > 1) {
                        messages.errors.length = 1;
                    }
                    return reject(new Error(messages.errors.join('\n\n')));
                }

                if (messages.warnings.length) {
                    return reject(new Error(messages.warnings.join('\n\n')));
                }

                const resolveArgs = {
                    stats,
                    warnings: messages.warnings,
                };
                return resolve(resolveArgs);
            });
        });
    })
    .then(({ stats, warnings }) => { // {stats, statsConfig}
        print(title, {
            clear: true
        });
        if (warnings.length) {
            print(chalk.yellow('Compiled with warnings.'));
            console.log(warnings.join('\n\n'));
        } else {
            print(chalk.green(`Compiled successfully in ${getCompileTime(stats)}ms.`));
        }
    }, (err) => {
        print(title, {
            clear: true
        });
        print(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
    })
    .catch((err) => {
        if (err && err.message) {
            print(chalk.red(err.message));
        }
        process.exit(1);
    });
