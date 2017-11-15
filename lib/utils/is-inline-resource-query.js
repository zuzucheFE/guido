module.exports = function isInlineResourceQuery(queryStr) {
    return queryStr === '?__inline';
};
