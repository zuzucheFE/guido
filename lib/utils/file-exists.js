const fs = require('fs');
module.exports = function fileExists(path) {
    return fs.existsSync(path);
};
