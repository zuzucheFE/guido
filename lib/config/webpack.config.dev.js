'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const paths = require('./paths');
const WatchMissingNodeModulesPlugin = require('../utils/watchMissingNodeModulesPlugin');
const Typeof = require('../utils/typeof');

let config = require('./webpack.config.base');

if (Typeof.isUndefined(config.output.filename)) {
	config.output.filename = '[name].js';
}
if (Typeof.isUndefined(config.output.chunkFilename)) {
	config.output.chunkFilename = '[name]-chunk.js';
}

config.mode = 'development';
config.output.pathinfo = true;
config.devtool = 'cheap-module-eval-source-map';

config.plugins.unshift(new CaseSensitivePathsPlugin());

// 这个插件能实现`npm install`补充依赖包后，不需重新启动服务
config.plugins.push(new WatchMissingNodeModulesPlugin(paths.appNodeModules));

module.exports = config;
