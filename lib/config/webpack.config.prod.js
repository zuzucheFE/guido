'use strict';

const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Typeof = require('../utils/typeof');

let config = require('./webpack.config.base');

if (Typeof.isUndefined(config.output.filename)) {
	config.output.filename = '[name]-[chunkhash:8].js';
}
if (Typeof.isUndefined(config.output.chunkFilename)) {
	config.output.chunkFilename = '[name]-chunk-[chunkhash:8].js';
}

config.output.filename = path.join(config.output.jsDir, config.output.filename);
config.output.chunkFilename = path.join(
	config.output.jsDir,
	config.output.chunkFilename
);

config.plugins.push(
	new FriendlyErrorsWebpackPlugin({
		clearConsole: false,
	})
);

config.mode = 'production';

module.exports = config;
