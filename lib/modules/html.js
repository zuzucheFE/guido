/**
 * loader配置 - html模板入口
 */
'use strict';

const path = require('path');
const glob = require('glob');
const extend = require('extend');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('../config/paths');
const TypeOf = require('../utils/typeof');
const HtmlWebpackAssetsPlugin = require('../fixtures/htmlWebpackAssetsPlugin');

const REG_VIEW_HANDLEBARS_NAME_RULE = /(\.view)$/;

const DEFAULT_CONFIG = {
    pattern: '**/*.view.{handlebars,hbs}'
};


module.exports = function (config) {
    if (config.html === false) {
        return config;
    }

    let htmlConfig = TypeOf.isObject(config.html) ?
        extend(true, {}, DEFAULT_CONFIG, config.html) :
        extend(true, {}, DEFAULT_CONFIG);

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
            cache: true,
            inject: false,
            hash: false
        };

        if (TypeOf.isFunction(htmlConfig.beforeInitialization)) {
            htmlConfig.beforeInitialization(HtmlWebpackPluginConfig);
        }

        let obj = new HtmlWebpackPlugin(HtmlWebpackPluginConfig);

        if (TypeOf.isFunction(htmlConfig.afterInitialization)) {
            obj = htmlConfig.afterInitialization(obj);
        }

        config.plugins.push(obj);
    });

    config.plugins.push(new HtmlWebpackAssetsPlugin({
        assetsDir: {
            output: config.output.path,
            template: config.output.templateDir,
            image: config.output.imageDir,
            font: config.output.fontDir,
            css: config.output.cssDir,
            js: config.output.jsDir
        }
    }));

    return config;
};
