'use strict';

const webpack = require('webpack');
const TypeOf = require('../utils/typeof');

module.exports = function createWebpackCompiler(config) {
	return new Promise((resolve, reject) => {
		if (!TypeOf.isObject(config)) {
			reject(new Error('webpack配置不能为空'));
		}

		let compiler;
		try {
			compiler = webpack(config);
			resolve(compiler);
		} catch (err) {
			reject(err);
		}
	});
};
