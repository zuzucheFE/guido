'use strict';

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Typeof = require('../utils/typeof');

module.exports = function printBuildError(err) {
	if (!Typeof.isArray(err)) {
		err = [err];
	}

	let error = new FriendlyErrorsWebpackPlugin();
	error.displayErrors(err, 'error');
};
