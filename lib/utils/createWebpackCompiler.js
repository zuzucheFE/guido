'use strict';

const webpack = require('webpack');
const is = require('@sindresorhus/is');
const print = require('./print');

module.exports = function createWebpackCompiler(config) {
	return new Promise((resolve, reject) => {
		if (!is.object(config)) {
			reject(new Error('webpack配置不能为空'));
		}

        let compiler;
		try {
            compiler = webpack(config);
            compiler.hooks.invalid.tap('invalid', () => {
                print(`${title}`, { clear: true });
            });

            compiler.hooks.done.tap('done', async stats => {
                const statsData = stats.toJson({
                    all: false,
                    warnings: true,
                    errors: true,
                });
            });

			resolve(compiler);
		} catch (err) {
			reject(err);
		}
	});
};
