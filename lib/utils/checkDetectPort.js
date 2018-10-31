'use strict';

const detect = require('detect-port-alt');

function checkDetectPort(port, host) {
	port = parseInt(port, 10) || 0;
	return detect(port, host);
	/*return new Promise((resolve, reject) => {

        detect(port, host, (err, _port) => {
            console.log('checkDetectPort');
            console.log(`port:${port}`);
            console.log(`_port:${_port}`);
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
    });*/
}

module.exports = checkDetectPort;
