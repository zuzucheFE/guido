'use strict';

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

class myFriendlyErrorsWebpackPlugin extends FriendlyErrorsWebpackPlugin {
	// success信息由webpackbar提供
	displaySuccess() {}
}

module.exports = myFriendlyErrorsWebpackPlugin;
