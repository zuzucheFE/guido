'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const buildScript = path.resolve(__dirname, '../lib/scripts/build.js');

let cmds = fs.readdirSync(__dirname).filter((dirName) => {
    let fullPath = path.join(__dirname, dirName);
    return fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, 'webpack.config.js'));
}).sort().map((dirName) => {
    let fullPath = path.join(__dirname, dirName);
    return `cd ${fullPath} && node ${buildScript}`;
});

console.log(`process.cwd(): ${process.cwd()}`);

let failed = 0;
for (let i = 0, len = cmds.length; i < len; ++i) {
    let cmd = cmds[i];

    console.log(`[${i+1}/${cmds.length}] ${cmd}`);
    try {
        cp.execSync(cmd, {encoding: 'utf-8'});
    } catch (e) {
        ++failed;
        console.log(e);
    }
}

console.log('done');
if (failed > 0) {
    console.log(`${failed} failed`);
}
