'use strict';

module.exports = function (config, loaderRule) {
    config.module.rules[1].oneOf = config.module.rules[1].oneOf.concat(loaderRule);

    return config;
};
