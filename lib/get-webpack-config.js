/**
 * 输出webpack配置
 * @param options
 * @returns {*}
 */
"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const merge = require('merge');

function fileExists(path) {
    return fs.existsSync(path);
}
function isObject(s) {
    return Object.prototype.toString.call(s) === '[object Object]';
}
function isArray(s) {
    return Array.isArray(s);
}

const generateHtmlEntry = require('./config/html');

module.exports = function (options) {
    function printLog (msg) {
        options.quiet || (console.log(msg));
    }

    // 项目webpack配置
    const webpackConfigPath = path.join(options.cwd, 'webpack.config.js');
    const userWebpackConfig = fileExists(webpackConfigPath) ? require(webpackConfigPath) : {};

    // 系统默认webpack配置
    const webpackConfigDefault = require(path.join(__dirname, 'webpack.config.default.js'))(options);

    let userWebpackConfigPlugins = [];
    if (userWebpackConfig.plugins) {
        userWebpackConfigPlugins = userWebpackConfig.plugins;
        delete userWebpackConfig.plugins;
    }

    // mixin config
    let webpackConfig = merge.recursive(true, {}, webpackConfigDefault, userWebpackConfig);

    // === 强制配置
    webpackConfig.output.crossOriginLoading = 'anonymous';
    webpackConfig.output.path = path.resolve(webpackConfig.context, webpackConfig.output.path);
    if (/\/$/.test(webpackConfig.output.path) === false) {
        webpackConfig.output.path += '/';
    }

    // === 强制配置本地服务器
    if (options.devServer && isObject(webpackConfig.devServer) === false) {
         webpackConfig.devServer = {};
    }
    // 开启了热替换，检查是否for react的
    if (webpackConfig.devServer && webpackConfig.devServer.hot) {
        let entryArr;
        if (isObject(webpackConfig.entry)) {
            entryArr = Object.keys(webpackConfig.entry).map(function(k) {
                return webpackConfig.entry[k];
            });
        } else if (isArray(webpackConfig.entry) === false) {
            entryArr = [webpackConfig.entry];
        }

        webpackConfig.devServer.hot = (entryArr.join(',') + ',').indexOf('jsx,') > -1 ? 2 : 1;
    }

    // === 插件配置
    // 插件不做merge, 否则会影响到原型链
    webpackConfig.plugins || (webpackConfig.plugins = []);
    if (isArray(userWebpackConfigPlugins) && userWebpackConfigPlugins.length) {
        webpackConfig.plugins = webpackConfig.plugins.concat(userWebpackConfigPlugins);
    }

    // === 环境输出
    switch (options.env) {
        case 'production':
            webpackConfig.devtool = 'cheap-module-source-map';
            webpackConfig.output.pathinfo = false;
            break;
        case 'development':
            webpackConfig.devtool = 'cheap-module-eval-source-map';
            webpackConfig.output.pathinfo = true;
            break;
    }

    // === 浏览器兼容
    if (!webpackConfig.browserslist) {
        webpackConfig.browserslist = [
            'Chrome >= 45', 'last 2 Firefox versions',
            'ie >= 9', 'Edge >= 12',
            'iOS >= 9', 'Android >= 4', 'last 2 ChromeAndroid versions'
        ];
    }

    if (!userWebpackConfig.override) { // 混合配置
        // === 配置别名
        // 在项目中可缩减引用路径
        webpackConfig.resolve || (webpackConfig.resolve = {});
        webpackConfig.resolve.alias || (webpackConfig.resolve.alias = {});

        // 用户package和webpack配置
        const pkgPath = path.join(options.cwd, 'package.json');
        const pkg = fileExists(pkgPath) ? require(pkgPath) : {};
        if (pkg.name) {
            webpackConfig.resolve.alias[pkg.name] = webpackConfig.context;
        }

        // === loader注入
        webpackConfig = require(path.join(__dirname, 'deploy/script'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/style'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/image'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/font'))(options, webpackConfig);
        webpackConfig = require(path.join(__dirname, 'deploy/handlebars'))(options, webpackConfig);

        // 文件头banner设置
        if (pkg.name && pkg.version) {
            webpackConfig.plugins.push(new webpack.BannerPlugin({
                banner: pkg.name + ' v' + pkg.version
            }));
        }

        // === 生成html
        let htmlEntryArr = generateHtmlEntry(options, webpackConfig);
        if (htmlEntryArr.length) {
            Array.prototype.push.apply(webpackConfig.plugins, htmlEntryArr);
        }

        if (options.quiet !== true) {
            webpackConfig.plugins.push(new webpack.ProgressPlugin(function (percentage, msg) {
                if (process.stdout) {
                    const stream = process.stdout;
                    if (stream.isTTY) {
                        stream.cursorTo(0);
                        if (percentage === 1) {
                            stream.write('[Guido] ' + chalk.green('Bundle build is now finished.') + '\n');
                        } else if (percentage < 0.71) {
                            stream.write('[Guido] ' + chalk.magenta(msg));
                        }
                        stream.clearLine(1);
                    }
                } else {
                    if (percentage === 1) {
                        printLog('\n[Guido] ' + chalk.green('Bundle build is now finished.'));
                    }
                }
            }));
        }
    }

    if (options.devServer && webpackConfig.devServer) {
        webpackConfig = require(path.join(__dirname, 'deploy/dev-server'))(options, webpackConfig);
        let devSeverClientUrl = `http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}/`;

        // 入口文件追加server配置
        Object.getOwnPropertyNames(webpackConfig.entry).map(function (name) {
            let newEntryValue = []
                .concat(webpackConfig.entry[name])
                .concat('webpack-dev-server/client/?' + devSeverClientUrl);

            if (webpackConfig.devServer.hot) {
                // 为热替换（HMR）打包好运行代码
                // only- 意味着只有成功更新运行代码才会执行热替换（HMR）
                newEntryValue.push('webpack/hot/only-dev-server');

                if (webpackConfig.devServer.hot === 2) {
                    // 开启react代码的模块热替换(HMR)
                    newEntryValue.push('react-hot-loader/patch');
                }
            }
            webpackConfig.entry[name] = newEntryValue;
        });

        if (webpackConfig.devServer.hot) {
            // 开启全局的模块热替换（HMR）
            webpackConfig.plugins.unshift(new webpack.NamedModulesPlugin());
            // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
            webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());

            // 转换布尔值
            webpackConfig.devServer.hot = !!webpackConfig.devServer.hot;
        }

        webpackConfig.output.publicPath = webpackConfig.devServer.publicPath;
    } else if (options.watch) {
        webpackConfig.watch = true;
    }

    delete webpackConfig.override;
    delete webpackConfig.output.templateDir;
    delete webpackConfig.output.jsDir;
    delete webpackConfig.output.cssDir;
    delete webpackConfig.output.imageDir;
    delete webpackConfig.output.fontDir;
    delete webpackConfig.browserslist;

    return webpackConfig;
};
