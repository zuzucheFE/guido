'use strict';

module.exports = {
    getENV: function () {
        return process.env.NODE_ENV;
    },
    isProd: function () {
        return process.env.NODE_ENV === 'production';
    },
    isDev: function () {
        return process.env.NODE_ENV === 'development';
    }
};
