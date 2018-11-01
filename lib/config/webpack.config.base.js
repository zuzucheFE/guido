'use strict';

const WebpackBar = require('webpackbar');
const ManifestPlugin = require('webpack-manifest-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const paths = require('./paths');

let tty = false;
if (process.stdout) {
	tty = Boolean(process.stdout.isTTY);
}

let config = {
	context: paths.appPath,

	bail: true,
	cache: true,

	output: {
		path: paths.appDist,

		chunkLoadTimeout: 30 * 1000,

		templateDir: 'html',
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
			name: '',
			color: 'green',
			minimal: !tty,
			compiledIn: false,
		}),
		new ManifestPlugin({
			fileName: 'static-manifest.json',
		}),
		new FriendlyErrorsWebpackPlugin({
			clearConsole: false,
		}),
	],
	resolve: {
		alias: {
			root: paths.appSrc,
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
		dgram: 'empty',
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
		'last 2 Firefox versions',
		'ie >= 9',
		'Edge >= 12',
		'iOS >= 9',
		'Android >= 4',
		'last 2 ChromeAndroid versions',
	],
};

config = require('../modules/script')(config);
config = require('../modules/style')(config);
config = require('../modules/images')(config);
config = require('../modules/handlebars')(config);
config = require('../modules/svg')(config);
config = require('../modules/font')(config);
config = require('../modules/html')(config);

module.exports = config;
