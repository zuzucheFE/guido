'use strict';

const path = require('path');
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

function escape(str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
}

module.exports = function ignoredFiles(dirPath) {
	return new RegExp(
		`^(?!${escape(
			path.normalize(dirPath + '/').replace(/[\\]+/g, '/')
		)}).+/node_modules/`,
		'g'
	);
};
