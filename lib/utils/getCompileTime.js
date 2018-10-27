'use strict';

module.exports = function getCompileTime(stats) {
    return stats.endTime - stats.startTime;
};
