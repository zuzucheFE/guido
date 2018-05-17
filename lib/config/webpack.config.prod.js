'use strict';

let config = require('./webpack.config.base');
config.output.filename = '[name]-[chunkhash:8].js';
config.output.chunkFilename = '[name]-chunk-[chunkhash:8].js';

config.mode = 'production';

module.exports = config;
