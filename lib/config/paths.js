'use strict';

const fs = require('fs');
const path = require('path');

const cwd = process.env.GUIDO_CWD || process.cwd();
const appDirectory = fs.realpathSync(cwd);

function resolveOwn(relativePath) {
	return path.resolve(__dirname, '../..', relativePath);
}
function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath);
}

module.exports = {
	ownPath: resolveOwn('.'),
	ownNodeModules: 'node_modules',

	appPath: resolveApp('.'),
	appNodeModules: resolveApp('node_modules'),
	appPackageJson: resolveApp('package.json'),
	appWebpackConfig: resolveApp('webpack.config.js'),
	appDist: resolveApp('dist'),

	appCache: resolveApp('.cache'),
};
