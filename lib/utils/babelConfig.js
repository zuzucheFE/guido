'use strict';

const paths = require('../config/paths');
const getCacheIdentifier = require('./getCacheIdentifier');
const getENV = require('./env').getENV;

module.exports = {
	default: function(config) {
		return {
            root: config.context,
			compact: false,
			cacheDirectory: paths.appCache,
			cacheCompression: true,
			cacheIdentifier: getCacheIdentifier(getENV(), [
				'babel-preset-zuzuche',
			]),
			sourceMaps: config.devtool !== false,

			inputSourceMap: config.devtool !== false,
			highlightCode: true,
		};
	},
	dependencies: function(config) {
		return {
            root: config.context,
			compact: false,
			cacheDirectory: paths.appCache,
			cacheCompression: true,
			cacheIdentifier: getCacheIdentifier(getENV(), [
				'babel-preset-zuzuche',
			]),
			sourceMaps: false,

			inputSourceMap: false,
			highlightCode: true,

			sourceType: 'unambiguous',
		};
	},
};
