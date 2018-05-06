'use strict';

process.env.NODE_ENV = process.env.BABEL_ENV = 'development';

const fs = require('fs');

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const paths = require('../config/paths');
const print = require('../utils/print');
const isFunction = require('../utils/typeof').isFunction;
const isObject = require('../utils/typeof').isObject;
const clearConsole = require('../utils/clearConsole');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');

let config = require('../config/webpack.config.dev');
config.devtool = 'cheap-module-eval-source-map';

let createDevServerConfig = require('../config/webpackDevServer.config');
let devServerConfig = createDevServerConfig({}, config);

let appWebpackConfig = null;
if (fs.existsSync(paths.appWebpackConfig)) {
    appWebpackConfig = require(paths.appWebpackConfig);

    if (isFunction(appWebpackConfig)) {
        config = appWebpackConfig(config);
    } else if (isObject(appWebpackConfig)) {
        config = mergeWebpackConfig(config, appWebpackConfig);
    } else {
        print(chalk.red('webpack.config.js返回的类型错误，只能是函数或者webpack配置对象'));
    }
}

// 移除配置，转移到WebpackDevServer第二个参数传递
config.devServer = {};

// 创建 webpack 编译器
let compiler;

function handleCompile() {

}

try {
    compiler = webpack(config, handleCompile);
} catch (err) {
    print(chalk.red('创建 webpack 编译器失败。'));
    print();
    print(err.message || err);
    print();
    process.exit(1);
}

const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(devServerConfig.port, devServerConfig.host, err => {
    if (err) {
        return print(err);
    }

    clearConsole();

    print(chalk.cyan('正在启动开发服务器...'));
});
