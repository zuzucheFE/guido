'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
	throw err;
});

const chalk = require('chalk');
const del = require('del');

const print = require('../utils/print');
const createWebpackConfig = require('../utils/createWebpackConfig');
const createWebpackCompiler = require('../utils/createWebpackCompiler');
const FileSizeReporter = require('../utils/FileSizeReporter');
const measureFileSizesBeforeBuild =
	FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const title = chalk.bold.blue(`====== Guido Build ======`);
print(title, { clear: true });

createWebpackConfig()
	.then(config => {
		print(chalk.blue(`创建环境编译器`));

		return Promise.all([
			measureFileSizesBeforeBuild(config.output.path),
			createWebpackCompiler(config),
			del(config.output.path),
		]);
	})
	.then(([previousFileSizes, compiler]) => {
		return new Promise((resolve, reject) => {
			print(title, { clear: true });
			compiler.run((err, stats) => {
				if (err) {
					return reject(err);
				}

				let jsonStats = stats.toJson({
					all: false,
					errors: true,
				});
				if (stats.hasErrors() && jsonStats.errors.length > 0) {
					let error = new Error(jsonStats.errors[0]);
					error.errors = jsonStats.errors;
					return reject(error);
				}

				return resolve({
					stats,
					outputPath: compiler.options.output.path,
					previousFileSizes,
				});
			});
		});
	})
	.then(({ stats, outputPath, previousFileSizes }) => {
		print('File sizes after gzip:');
		const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
		const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
		printFileSizesAfterBuild(
			stats,
			previousFileSizes,
			outputPath,
			WARN_AFTER_BUNDLE_GZIP_SIZE,
			WARN_AFTER_CHUNK_GZIP_SIZE
		);
	})
	.catch(err => {
		if (err && !err.errors && err.message) {
			print(title, { clear: true });
			print(chalk.red(err.message));
			err.stack && print(chalk.red(err.stack));
		}
		process.exit(1);
	});
