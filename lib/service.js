'use strict';

const path = require('path');

module.exports = class Service {
	constructor() {}

	build() {
		require(path.join(__dirname, './scripts/build'));
	}

	server() {
		require(path.join(__dirname, './scripts/start'));
	}
};
