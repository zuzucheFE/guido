let isType = require('./is-type');
module.exports = function isNull(s) {
    return isType(s, 'Null');
};
