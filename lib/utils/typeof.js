'use strict';

function isType(s, typeString) {
    return {}.toString.call(s) === `[object ${typeString}]`;
}

module.exports = {
    isObject: function isObject(s) {
        return isType(s, 'Object');
    },
    isArray: function isArray(s) {
        return Array.isArray(s);
    },
    isString: function isString(s) {
        return isType(s, 'String');
    },
    isNumber: function isNumber(s) {
        return isType(s, 'Number');
    },
    isFunction: function isFunction(s) {
        return isType(s, 'Function');
    },
    isUndefined: function isUndefined(s) {
        return isType(s, 'Function');
    },
    isNull: function isNull(s) {
        return isType(s, 'Null');
    },
    isRegExp: function isRegExp(s) {
        return isType(s, 'RegExp');
    },
    isEmptyObject: function isEmptyObject(s) {
        for (let name in s) {
            return false;
        }
        return true;
    }
};
