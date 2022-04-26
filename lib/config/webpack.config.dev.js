'use strict';

const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const is = require('@sindresorhus/is');


let config = require('./webpack.config.base');

if (is.undefined(config.output.filename)) {
	config.output.filename = '[name].js';
}
if (is.undefined(config.output.chunkFilename)) {
	config.output.chunkFilename = '[name].chunk.js';
}
if (is.undefined(config.output.assetModuleFilename)) {
	config.output.chunkFilename = '[name].[ext]';
}

config.mode = 'development';
config.bail = false;
config.output.pathinfo = true;
config.output.devtoolModuleFilenameTemplate = function (info) {
    return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
};
config.optimization.minimize = false;
config.devtool = 'cheap-module-source-map';
// config.devtool = 'cheap-module-eval-source-map';

config.plugins.push(new CaseSensitivePathsPlugin());

module.exports = config;
