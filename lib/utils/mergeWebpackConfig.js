'use strict';

const { merge } = require('webpack-merge');

module.exports = function mergeWebpackConfig(targetConfig, newConfig) {
    return merge(targetConfig, newConfig);
};
