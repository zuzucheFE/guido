'use strict';

const is = require('@sindresorhus/is');

module.exports = function filterWebpackConfig(config) {
	if (is.object(config)) {
		// 移除无用的配置
		delete config.override;
		delete config.output.templateDir;
		delete config.output.jsDir;
		delete config.output.cssDir;
		delete config.output.imageDir;
		delete config.output.fontDir;
		delete config.browserslist;
		delete config.html;
		delete config.imagemin;
		delete config.handlebars;
		delete config.svgSprite;
		delete config.browserslist;
		delete config.terser;
		delete config.assetsPaths;
	}

	return config;
};
