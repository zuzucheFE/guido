'use strict';

const fs = require('fs');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = require('../config/paths');


const eslintFormatter = require('../utils/eslintFormatter');
const appendModuleRule = require('../utils/appendModuleRule');

module.exports = function (options, config) {
    const regScriptFile = /\.(js|jsx|mjs)$/;
    const regExclude = [/[/\\\\]node_modules[/\\\\]/];

    // eslint
    if (fs.existsSync(path.join(config.context, '.eslintrc'))) {
        config.module.rules.unshift({
            test: regScriptFile,
            enforce: 'pre',

            include: [paths.appEntry],
            exclude: regExclude,

            use: [{
                loader: require.resolve('eslint-loader'),
                options: {
                    configFile: path.join(config.context, '.eslintrc'),
                    // 报warning了就终止webpack编译
                    failOnWarning: false,
                    // 报error了就终止webpack编译
                    failOnError: true,
                    formatter: eslintFormatter
                }
            }]
        });
    }

    // babel config
    let babelRCPath = path.join(paths.appPath, '.babelrc');

    let babelConfig = {
        cacheDirectory: paths.appCache,
        inputSourceMap: false,
        highlightCode: true
    };
    if (fs.existsSync(babelRCPath)) {
        babelConfig.babelrc = true;
    } else {
        babelConfig.presets = [
            [
                require.resolve('babel-preset-zuzuche'), {
                env: {
                    'targets': {
                        'browsers': config.browserslist
                    },
                    'useBuiltIns': false,
                    'modules': false,
                    'debug': false
                },
                transformRuntime: {
                    'helpers': false,
                    'polyfill': true,
                    'regenerator': true
                }
            }]
        ];
        babelConfig.plugins = [];
    }

    config = appendModuleRule(config, [{
        // 处理项目内脚本
        test: regScriptFile,

        include: [paths.appEntry],
        exclude: regExclude,

        use: [{
            loader: require.resolve('babel-loader'),
            options: babelConfig
        }]
    }, {
        // 处理项目以外的脚本
        test: /\.js$/i,
        use: [{
            loader: require.resolve('babel-loader'),
            options: babelConfig
        }]
    }]);

    config.optimization.minimizer.push(
        new UglifyJsPlugin({
            cache: path.join(paths.appCache, 'uglifyjs-webpack-plugin'),
            parallel: true,

            uglifyOptions: {
                ecma: 8,
                safari10: true,

                // https://www.npmjs.com/package/uglify-js#output-options
                output: {
                    ascii_only: true,
                    beautify: false, // 最紧凑的输出
                    comments: false // 删除所有的注释
                },

                // https://www.npmjs.com/package/uglify-js#compress-options
                compress: {
                    warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                    drop_console: false, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
                    drop_debugger: true, // 移除 `debugger;` 声明
                    collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                    reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                }
            }
        })
    );

    return config;
};
