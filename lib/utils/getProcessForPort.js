/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

let chalk = require('chalk');
let execSync = require('child_process').execSync;
let path = require('path');

let execOptions = {
	encoding: 'utf8',
	stdio: [
		'pipe', // stdin (default)
		'pipe', // stdout (default)
		'ignore', //stderr
	],
};

function isProcessAReactApp(processCommand) {
	return /^node .*lib\/scripts\/start\.js\s?$/.test(processCommand);
}

function getProcessIdOnPort(port) {
	return execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
		.split('\n')[0]
		.trim();
}

function getPackageNameInDirectory(directory) {
	let packagePath = path.join(directory.trim(), 'package.json');

	try {
		return require(packagePath).name;
	} catch (e) {
		return null;
	}
}

function getProcessCommand(processId, processDirectory) {
	let command = execSync(
		'ps -o command -p ' + processId + ' | sed -n 2p',
		execOptions
	);

	command = command.replace(/\n$/, '');

	if (isProcessAReactApp(command)) {
		const packageName = getPackageNameInDirectory(processDirectory);
		return packageName ? packageName : command;
	} else {
		return command;
	}
}

function getDirectoryOfProcessById(processId) {
	return execSync(
		'lsof -p ' +
			processId +
			' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
		execOptions
	).trim();
}

function getProcessForPort(port) {
	try {
		let processId = getProcessIdOnPort(port);
		let directory = getDirectoryOfProcessById(processId);
		let command = getProcessCommand(processId, directory);
		return (
			chalk.cyan(command) +
			chalk.grey(' (pid ' + processId + ')\n') +
			chalk.blue('  in ') +
			chalk.cyan(directory)
		);
	} catch (e) {
		return null;
	}
}

module.exports = getProcessForPort;
