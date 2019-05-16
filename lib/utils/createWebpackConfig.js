'use strict';

const fs = require('fs');

const paths = require('../config/paths');
const TypeOf = require('../utils/typeof');
const ENV = require('../utils/env');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const filterWebpackConfig = require('../utils/filterWebpackConfig');
const createWebpackDevServerConfig = require('./createWebpackDevServerConfig');

function addModules(config) {
	config = require('../modules/script')(config);
	config = require('../modules/style')(config);
	config = require('../modules/images')(config);
	config = require('../modules/handlebars')(config);
	config = require('../modules/svg')(config);
	config = require('../modules/font')(config);
	config = require('../modules/html')(config);
	config = require('../modules/plugins')(config);

	return config;
}

module.exports = function() {
	return new Promise((resolve, reject) => {
		let config;
		if (ENV.isDev()) {
			config = require('../config/webpack.config.dev');
			config.devServer = createWebpackDevServerConfig(config);
		} else if (ENV.isTest()) {
			config = require('../config/webpack.config.test');
		} else {
			config = require('../config/webpack.config.prod');
		}

		let appWebpackConfig = null;
		if (fs.existsSync(paths.appWebpackConfig)) {
			appWebpackConfig = require(paths.appWebpackConfig);
		}

		if (TypeOf.isObject(appWebpackConfig)) {
			config = mergeWebpackConfig(config, appWebpackConfig);
			config = addModules(config);
		} else if (TypeOf.isFunction(appWebpackConfig)) {
			config = addModules(config);
			config = appWebpackConfig(config);
		}

		config = filterWebpackConfig(config);
		TypeOf.isObject(config)
			? resolve(config)
			: reject(new Error('webpack配置不能为空'));
	});
};
