'use strict';

const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('../utils/friendlyErrorsWebpackPlugin');
const paths = require('./paths');

let config = {
	context: paths.appPath,

	bail: true,
	cache: true,

	output: {
		path: paths.appDist,

		chunkLoadTimeout: 30 * 1000,

		templateDir: 'pages',
		jsDir: 'js',
		cssDir: 'css',
		imageDir: 'images',
		fontDir: 'fonts',
	},
	module: {
		rules: [
			{
				oneOf: [],
			},
		],
	},
	plugins: [
		new WebpackBar({
			name: 'build',
			color: 'green',
		}),
		new FriendlyErrorsWebpackPlugin({
			clearConsole: false,
		}),
	],
	resolve: {
		alias: {
			root: paths.appPath,
			'handlebars/runtime': require.resolve(
				'handlebars/dist/handlebars.runtime.min'
			),
		},
		modules: [paths.ownNodeModules, paths.appNodeModules],
		extensions: ['.mjs', '.web.js', '.js', '.json', '.web.jsx', '.jsx'],
		mainFields: ['module', 'jsnext:main', 'browser', 'main'],
	},
	resolveLoader: {
		modules: [paths.ownNodeModules, paths.appNodeModules],
	},
	optimization: {
		minimizer: [],
	},

	node: {
		module: 'empty',
		dgram: 'empty',
		dns: 'mock',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},

	performance: {
		hints: false,
	},

	browserslist: [
		'Chrome >= 45',
		'iOS >= 9',
		'Android >= 4',
		'last 2 ChromeAndroid versions',
	],
};

module.exports = config;
