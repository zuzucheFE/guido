"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('merge');


function fileExists(path) {
    return fs.existsSync(path);
}

function getWebpackConfig(options) {
    const cwd = options.cwd ? options.cwd : process.cwd();

    // 用户package和webpack配置
    const pkgPath = path.join(cwd, 'package.json');
    const pkg = fileExists(pkgPath) ? require(pkgPath) : {};
    const webpackConfigPath = path.join(cwd, 'webpack.config.js');
    const userWebpackConfig = fileExists(webpackConfigPath) ? require(webpackConfigPath) : {};

    let webpackConfig;
    if (pkg.build && pkg.build.webpackForce === true) {
        webpackConfig = merge.recursive(true, {}, userWebpackConfig);
    } else {
        // 系统默认webpack配置
        const webpackConfigDefault = require('./webpack.config.default.js')(options);

        webpackConfig = merge.recursive(true, {}, webpackConfigDefault, userWebpackConfig);

        // 配置别名，在项目中可缩减引用路径
        webpackConfig.resolve || (webpackConfig.resolve = {});
        webpackConfig.resolve.alias || (webpackConfig.resolve.alias = {});

        if (pkg.name) {
            webpackConfig.resolve.alias[pkg.name] = cwd;
        }

        // eslint配置
        if (!webpackConfig.eslint) {
            webpackConfig.eslint = {
                configFile: path.join(__dirname, '.eslintrc')
            };
        }

        webpackConfig.plugins = webpackConfig.plugins || [];

        if (pkg.name && pkg.version) {
            webpackConfig.plugins.push(new webpack.BannerPlugin(
                pkg.name + ' v' + pkg.version
            ));
        }

        if (options.env === 'production') {
            webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
                output: {
                    ascii_only: true,
                },
                compress: {
                    warnings: false,
                }
            }));
        }
    }

    webpackConfig.output.path = path.join(cwd, 'dist/');
    webpackConfig.output.publicPath = options.env === 'production' && options.build && options.build.publicPath ? options.build.publicPath : '';

    return webpackConfig;
}

module.exports = function (options, callback) {
    options || (options = {});

    let webpackConfig = getWebpackConfig(options);

    console.log(webpackConfig);
    // Run compiler.
    const compiler = webpack(webpackConfig);

    function doneHandler(err, stats) {
        const errors = stats.toJson();

        if (errors && errors.length) {
            process.on('exit', function () {
                process.exit(1);
            });
        }

        if (callback) {
            callback(err, stats);
        }
    }

    if (options.watch) {
        compiler.watch(options.watch || 200, doneHandler);
    } else {
        compiler.run(doneHandler);
    }
};