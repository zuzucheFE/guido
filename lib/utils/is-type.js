module.exports = function isType(s, typeString) {
    return {}.toString.call(s) === `[object ${typeString}]`;
};
