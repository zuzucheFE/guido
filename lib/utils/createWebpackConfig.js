'use strict';

const fs = require('fs');

const paths = require('../config/paths');
const TypeOf = require('../utils/typeof');
const ENV = require('../utils/env');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const filterWebpackConfig = require('../utils/filterWebpackConfig');

module.exports = function () {
    return new Promise((resolve, reject) => {
        let config;
        if (ENV.isDev()) {
            config = require('../config/webpack.config.dev');
        } else {
            config = require('../config/webpack.config.prod');
        }

        let appWebpackConfig = null;
        if (fs.existsSync(paths.appWebpackConfig)) {
            appWebpackConfig = require(paths.appWebpackConfig);
        }

        if (TypeOf.isObject(appWebpackConfig)) {
            config = mergeWebpackConfig(config, appWebpackConfig);
        } else if (TypeOf.isFunction(appWebpackConfig)) {
            config = appWebpackConfig(config);
        }

        config = filterWebpackConfig(config);
        TypeOf.isObject(config) ? resolve(config) : reject(new Error('webpack配置不能为空'));
    });
};
