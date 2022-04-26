'use strict';

const { createHash } = require('crypto');

module.exports = str => {
    const hash = createHash('md5');
    hash.update(JSON.stringify(str));

    return hash.digest('hex');
};
