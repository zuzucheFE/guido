'use strict';

const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const paths = require('./paths');
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
config.output.pathinfo = false;
config.devtool = false;

config.plugins.push(
	new HardSourceWebpackPlugin({
		cacheDirectory: path.join(
			paths.appCache,
			'hard-source',
			'[confighash]'
		),
		info: {
			mode: 'none',
			level: 'error',
		},
	})
);

config.mode = 'production';

module.exports = config;
