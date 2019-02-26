'use strict';

const path = require('path');
const fs = require('fs');
const paths = require('../config/paths');
const getCacheIdentifier = require('./getCacheIdentifier');
const getENV = require('./env').getENV;

function fileExists(s) {
	return fs.existsSync(s);
}

module.exports = {
	default: function(config) {
		const projectBabelrc = path.join(config.context, '.babelrc');
		const hasProjectBabelrc =
			fileExists(projectBabelrc) || fileExists(`${projectBabelrc}.js`);

		const projectBabelConfig = path.join(config.context, 'babel.config.js');
		const hasProjectBabelConfig = fileExists(projectBabelConfig);

		return {
			babelrc: hasProjectBabelrc,
			configFile: hasProjectBabelConfig,
			compact: false,
			cacheDirectory: paths.appCache,
			cacheCompression: true,
			cacheIdentifier: getCacheIdentifier(getENV(), [
				'babel-preset-zuzuche',
			]),
			sourceMaps: false,

			inputSourceMap: false,
			highlightCode: true,

			presets: [
				!hasProjectBabelrc &&
					!hasProjectBabelConfig && [
						require.resolve('babel-preset-zuzuche'),
						{
							env: {
								targets: {
									browsers: config.browserslist,
								},
							},
						},
					],
			].filter(Boolean),
			plugins: [],
		};
	},
	dependencies: function(config) {
		const projectBabelrc = path.join(config.context, '.babelrc');
		const hasProjectBabelrc =
			fileExists(projectBabelrc) || fileExists(`${projectBabelrc}.js`);

		const projectBabelConfig = path.join(config.context, 'babel.config.js');
		const hasProjectBabelConfig = fileExists(projectBabelConfig);

		return {
			babelrc: hasProjectBabelrc,
			configFile: hasProjectBabelConfig,
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
			presets: [
				!hasProjectBabelrc &&
					!hasProjectBabelConfig && [
						require.resolve('babel-preset-zuzuche/dependencies'),
						{
							env: {
								targets: {
									browsers: config.browserslist,
								},
							},
						},
					],
			].filter(Boolean),
			plugins: [],
		};
	},
};
