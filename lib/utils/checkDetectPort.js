'use strict';

const detect = require('detect-port-alt');

function checkDetectPort(port) {
    port = parseInt(port, 10) || 0;
    return new Promise((resolve, reject) => {
        detect(port, (err, _port) => {
            if (err) {
                reject(err);
            } else {
                if (port === _port) {
                    resolve(port);
                } else {
                    reject({
                        message: `port: ${port} was occupied, try port: ${_port}`
                    });
                }
            }
        })
    });
}

module.exports = checkDetectPort;
