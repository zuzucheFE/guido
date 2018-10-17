'use strict';

const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const paths = require('../config/paths');

const eslintFormatter = require('../utils/eslintFormatter');
const appendModuleRule = require('../utils/appendModuleRule');
const getCacheIdentifier = require('../utils/getCacheIdentifier');
const getENV = require('../utils/env').getENV;

const regScriptFile = /\.(js|mjs|jsx)$/;

module.exports = function (config) {
    // eslint
    if (fs.existsSync(path.join(config.context, '.eslintrc'))) {
        config.module.rules.unshift({
            test: regScriptFile,
            enforce: 'pre',
            include: paths.appSrc,
            use: [{
                loader: require.resolve('eslint-loader'),
                options: {
                    eslintPath: require.resolve('eslint'),
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

    config = appendModuleRule(config, [{
        // 处理项目内脚本
        test: regScriptFile,
        include: paths.appSrc,
        use: [{
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                configFile: false,
                compact: false,
                cacheDirectory: paths.appCache,
                cacheCompression: true,
                cacheIdentifier: getCacheIdentifier(getENV(), [
                    'babel-preset-zuzuche'
                ]),
                sourceMaps: false,

                inputSourceMap: false,
                highlightCode: true,

                presets: [
                    [require.resolve('babel-preset-zuzuche'), {
                        'env': {
                            targets: {
                                browsers: config.browserslist
                            }
                        }
                    }]
                ],
                plugins: []
            }
        }]
    }, {
        // 处理项目以外的脚本
        test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        use: [{
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                configFile: false,
                compact: false,
                cacheDirectory: paths.appCache,
                cacheCompression: true,
                cacheIdentifier: getCacheIdentifier(getENV(), [
                    'babel-preset-zuzuche'
                ]),
                sourceMaps: false,

                inputSourceMap: false,
                highlightCode: true,

                sourceType: 'unambiguous',
                presets: [
                    [require.resolve('babel-preset-zuzuche/dependencies'), {
                        env: {
                            targets: {
                                browsers: config.browserslist
                            }
                        }
                    }]
                ],
                plugins: []
            }
        }]
    }]);

    // 是否开启压缩
    config.optimization.minimize = config.mode === 'production';
    // 自定义压缩配置
    config.optimization.minimizer.push(
        new TerserPlugin({
            cache: path.join(paths.appCache, 'terser-webpack-plugin'),
            parallel: true,

            terserOptions: {
                // ecma: 8,
                // safari10: true,

                // 解释
                parse: {
                    ecma: 8
                },

                // https://www.npmjs.com/package/uglify-js#compress-options
                // 压缩
                compress: {
                    ecma: 5,
                    comparisons: false,
                    inline: 2,
                    warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                    drop_console: false, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
                    drop_debugger: true, // 移除 `debugger;` 声明
                    collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                    reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                },

                // 混淆
                mangle: {
                    safari10: true
                },

                // https://www.npmjs.com/package/uglify-js#output-options
                // 输出
                output: {
                    ecma: 5,
                    ascii_only: true,
                    beautify: false, // 最紧凑的输出
                    comments: false // 删除所有的注释
                }
            }
        })
    );

    return config;
};
