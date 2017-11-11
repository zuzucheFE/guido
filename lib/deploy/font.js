/**
 * loader配置 - 字体文件处理
 *
 * svg字体在 `./svg.js` 处理，因与其他svg inline|url|sprite处理流程协调
 */
"use strict";

module.exports = function (options, webpackConfig) {
    const IS_PRODUCTION_MODE = options.env === 'production';

    webpackConfig.module.rules.push({
        test: /\.(?:ttf|eot|woff|woff2)$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: webpackConfig.output.fontDir + '/[name]' + (IS_PRODUCTION_MODE ? '-[hash]' : '') + '.[ext]'
            }
        }]
    });

    return webpackConfig;
};
