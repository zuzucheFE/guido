// 内容MD5
// ------------------------------
var crypto = require('crypto');
exports.md5 = function(contents, maxLen) {
    var result = crypto.createHash('md5')
        .update(contents + '', 'utf8')
        .digest('hex');
    return (parseInt(maxLen, 10) || 0) ? result.slice(0, maxLen) : result;
};

exports.getTime = function() {
    return new Date().getTime();
};

exports.isDebugMode = function() {
    return process.env.NODE_ENV !== 'production';
};