'use strict';

module.exports = function (config, loaderRule) {
    let index = config.module.rules.length === 2 ? 1 : 0;

    config.module.rules[index].oneOf = config.module.rules[index].oneOf.concat(loaderRule);

    return config;
};
