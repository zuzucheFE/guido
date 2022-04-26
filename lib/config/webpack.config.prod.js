'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const is = require('@sindresorhus/is');

const paths = require('./paths');

let config = require('./webpack.config.base');

if (is.undefined(config.output.filename)) {
	config.output.filename = '[name].[contenthash:8].js';
}
if (is.undefined(config.output.chunkFilename)) {
	config.output.chunkFilename = '[name].[contenthash:8].chunk.js';
}
if (is.undefined(config.output.assetModuleFilename)) {
    config.output.assetModuleFilename = '[name].[hash][ext]';
}

config.output.pathinfo = false;
config.output.devtoolModuleFilenameTemplate = function (info) {
    return path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/');
};

config.plugins.push(
	new webpack.HashedModuleIdsPlugin({
		hashFunction: 'md5',
		hashDigest: 'hex',
		hashDigestLength: 5,
	}),
);

if (fs.existsSync(paths.swSrc)) {
    config.plugins.push(
        new WorkboxWebpackPlugin.InjectManifest({
            swSrc: paths.swSrc,
            dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
            exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
            // Bump up the default maximum size (2mb) that's precached,
            // to make lazy-loading failure scenarios less likely.
            // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        })
    );
}

config.mode = 'production';
config.bail = true;
config.optimization.minimize = true;
config.devtool = 'source-map';

module.exports = config;
