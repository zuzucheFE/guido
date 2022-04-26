'use strict';

const path = require('path');
const fs = require('fs');
const paths = require('../config/paths');
const getCacheIdentifier = require('./getCacheIdentifier');
const getENV = require('./env').getENV;
const Typeof = require('./typeof');

function fileExists(s) {
	return fs.existsSync(s);
}

module.exports = {
	default: function(config) {
		const projectBabelRC = path.join(config.context, '.babelrc');
		const hasProjectBabelRC =
			fileExists(projectBabelRC) || fileExists(`${projectBabelRC}.js`);

		const projectBabelConfig = path.join(config.context, 'babel.config.js');
		const hasProjectBabelConfig = fileExists(projectBabelConfig);

		return {
			babelrc: hasProjectBabelRC,
			configFile: hasProjectBabelConfig,
			compact: false,
			cacheDirectory: paths.appCache,
			cacheCompression: true,
			cacheIdentifier: getCacheIdentifier(getENV(), [
				'babel-preset-zuzuche',
				'guido',
			]),
			sourceMaps: config.devtool,

			inputSourceMap: false,
			highlightCode: true,

			presets: [
				!hasProjectBabelRC &&
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
        const shouldUseSourceMap = !Typeof.isUndefined(config.devtool) && config.devtool !== false;;

		const projectBabelRC = path.join(config.context, '.babelrc');
		const hasProjectBabelRC =
			fileExists(projectBabelRC) || fileExists(`${projectBabelRC}.js`);

		const projectBabelConfig = path.join(config.context, 'babel.config.js');
		const hasProjectBabelConfig = fileExists(projectBabelConfig);

		return {
			babelrc: hasProjectBabelRC,
			configFile: hasProjectBabelConfig,
			compact: false,
			cacheDirectory: paths.appCache,
			cacheCompression: true,
			cacheIdentifier: getCacheIdentifier(getENV(), [
				'babel-preset-zuzuche',
			]),
            sourceMaps: shouldUseSourceMap,
            inputSourceMap: shouldUseSourceMap,

			highlightCode: true,

			sourceType: 'unambiguous',
			presets: [
				!hasProjectBabelRC &&
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
