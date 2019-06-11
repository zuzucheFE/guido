'use strict';

const Typeof = require('../utils/typeof');

module.exports = function excludeDuplicatePaths(arr) {
	if (!Typeof.isArray(arr)) {
		throw new TypeError('Expected a Array');
	}

	return Array.from(new Set(arr));
};
