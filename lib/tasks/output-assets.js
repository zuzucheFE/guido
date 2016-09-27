"use strict";

const path = require('path');
const through = require('through2');
const jsonfile = require('jsonfile');
const utils = require('./util');

// consts
//const PLUGIN_NAME = 'gulp-output-assets';


var outputAssets = function(options) {
    let fileList = [];
    return through.obj(function(file, enc, cb) {
        if (file.isBuffer()) {
            let httpRelativePath = file.path.replace(options.cwd + '/', '');
            fileList.push({
                key: httpRelativePath.replace(path.extname(httpRelativePath), ''),
                httpPublicPath: options.httpPublicPath + '/' + httpRelativePath,
                chunk: file
            });
        }

        cb();
    }, function(cb) {
        let self = this;
        let assetsJSON = jsonfile.readFileSync(options.outputFileName);

        fileList.forEach(function(fileObj) {
            assetsJSON[fileObj.key] || (assetsJSON[fileObj.key] = {});
            assetsJSON[fileObj.key].css = fileObj.httpPublicPath;

            self.push(fileObj.chunk);
        });

        assetsJSON.metadata.time = utils.getTime();
        jsonfile.writeFileSync(options.outputFileName, assetsJSON, {
            spaces: 2
        });

        cb();
    });
};

module.exports = outputAssets;