'use strict';

module.exports = {
	mode: 'development',

	entry: {
		index: './src/js/index.js',
	},

	externals: [
		{
			'handlebars/runtime': {
				root: 'window.handlebars',
				var: 'window.handlebars',
				commonjs2: 'handlebars',
				commonjs: 'handlebars',
				amd: 'handlebars',
				umd: 'handlebars',
			},
		},
	],
};
