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

const moduleFileExtensions = [
    '.web.mjs',
    '.mjs',
    '.web.js',
    '.js',
    '.web.ts',
    '.ts',
    '.web.tsx',
    '.tsx',
    '.json',
    '.web.jsx',
    '.jsx',
];

// Resolve file paths in the same order as webpack
function resolveModule(resolveFn, filePath) {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}${extension}`))
    );

    if (extension) {
        return resolveFn(`${filePath}${extension}`);
    }

    return resolveFn(`${filePath}.js`);
}

module.exports = {
	ownPath: resolveOwn('.'),
	ownNodeModules: 'node_modules',

	appPath: resolveApp('.'),
	appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    appJsConfig: resolveApp('jsconfig.json'),

	appNodeModules: resolveApp('node_modules'),
	appPackageJson: resolveApp('package.json'),
	appWebpackConfig: resolveApp('webpack.config.js'),
	appDist: resolveApp('dist'),
    swSrc: resolveModule(resolveApp, 'src/service-worker'),

	appCache: resolveApp('.guido/cache'),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
