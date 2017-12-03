let isType = require('./is-type');
module.exports = function isFunction(s) {
    return isType(s, 'Object');
};
