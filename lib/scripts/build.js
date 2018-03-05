'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const webpack = require('webpack');

let config = require('../config/webpack.config.prod');
let compiler = webpack(config);

let lastBuildStateHash = null;
compiler.run(function (err, stats) {
    // wait fix bug "Multiple compilation triggered in webpack2 watch mode"
    // https://github.com/webpack/webpack.js.org/issues/1096
    // https://runkit.com/kidney/multiple-compilation-triggered-in-webpack2-watch-mode
    if (lastBuildStateHash !== stats.hash) {
        lastBuildStateHash = stats.hash;
    }
});
