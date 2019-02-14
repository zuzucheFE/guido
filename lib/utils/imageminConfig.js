'use strict';

const extend = require('extend');

const TypeOf = require('./typeof');

const DEFAULT_CONFIG = {
	mozjpeg: {
		quality: 75,
	},
	pngquant: {
		quality: '65-90',
		speed: 4,
	},
	svgo: {
		plugins: [
			{
				removeViewBox: false,
			},
			{
				removeEmptyAttrs: false,
			},
		],
	},
};

module.exports = function imageminConfig(imageMinConfig) {
	return TypeOf.isObject(imageMinConfig)
		? extend(true, {}, DEFAULT_CONFIG, imageMinConfig)
		: extend(true, {}, DEFAULT_CONFIG);
};
