'use strict';

module.exports = {
	mode: 'development',

	entry: {
		index: './src/js/index.js',
	},

	optimization: {
		runtimeChunk: true,
	},
};
