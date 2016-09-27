/**
 * 处理js
 */
"use strict";

const fs = require('fs');
const path = require('path');
const merge = require('merge');

const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const webpackConfig = require('../webpack.config.js');

const util = require('./util');

let projectConfigCache = {};
/*
function MyHtmlWebpackPlugin(options) {}
MyHtmlWebpackPlugin.prototype.apply = function(compiler) {
    var self = this;
    compiler.plugin('compilation', function(compilation) {
        // console.log('The compiler is starting a new compilation...');

        /!*compilation.plugin('html-webpack-plugin-alter-chunks', function(chunks, htmlPluginData) { // 1
            var args = arguments;
            console.log('html-webpack-plugin-alter-chunks');
            return chunks;
        });

        compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) { // 2
            var args = arguments;
            console.log('html-webpack-plugin-before-html-generation');
            callback(null);
        });
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) { // 3
            var args = arguments;
            console.log('html-webpack-plugin-before-html-processing');
            callback(null);
        });
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) { // 4
            var args = arguments;
            console.log('html-webpack-plugin-alter-asset-tags');
            callback(null);
        });
        compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) { // 5
            var args = arguments;
            console.log('html-webpack-plugin-after-html-processing');
            callback(null);
        });
        compilation.plugin('html-webpack-plugin-after-emit', function(htmlPluginData, callback) { // 6
            var args = arguments;
            console.log('html-webpack-plugin-after-emit');
            callback(null);
        });*!/

        compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
            if (/http-equiv="X-UA-Compatible"/.test(htmlPluginData.html) === false) {
                htmlPluginData.html = htmlPluginData.html.replace('<title>', '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n<title>');
            }
            if (/name="renderer"/.test(htmlPluginData.html) === false) {
                htmlPluginData.html = htmlPluginData.html.replace('<title>', '    <meta name="renderer" content="webkit">\n<title>');
            }
            if (/rel="dns-prefetch"/.test(htmlPluginData.html) === false) {
                htmlPluginData.html = htmlPluginData.html.replace('<title>', '    <link rel="dns-prefetch" href="//global.zuzuche.com/">\n' +
                    '    <link rel="dns-prefetch" href="//imgcdn1.zuzuche.com/">\n' +
                    '    <link rel="dns-prefetch" href="//qiniucdn.com/">\n' +
                    '    <title>');
            }
            htmlPluginData.html = htmlPluginData.html.replace('<body>', '<!--[if lt IE 7]><body class="ie6"><![endif]-->\n' +
                '<!--[if IE 7]><body class="ie7"><![endif]-->\n' +
                '<!--[if IE 8]><body class="ie8"><![endif]-->\n' +
                '<!--[if IE 9]><body class="ie9"><![endif]-->\n' +
                '<!--[if !IE]><!--><body><!--<![endif]-->' +
                '');

            var res = self.findResource(htmlPluginData.html);
            if (res) {

            }
            callback(null, htmlPluginData);
        });
    });
};
MyHtmlWebpackPlugin.prototype.findResource = function(htmlContent) {
    var matchScriptArr = htmlContent.match(/(<script.*src=[\"|\'].*[\"|\'].*?><\/script>)/ig);
    if (matchScriptArr.length) {
        matchScriptArr.forEach(function(item) {

        });
    }
};
MyHtmlWebpackPlugin.prototype.inlineResource = function() {};

function environmentDevBuild(options, callback) {

}

function environmentProductionBuild(options, callback) {
    var projectConfig = JSON.parse(fs.readFileSync(path.join(options.entryDir, 'package.json')));
    var projectWebpackConfig = merge.recursive(true, webpackConfig, projectConfig.webpack);

    projectWebpackConfig.output.publicPath += 'bundles/' + options.projectPath;

    projectWebpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));

    var compiler = webpack(projectWebpackConfig);

    // run webpack
    compiler.run(callback);
}*/

module.exports = function(options, callback) {
    typeof callback !== 'function' && (callback = function() {});

    let projectConfig, projectWebpackConfig;
    if (projectConfigCache.hasOwnProperty(options.projectPath)) {
        projectConfig = projectConfigCache[options.projectPath].projectConfig;
        projectWebpackConfig = projectConfigCache[options.projectPath].projectWebpackConfig;
    } else {
        projectConfig = JSON.parse(fs.readFileSync(path.join(options.entryDir, options.projectPath, 'package.json')));
        projectWebpackConfig = merge.recursive(true, webpackConfig, projectConfig.webpack);

        var commonsChunks = [];
        for (var key in projectWebpackConfig.entry) {
            if (projectWebpackConfig.entry.hasOwnProperty(key)) {
                let name = path.join(options.projectPath, 'js', key);

                projectWebpackConfig.entry[name] = projectWebpackConfig.entry[key];
                commonsChunks.push(name);
                delete projectWebpackConfig.entry[key];
            }
        }



        projectWebpackConfig.devtool = 'source-map';
        projectWebpackConfig.debug = true;
        projectWebpackConfig.context = path.join(options.entryDir, options.projectPath);
        projectWebpackConfig.output.chunkFilename = path.join(options.projectPath, projectWebpackConfig.output.chunkFilename);
        // projectWebpackConfig.output.path = path.join(projectWebpackConfig.output.path, options.projectPath);

        if (util.isDebugMode() === false) {
            
        }
        // projectWebpackConfig.output.publicPath += '__dev__/';
        // projectWebpackConfig.output.pathinfo = true;

        // if (projectWebpackConfig.commonsChunks.length > 1) {
        //     projectWebpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        //         name: path.join(options.projectPath, 'common'), chunks: commonsChunks
        //     }));
        // }

        projectWebpackConfig.module.loaders.forEach(function(item, key) {
            if (/\!autoprefixer-loader/.test(item.loader)) {
                let splitArr = projectWebpackConfig.module.loaders[key].loader.split('!');
                let newLoader = [];
                splitArr.forEach(function(val) {
                    if (val == 'autoprefixer-loader') {
                        newLoader.push(val + '?' + JSON.stringify({browsers: projectConfig.browsers || ['Chrome > 0', 'Firefox > 0', 'Safari >= 5', 'ie > 6']}));
                    } else {
                        newLoader.push(val);
                    }
                });

                projectWebpackConfig.module.loaders[key].loader = newLoader.join('!');
            }
        });

        if (util.isDebugMode() === false) {
            projectWebpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }));
        }


        projectWebpackConfig.plugins.push(new AssetsPlugin({
            fullPath: '../',
            filename: 'assets-map.' + (util.isDebugMode() ? 'develop' : 'production') + '.json',
            update: true, prettyPrint: true,
            metadata: {
                time: new Date().getTime()
            }
        }));

        // html入口
        /*var htmlFileList = [];
         var getHtmlEntryFiles = function(path) {
         var dirList = fs.readdirSync(path);
         dirList.forEach(function(item) {
         if (fs.statSync(path + '/' + item).isFile()) {
         htmlFileList.push(path + '/' + item);
         }
         });

         dirList.forEach(function(item) {
         if (fs.statSync(path + '/' + item).isDirectory()) {
         getHtmlEntryFiles(path + '/' + item);
         }
         });
         };
         getHtmlEntryFiles(path.join(options.entryDir, options.projectPath, 'html'));

         if (htmlFileList.length) {
         htmlFileList.forEach(function(item) {
         var itemInfo = path.parse(item);
         projectWebpackConfig.plugins.push(new HtmlWebpackPlugin({
         inject: false,
         filename: path.join(options.projectPath, 'html', itemInfo.name + '.html'),
         template: item/!*,
         templateContent: function() {
         var args = arguments;
         return 'a123123';
         }*!/
         }));
         });

         projectWebpackConfig.plugins.push(new MyHtmlWebpackPlugin());
         }*/


        /*projectConfigCache[options.projectPath] = {
         projectConfig: projectConfig,
         projectWebpackConfig: projectWebpackConfig
         };*/
    }

    var compiler = webpack(projectWebpackConfig);

    // run webpack
    compiler.run(callback);
};