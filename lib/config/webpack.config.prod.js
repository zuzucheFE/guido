'use strict';

const path = require('path');
const isUndefined = require('../utils/typeof').isUndefined;

let config = require('./webpack.config.base');

if (isUndefined(config.output.filename)) {
    config.output.filename = '[name]-[chunkhash:8].js';
}
if (isUndefined(config.output.chunkFilename)) {
    config.output.chunkFilename = '[name]-chunk-[chunkhash:8].js';
}

config.output.filename = path.join(config.output.jsDir, config.output.filename);
config.output.chunkFilename = path.join(config.output.jsDir, config.output.chunkFilename);

config.mode = 'production';

module.exports = config;
