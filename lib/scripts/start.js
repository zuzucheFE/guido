'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const clearConsole = require('../utils/clearConsole');

// 创建 webpack 编译器
let compiler;
try {
    compiler = webpack(config, handleCompile);
} catch (err) {
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
}

const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(port, HOST, err => {
    if (err) {
        return console.log(err);
    }

    clearConsole();

    console.log(chalk.cyan('Starting the development server...\n'));
});
