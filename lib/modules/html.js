/**
 * loader配置 - html模板入口
 */
'use strict';

const path = require('path');
const url = require('url');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('../config/paths');
const isFunction = require('../utils/typeof').isFunction;
const isObject = require('../utils/typeof').isObject;

const REG_VIEW_HANDLEBARS_NAME_RULE = /(\.view)$/;

module.exports = function (config) {
    if (config.html === false) {
        return config;
    }

    let htmlConfig = isObject(config.html) ? config.html : {};

    let htmlDirCwd = path.join(config.context, 'src');
    let htmlFiles = glob.sync(htmlConfig.pattern, {
        cwd: paths.appSrc,
        nodir: true,
        matchBase: true
    });

    if (!htmlFiles.length) {
        return config;
    }

    htmlFiles.forEach(function (file) {
        let info = path.parse(file);
        let filename = path.join(
            config.output.path,
            config.output.templateDir,
            (info.name.replace(REG_VIEW_HANDLEBARS_NAME_RULE, '')) + '.html'
        );

        let HtmlWebpackPluginConfig = {
            filename: filename,
            template: path.join(htmlDirCwd, file),
            inject: false,
            hash: false,

            data: renderData,
            assetsDir: {
                output: config.output.path,
                template: config.output.templateDir,
                image: config.output.imageDir,
                font: config.output.fontDir,
                css: config.output.cssDir,
                svg: config.output.svgDir,
                js: config.output.jsDir
            }
        };

        if (isFunction(htmlConfig.beforeInitialization)) {
            htmlConfig.beforeInitialization(HtmlWebpackPluginConfig);
        }

        let obj = new HtmlWebpackPlugin(HtmlWebpackPluginConfig);

        if (isFunction(htmlConfig.afterInitialization)) {
            obj = htmlConfig.afterInitialization(obj);
        }

        config.plugins.push(obj);
    });

    return config;
};
