'use strict';

const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const is = require('@sindresorhus/is');

const extend = require('extend');

const ENV = require('../utils/env');
const TypeOf = require('../utils/typeof');
const paths = require('../config/paths');

// const eslintFormatter = require('../utils/eslintFormatter');
const appendModuleRule = require('../utils/appendModuleRule');
const babelConfig = require('../utils/babelConfig');


module.exports = function(config) {
    // const isEnvProdProfile =
    //     env.isProd() && process.argv.includes('--profile');

	const shouldUseSourceMap =
		!TypeOf.isUndefined(config.devtool) && config.devtool !== false;

	config.output.filename = path.join(
		config.output.jsDir,
		config.output.filename
	);
	config.output.chunkFilename = path.join(
		config.output.jsDir,
		config.output.chunkFilename
	);

	// eslint
	// if (fs.existsSync(path.join(config.context, '.eslintrc'))) {
	// 	config.module.rules.unshift({
	// 		test: regScriptFile,
	// 		enforce: 'pre',
	// 		include: config.context, // 指定检查的目录
	// 		use: [
	// 			{
	// 				loader: require.resolve('eslint-loader'),
	// 				options: {
	// 					eslintPath: require.resolve('eslint'),
	// 					useEslintrc: true,
	// 					failOnWarning: false, // 报warning了就终止webpack编译
	// 					failOnError: true, // 报error了就终止webpack编译
	// 					formatter: eslintFormatter,
	// 				},
	// 			},
	// 		],
	// 	});
	// }

    if (shouldUseSourceMap) {
        config.module.rules.unshift({
            enforce: 'pre',
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            test: /\.(js|mjs|jsx|ts|tsx|css)$/,
            loader: require.resolve('source-map-loader'),
        });
    }

	config = appendModuleRule(config, [
		{
			// 处理项目内脚本
			test: /\.(js|mjs|jsx|ts|tsx)$/,
			include: paths.appSrc,
			exclude: [config.output.path],
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: babelConfig.default(config),
				},
			],
		},
		{
			// 处理项目以外的脚本
			test: /\.(js|mjs)$/,
			exclude: /@babel(?:\/|\\{1,2})runtime/,
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: babelConfig.dependencies(config),
				},
			],
		},
	]);

	if (config.optimization.minimize) {
		const DEFAULT_TERSER_OPTIONS = {
            // 解释
            parse: {
                ecma: 8,
            },

            // https://www.npmjs.com/package/uglify-js#compress-options
            // 压缩
            compress: {
                ecma: 5,
                comparisons: false,
                inline: 2,
                warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                drop_console: false, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
                drop_debugger: true, // 移除 `debugger;` 声明
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
            },

            // 混淆
            mangle: {
                safari10: true,
            },

            // keep_classnames: isEnvProdProfile,
            // keep_fnames: isEnvProdProfile,
            keep_classnames: false,
            keep_fnames: false,

            // https://www.npmjs.com/package/uglify-js#output-options
            // 输出
            output: {
                ecma: 5,
                ascii_only: true,
                beautify: false, // 最紧凑的输出
                comments: false, // 删除所有的注释
            },
        };

        // 自定义压缩配置
		const terserOptions = is.object(config.terser)
			? extend(true, {}, DEFAULT_TERSER_OPTIONS, config.terser)
			: extend(true, {}, DEFAULT_TERSER_OPTIONS);
		config.optimization.minimizer.push(
			new TerserPlugin({
				cache: path.join(paths.appCache, 'terser-webpack-plugin'),
				parallel: true,
				sourceMap: shouldUseSourceMap,
                terserOptions: terserOptions,
			})
		);
	}

    const hasJsxRuntime = (() => {
        try {
            require.resolve('react/jsx-runtime');
            return true;
        } catch (e) {
            return false;
        }
    })();

    config.plugins.push(
        new ESLintPlugin({
            // Plugin options
            extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
            formatter: require.resolve('../utils/eslintFormatter'),
            eslintPath: require.resolve('eslint'),
            failOnError: !ENV.isDev(),
            context: paths.appSrc,
            cache: true,
            cacheLocation: path.resolve(
                paths.appNodeModules,
                '.cache/.eslintcache'
            ),
            // ESLint class options
            cwd: paths.appPath,
            resolvePluginsRelativeTo: __dirname,
            // baseConfig: {
            //     extends: [require.resolve('eslint-config-react-app/base')],
            //     rules: {
            //         ...(!hasJsxRuntime && {
            //             'react/react-in-jsx-scope': 'error',
            //         }),
            //     },
            // },
        })
    );

	return config;
};
