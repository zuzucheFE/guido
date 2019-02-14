'use strict';

const TypeOf = require('./typeof');
const clearConsole = require('./clearConsole');

module.exports = function print(msg, options = {}) {
	if (!TypeOf.isObject(options)) {
		options = {};
	}

	if (options.clear) {
		clearConsole();
	}

	console.log(`${options.prefix || ''}${msg}`);
};
