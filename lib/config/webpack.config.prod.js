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

config.output.pathinfo = false;
config.devtool = false;

config.plugins.push(
	new HardSourceWebpackPlugin({
		cacheDirectory: path.join(
			paths.appCache,
			'hard-source',
			'[confighash]'
		),
		// Either a string of object hash function given a webpack config.
		configHash: function(webpackConfig) {
			// node-object-hash on npm can be used to build this.
			return require('node-object-hash')({ sort: false }).hash(
				webpackConfig
			);
		},
		// Clean up large, old caches automatically.
		cachePrune: {
			// Caches younger than `maxAge` are not considered for deletion. They must
			// be at least this (default: 2 days) old in milliseconds.
			maxAge: 2 * 24 * 60 * 60 * 1000,
			// All caches together must be larger than `sizeThreshold` before any
			// caches will be deleted. Together they must be at least this
			// (default: 50 MB) big in bytes.
			sizeThreshold: 50 * 1024 * 1024,
		},
		info: {
			mode: 'none',
			level: 'error',
		},
	})
);

config.mode = 'production';

module.exports = config;
