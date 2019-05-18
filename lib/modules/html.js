/**
 * loader配置 - html模板入口
 */
'use strict';

const path = require('path');
const glob = require('glob');
const extend = require('extend');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const TypeOf = require('../utils/typeof');
const IncludeAssetsHtmlPlugin = require('../utils/includeAssetsHtmlPlugin');

const REG_VIEW_HANDLEBARS_NAME_RULE = /(\.view)$/;

const DEFAULT_CONFIG = {
	pattern: '**/*.view.{handlebars,hbs}',
	templateCWD: '',
};

module.exports = function(config) {
	if (config.html === false) {
		return config;
	}

	let htmlConfig = TypeOf.isObject(config.html)
		? extend(true, {}, DEFAULT_CONFIG, config.html)
		: extend(true, {}, DEFAULT_CONFIG);

	if (!htmlConfig.templateCWD) {
		htmlConfig.templateCWD = path.join(config.context, 'pages');
	}

	let htmlFiles = glob.sync(htmlConfig.pattern, {
		cwd: htmlConfig.templateCWD,
		nodir: true,
		matchBase: true,
	});

	if (!htmlFiles.length) {
		return config;
	}

	htmlFiles.forEach(function(file) {
		let info = path.parse(file);
		let filename = path.join(
			config.output.path,
			config.output.templateDir,
			info.dir,
			info.name.replace(REG_VIEW_HANDLEBARS_NAME_RULE, '') + '.html'
		);

		let HtmlWebpackPluginConfig = {
			filename: filename,
			template: path.join(htmlConfig.templateCWD, file),
			cache: true,
			inject: false,
			hash: false,
		};

		if (TypeOf.isFunction(htmlConfig.beforeInitialization)) {
			htmlConfig.beforeInitialization(HtmlWebpackPluginConfig);
		}

		let obj = new HtmlWebpackPlugin(HtmlWebpackPluginConfig);

		if (TypeOf.isFunction(htmlConfig.afterInitialization)) {
			obj = htmlConfig.afterInitialization(obj);
		}

		config.plugins.push(obj);
	});

	config.plugins.push(new IncludeAssetsHtmlPlugin({}));

	return config;
};
