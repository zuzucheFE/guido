'use strict';

const is = require('@sindresorhus/is');

module.exports = function excludeDuplicatePaths(arr) {
	if (!is.array(arr)) {
		throw new TypeError('Expected a Array');
	}

	return Array.from(new Set(arr));
};
