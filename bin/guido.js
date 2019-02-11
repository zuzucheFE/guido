#!/usr/bin/env node

'use strict';

process.on('unhandledRejection', err => {
	throw err;
});
const spawn = require('cross-spawn');
const chalk = require('chalk');

const script = process.argv.slice(2)[0];
if (script === 'build' || script === 'start' || script === 'test') {
	const result = spawn.sync(
		'node',
		[require.resolve('../lib/scripts/' + script)],
		{ stdio: 'inherit' }
	);

	if (result.signal) {
		if (result.signal === 'SIGKILL') {
			console.log(
				chalk.red('内存不足或调用了 `kill -9`，导致进程已退出。')
			);
		} else if (result.signal === 'SIGTERM') {
			console.log(
				chalk.red(
					'调用了 `kill` or `killall` 或 系统正进行关闭，导致进程已退出。'
				)
			);
		}
		process.exit(1);
	}
	process.exit(result.status);
} else {
	console.log(chalk.yellow('"' + script + '"? 这是未知的处理命令'));
}
