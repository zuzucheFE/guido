'use strict';

const path = require('path');

module.exports = {
	mode: 'production',

	entry: {
		index: './src/js/index.js',
	},

    html: {
        templateCWD: path.join(__dirname, 'src', 'pages')
    }
};
