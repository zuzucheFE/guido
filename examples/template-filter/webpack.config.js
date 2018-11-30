'use strict';

module.exports = {
	mode: 'development',

	entry: {
		index: './src/js/index.js',
	},
	html: {
		test: function(path) {
			return /tpl(?:1|3)\.view\.handlebars/.test(path);
		},
	},
};
