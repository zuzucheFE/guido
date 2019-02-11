'use strict';

const path = require('path');
const fs = require('fs');
const del = require('del');
const spawn = require('cross-spawn');
const binScript = path.join(__dirname, '../../bin/guido.js');

const timeout = 30 * 1000;

describe('Examples', () => {
    const basePath = path.join(__dirname, '../../examples');
    const exampleFolders = fs.readdirSync(basePath).filter((dirName) => {
        let fullPath = path.join(basePath, dirName);
        return fs.statSync(fullPath).isDirectory() &&
            fs.existsSync(path.join(fullPath, 'webpack.config.js'));
    }).sort();

    exampleFolders.forEach(examplePath => {
        it(`should compile ${examplePath}`, () => {
            let projectPath = path.join(basePath, examplePath);
            del.sync(path.join(projectPath, '.cache'));

            const result = spawn.sync('node', [binScript, 'test'], {
                cwd: projectPath,
                stdio: 'inherit',
                timeout: timeout
            });

            expect(result.status).toBe(0);
        }, timeout);
    });
});
