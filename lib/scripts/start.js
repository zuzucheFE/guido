'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const print = require('../utils/print');
const clearConsole = require('../utils/clearConsole');

let config = require('../config/webpack.config.dev');

function handleCompile() {

}

// 创建 webpack 编译器
let compiler;
try {
    compiler = webpack(config, handleCompile);
} catch (err) {
    print(chalk.red('创建 webpack 编译器失败。'));
    print();
    print(err.message || err);
    print();
    process.exit(1);
}

const devServer = new WebpackDevServer(compiler, config.devServer);
devServer.listen(config.devServer.port, config.devServer.host, err => {
    if (err) {
        return print(err);
    }

    clearConsole();

    print(chalk.cyan('正在启动开发服务器...'));
});
