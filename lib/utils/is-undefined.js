let isType = require('./is-type');
module.exports = function isUndefined(s) {
    return isType(s, 'Undefined');
};
