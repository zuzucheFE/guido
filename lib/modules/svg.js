/**
 * loader配置 - svg文件处理
 *
 * 支持inline|url|sprite模式
 */

'use strict';

const path = require('path');
const extend = require('extend');

const env = require('../utils/env');
const TypeOf = require('../utils/typeof');
const appendModuleRule = require('../utils/appendModuleRule');
const isInlineResourceQuery = require('../utils/isInlineResourceQuery');
const isUrlResourceQuery = require('../utils/isUrlResourceQuery');
const babelConfig = require('../utils/babelConfig');
const getImageMinConfig = require('../utils/imageminConfig');
const SVG_SPRITE_RUNTIME_GENERATOR_PATH = require.resolve(
	path.join(__dirname, '../utils/svgSpriteRuntimeGenerator.js')
);
const SVG_SPRITE_RUNTIME_GENERATOR_PATH_NOT_REACT = require.resolve(
	path.join(__dirname, '../utils/svgSpriteRuntimeGeneratorNotReact.js')
);

const regSVGFile = /\.svg$/i;
const REG_SPRITE_SVG = /__sprite$/;
const REG_SPRITE_SVG_NOT_REACT = /__sprite&notrc$/;

const DEFAULT_SVG_SPRITE_OPTIONS = {
	esModule: true,
	svgo: {
		plugins: [
			{
				removeTitle: true,
			},
			{
				removeAttrs: {
					attrs: ['path:fill'],
				},
			},
			{ convertPathData: false },
		],
	},
};

module.exports = function(config) {
	const isProd = env.isProd();

	const OUTPUT_SVG_NAME =
		config.output.imageDir +
		'/[name]' +
		(isProd ? '.[hash:8]' : '') +
		'.[ext]';

	let imageWebpackLoaderOptions;
	let loaderSliceMax = isProd ? 2 : 1;
	if (config.imagemin === false) {
		loaderSliceMax = 1;
	} else {
		imageWebpackLoaderOptions = getImageMinConfig(config.imagemin);
	}

	const SVG_SPRITE_OPTIONS = TypeOf.isUndefined(config.svgSprite)
		? {}
		: config.svgSprite;

	let svgSpriteOptions;
	if (TypeOf.isObject(config.svgSprite)) {
		svgSpriteOptions = extend(
			true,
			{},
			DEFAULT_SVG_SPRITE_OPTIONS,
			SVG_SPRITE_OPTIONS
		);
	} else {
		svgSpriteOptions = extend(true, {}, DEFAULT_SVG_SPRITE_OPTIONS);
	}
	let svgSpriteSvgGoOptions = svgSpriteOptions.svgo;
	delete svgSpriteOptions.svgo;

	let svgSpriteOptionsForNotReact = extend(true, {}, svgSpriteOptions, {
		runtimeGenerator: SVG_SPRITE_RUNTIME_GENERATOR_PATH_NOT_REACT,
	});
	let svgSpriteOptionsForReact = extend(true, {}, svgSpriteOptions, {
		runtimeGenerator: SVG_SPRITE_RUNTIME_GENERATOR_PATH,
	});

	config = appendModuleRule(config, [
		{
			test: regSVGFile,
			resourceQuery: REG_SPRITE_SVG_NOT_REACT, // sprite for without react
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: babelConfig.dependencies(config),
				},
				{
					loader: require.resolve('svg-sprite-loader'),
					options: svgSpriteOptionsForNotReact,
				},
				{
					loader: require.resolve('svgo-loader'),
					options: svgSpriteSvgGoOptions,
				},
			],
		},
		{
			test: regSVGFile,
			resourceQuery: REG_SPRITE_SVG, // sprite for react
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: babelConfig.dependencies(config),
				},
				{
					loader: require.resolve('svg-sprite-loader'),
					options: svgSpriteOptionsForReact,
				},
				{
					loader: require.resolve('svgo-loader'),
					options: svgSpriteSvgGoOptions,
				},
			],
		},
		{
			test: regSVGFile,
			resourceQuery: isInlineResourceQuery, // SVG 内联模式
			use: [
				{
					loader: require.resolve('svg-url-loader'),
					options: {
						limit: 0,
						noquotes: true,
						encoding: 'base64',
					},
				},
			],
		},
		{
			test: regSVGFile,
			resourceQuery: isUrlResourceQuery,
			use: [
				{
					loader: require.resolve('file-loader'),
					options: {
						name: OUTPUT_SVG_NAME,
					},
				},
				{
					loader: require.resolve('image-webpack-loader'),
					options: imageWebpackLoaderOptions,
				},
			].slice(0, loaderSliceMax),
		},
		{
			test: regSVGFile,
			resourceQuery: function(queryStr) {
				return queryStr.indexOf('__font') > -1;
			},
			use: [
				{
					loader: require.resolve('file-loader'),
					options: {
						name:
							config.output.fontDir +
							'/[name]' +
							(isProd ? '.[hash:8]' : '') +
							'.[ext]',
					},
				},
			],
		},
		{
			test: regSVGFile,
			use: [
				{
					loader: require.resolve('file-loader'),
					options: {
						name: OUTPUT_SVG_NAME,
					},
				},
				{
					loader: require.resolve('image-webpack-loader'),
					options: imageWebpackLoaderOptions,
				},
			].slice(0, loaderSliceMax),
		},
	]);

	return config;
};
