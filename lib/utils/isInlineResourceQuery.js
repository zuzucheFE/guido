'use strict';

module.exports = function isInlineResourceQuery(queryStr) {
    return queryStr === '?__inline';
};
