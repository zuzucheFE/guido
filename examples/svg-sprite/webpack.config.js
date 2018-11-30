'use strict';

module.exports = {
	mode: 'development',

	entry: {
		index: './src/js/index.js',
		'app-index': './src/js/app-index.js',
	},

	output: {
		publicPath: '../',
		filename: 'js/[name].js',
		chunkFilename: 'js/[name]-chunk.js',
	},
	externals: {
		react: 'window.React',
		'react-dom': 'window.ReactDOM',
	},
};
