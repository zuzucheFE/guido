let isType = require('./is-type');
module.exports = function isString(s) {
    return isType(s, 'String');
};
