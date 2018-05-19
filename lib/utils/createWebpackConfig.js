'use strict';

const fs = require('fs');

const paths = require('../config/paths');
const isObject = require('../utils/typeof').isObject;
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const filterWebpackConfig = require('../utils/filterWebpackConfig');

module.exports = function () {
    return new Promise((resolve, reject) => {
        let appWebpackConfig = null;
        if (fs.existsSync(paths.appWebpackConfig)) {
            appWebpackConfig = require(paths.appWebpackConfig);
        }

        let config;
        if (appWebpackConfig.mode === 'development') {
            config = require('../config/webpack.config.dev');
            process.env.NODE_ENV = 'development';
            process.env.BABEL_ENV = 'development';
        } else {
            config = require('../config/webpack.config.prod');
            process.env.NODE_ENV = 'production';
            process.env.BABEL_ENV = 'production';
        }

        if (isObject(appWebpackConfig)) {
            config = mergeWebpackConfig(config, appWebpackConfig);
        }

        config = filterWebpackConfig(config);
        isObject(config) ? resolve(config) : reject(new Error('webpack配置不能为空'));
    });
};
