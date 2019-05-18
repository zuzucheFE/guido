'use strict';

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

const autoprefixer = require('autoprefixer');
const postcssSprites = require('postcss-sprites');

const Typeof = require('../utils/typeof');
const env = require('../utils/env');
const isInlineResourceQuery = require('../utils/isInlineResourceQuery');
const appendModuleRule = require('../utils/appendModuleRule');
const sprites = require('../utils/postcssSprites');
const discernFontSVG = require('../utils/postcssDiscernFontSVG');

function isCSSFile(filePath) {
	return /\.css$/i.test(filePath) && !/\.module\.css$/i.test(filePath);
}

function isSCSSFile(filePath) {
	return (
		/\.(scss|sass)$/i.test(filePath) &&
		!/\.module\.(scss|sass)$/i.test(filePath)
	);
}

function isCSSModulesFile(filePath) {
	return /\.modules\.css$/i.test(filePath);
}

function isSCSSModulesFile(filePath) {
	return /\.modules\.(scss|sass)$/i.test(filePath);
}

module.exports = function(config) {
	const RE_SPRITES_PATH = new RegExp(
		[config.output.imageDir.replace(/\//, '\\/'), '\\/(.*?)\\/.*'].join(''),
		'i'
	);

	const isProd = env.isProd();

	const shouldUseSourceMap =
		!Typeof.isUndefined(config.devtool) || config.devtool !== false;

	// Module loader Config注入
	// ====================
	// style-loader的通用配置
	let styleLoaderOptions = {
		hmr: false,
	};

	// css-loader的通用配置
	let cssLoaderOptionsForGeneral = {
		sourceMap: shouldUseSourceMap,
		importLoaders: 1,
	};
	let cssLoaderOptionsForGeneralSCSS = Object.assign(
		{},
		cssLoaderOptionsForGeneral
	);
	cssLoaderOptionsForGeneralSCSS.importLoaders = 2;

	// css-loader的module css配置
	let cssLoaderOptionsForModule = {
		modules: true,
		importLoaders: 1,
		localIdentName: '[local]--[hash:base64:5]',
		sourceMap: shouldUseSourceMap,
	};
	let cssLoaderOptionsForModuleSCSS = Object.assign(
		{},
		cssLoaderOptionsForModule
	);
	cssLoaderOptionsForModuleSCSS.importLoaders = 2;

	// scss-loader的通用配置
	let SCSSOptions = {
		outputStyle: 'compressed',
		precision: 10,
		indentType: 'space',
		indentWidth: 2,
		sourceMap: shouldUseSourceMap,
	};

	let browserslist = config.browserslist.slice(0);
	let postCSSOptions = {
		// Necessary for external CSS imports to work
		// https://github.com/facebookincubator/create-react-app/issues/2677
		ident: 'postcss',
		plugins: function() {
			return [
				autoprefixer({
					browsers: browserslist,
				}),
				postcssSprites({
					verbose: false,
					retina: true, // 支持retina
					spritesmith: {},
					filterBy: sprites.spritesFilterBy,
					groupBy: function(image) {
						return sprites.spritesGroupBy(RE_SPRITES_PATH, image);
					},
					hooks: {
						// 更新生成后的规则，这里主要是改变了生成后的url访问路径
						onUpdateRule: sprites.spritesOnUpdateRule,
						onSaveSpritesheet: sprites.spritesOnSaveSpritesheet,
					},
				}),
				discernFontSVG(),
			];
		},
		sourceMap: shouldUseSourceMap,
	};

	config = appendModuleRule(config, [
		{
			test: isCSSModulesFile,
			resourceQuery: isInlineResourceQuery,
			use: [
				{
					loader: require.resolve('style-loader'),
					options: styleLoaderOptions,
				},
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForModule,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
			],
		},
		{
			test: isSCSSModulesFile,
			resourceQuery: isInlineResourceQuery,
			use: [
				{
					loader: require.resolve('style-loader'),
					options: styleLoaderOptions,
				},
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForModuleSCSS,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
				{
					loader: require.resolve('sass-loader'),
					options: SCSSOptions,
				},
			],
		},
		{
			test: isCSSFile,
			resourceQuery: isInlineResourceQuery,
			use: [
				{
					loader: require.resolve('style-loader'),
					options: styleLoaderOptions,
				},
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForGeneral,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
			],
		},
		{
			test: isSCSSFile,
			resourceQuery: isInlineResourceQuery,
			use: [
				{
					loader: require.resolve('style-loader'),
					options: styleLoaderOptions,
				},
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForGeneralSCSS,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
				{
					loader: require.resolve('sass-loader'),
					options: SCSSOptions,
				},
			],
		},
		{
			test: isCSSModulesFile,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForModule,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
			],
		},
		{
			test: isSCSSModulesFile,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForModuleSCSS,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
				{
					loader: require.resolve('sass-loader'),
					options: SCSSOptions,
				},
			],
		},
		{
			test: isCSSFile,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForGeneral,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
			],
		},
		{
			test: isSCSSFile,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: require.resolve('css-loader'),
					options: cssLoaderOptionsForGeneralSCSS,
				},
				{
					loader: require.resolve('postcss-loader'),
					options: postCSSOptions,
				},
				{
					loader: require.resolve('sass-loader'),
					options: SCSSOptions,
				},
			],
		},
	]);

	// 使用插件 optimize-css-assets-webpack-plugin原因：
	// 直接使用 minimize: true 在匹配到css后直接压缩
	// 项目是用了autoprefix自动添加前缀，这样压缩，会导致添加的前缀丢失
	config.optimization.minimizer.push(
		new OptimizeCSSAssetsPlugin({
			cssProcessorOptions: {
				parser: safePostCssParser,
				map: shouldUseSourceMap
					? {
							// `inline: false` forces the sourcemap to be output into a
							// separate file
							inline: false,
							// `annotation: true` appends the sourceMappingURL to the end of
							// the css file, helping the browser find the sourcemap
							annotation: true,
					  }
					: false,
			},
		})
	);

	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: path.join(
				config.output.cssDir,
				isProd ? '[name].[contenthash:8].css' : '[name].css'
			),
			chunkFilename: path.join(
				config.output.cssDir,
				isProd ? '[name].chunk.[contenthash:8].css' : '[name].chunk.css'
			),
		})
	);

	return config;
};
