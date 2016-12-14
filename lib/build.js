"use strict";

const webpack = require('webpack');

let getWebpackConfig = require('./get-webpack-config');
module.exports = function (options, callback) {
    options || (options = {});

    let webpackConfig = getWebpackConfig(options);

    // Run compiler.
    const compiler = webpack(webpackConfig);

    function doneHandler(err, stats) {
        const errors = stats.toJson();

        if (errors && errors.length) {
            process.on('exit', function () {
                process.exit(1);
            });
        }

        if (callback) {
            callback(err, stats);
        }
    }

    if (options.watch) {
        compiler.watch(options.watch || 200, doneHandler);
    } else {
        compiler.run(doneHandler);
    }
};
