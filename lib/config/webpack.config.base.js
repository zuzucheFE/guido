'use strict';

const fs = require('fs');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const md5 = require('../utils/md5');
const FriendlyErrorsWebpackPlugin = require('../utils/friendlyErrorsWebpackPlugin');
const ModuleScopePlugin = require('../utils/moduleScopePlugin');
const ModuleNotFoundPlugin = require('../utils/moduleNotFoundPlugin');
const paths = require('./paths');

let config = {
    target: ['browserslist'],

    context: paths.appPath,

	cache: {
        type: 'filesystem',
        version: md5({
            NODE_ENV: process.env.NODE_ENV || 'development',
        }),
        cacheDirectory: paths.appCache,
        store: 'pack',
        buildDependencies: {
            defaultWebpack: ['webpack/lib/'],
            config: [__filename],
            tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f =>
                fs.existsSync(f)
            ),
        },
    },

    infrastructureLogging: {
        level: 'none',
    },

    optimization: {
        minimizer: [],
    },

	output: {
		path: paths.appDist,

		chunkLoadTimeout: 30 * 1000,

		templateDir: 'pages',
		jsDir: 'js',
		cssDir: 'css',
		imageDir: 'images',
		fontDir: 'fonts',
	},

	module: {
        strictExportPresence: true,
		rules: [
			{
				oneOf: [],
			},
		],
	},
	plugins: [
        new ModuleScopePlugin(paths.appSrc, [
            paths.appPackageJson,
            require.resolve('react-refresh/runtime'),
            require.resolve(
                '@pmmmwh/react-refresh-webpack-plugin'
            ),
            require.resolve('babel-preset-zuzuche'),
            require.resolve(
                '@babel/runtime/helpers/esm/assertThisInitialized',
                { paths: [ require.resolve('babel-preset-zuzuche') ] }
            ),
            require.resolve('@babel/runtime/regenerator', {
                paths: [ require.resolve('babel-preset-zuzuche') ],
            }),
        ]),
		new WebpackBar({
			name: 'build',
			color: 'green',
		}),
		new FriendlyErrorsWebpackPlugin({
			clearConsole: false,
		}),
        new ModuleNotFoundPlugin(paths.appPath),
        new webpack.DefinePlugin({
            'process.env': Object.keys(process.env).reduce((env, key) => {
                env[key] = JSON.stringify(process.env[key]);
                return env;
            }, {}),
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new WebpackManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: paths.publicUrlOrPath,
            generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entrypoints.main.filter(
                    fileName => !fileName.endsWith('.map')
                );

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),
	],

	resolve: {
		alias: {
			root: paths.appPath,
			'handlebars/runtime': require.resolve(
				'handlebars/dist/handlebars.runtime.min'
			),
		},
		modules: [paths.ownNodeModules, paths.appNodeModules],
		extensions: paths.moduleFileExtensions.slice(),
		mainFields: ['module', 'jsnext:main', 'browser', 'main'],
	},

	resolveLoader: {
		modules: [paths.ownNodeModules, paths.appNodeModules],
	},

	// node: {
	// 	module: 'empty',
	// 	dgram: 'empty',
	// 	dns: 'mock',
	// 	fs: 'empty',
	// 	net: 'empty',
	// 	tls: 'empty',
	// 	child_process: 'empty',
	// },

	performance: false,
};

module.exports = config;
