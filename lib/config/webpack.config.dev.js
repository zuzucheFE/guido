'use strict';

const config = require('./webpack.config.base');
config.output.filename = '[name].js';
config.output.chunkFilename = '[name]-chunk.js';

config.mode = 'production';

module.exports = config;
