'use strict';

const Typeof = require('../utils/typeof');

let config = require('./webpack.config.base');

if (Typeof.isUndefined(config.output.filename)) {
	config.output.filename = '[name].js';
}
if (Typeof.isUndefined(config.output.chunkFilename)) {
	config.output.chunkFilename = '[name].chunk.js';
}

config.mode = 'development';
config.output.pathinfo = true;
config.devtool = false;

module.exports = config;
