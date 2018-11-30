'use strict';

module.exports = {
	mode: 'production',

	entry: {
		index: './src/js/index.js',
	},
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
	},
	optimization: {
		runtimeChunk: true,
	},
};
