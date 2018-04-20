'use strict';

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

function resolveOwn(relativePath) {
    return path.resolve(__dirname, '..', relativePath);
}
function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

module.exports = {
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),

    appPath: resolveApp('.'),
    appNodeModules: resolveApp('node_modules'),
    appPackageJson: resolveApp('package.json'),
    appWebpackConfig: resolveApp('webpack.config.js'),
    appEntry: resolveApp('src'),
    appDist: resolveApp('dist'),
    appDistScript: resolveApp('dist/js'),
    appDistStyle: resolveApp('dist/css'),
    appDistImage: resolveApp('dist/images'),
    appDistHtml: resolveApp('dist/html'),
    appDistFont: resolveApp('dist/font'),

    appCache: resolveApp('.cache')
};
