'use strict';

const config = require('./webpack.config.base');
config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-chunk-[chunkhash].js';

config.mode = 'production';

module.exports = config;
