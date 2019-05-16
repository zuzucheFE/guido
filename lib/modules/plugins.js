'use strict';

const AssetsPlugin = require('assets-webpack-plugin');
const extend = require('extend');

const paths = require('../config/paths');
const TypeOf = require('../utils/typeof');

const DEFAULT_ASSETS_PATHS_OPTIONS = {
	filename: 'static-manifest.json',
	entrypoints: true,
	prettyPrint: true,
	update: true,
};

module.exports = function(config) {
	const assetsPluginOptions = TypeOf.isObject(config.assetsPaths)
		? extend(true, {}, DEFAULT_ASSETS_PATHS_OPTIONS, config.assetsPaths)
		: extend(true, {}, DEFAULT_ASSETS_PATHS_OPTIONS);

	if (TypeOf.isUndefined(assetsPluginOptions.path)) {
		assetsPluginOptions.path = paths.appDist;
	}

	config.plugins.push(new AssetsPlugin(assetsPluginOptions));

	return config;
};
