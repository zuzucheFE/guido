'use strict';

const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		pageA: './src/js/pageA.js',
		pageB: './src/js/pageB.js',
		pageC: './src/js/pageC.js',
		pageD: ['./src/js/pageB.js', './src/js/pageC.js'],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					chunks: 'initial',
					minChunks: 2,
					maxInitialRequests: 5, // The default limit is too small to showcase the effect
					minSize: 0, // This is example is too small to create commons chunks
				},
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
					priority: 10, // 优先级
					enforce: true,
				},
			},
		},
	},
    html: {
        templateCWD: path.join(__dirname, 'src', 'pages')
    }
};
