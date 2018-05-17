'use strict';

let config = require('./webpack.config.base');
config.output.filename = '[name].js';
config.output.chunkFilename = '[name]-chunk.js';

config.mode = 'development';
config.devtool = false;

module.exports = config;
