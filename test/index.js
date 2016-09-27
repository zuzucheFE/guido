"use strict";

const path = require('path');
const fs = require('fs');

const expect = require('expect');
const glob = require('glob');
const del = require('del');
const build = require('../lib/build');


function testBuild(options, fixtureDir) {
    return new Promise(function(resolve) {
        const cwd = path.join(__dirname, 'fixtures', fixtureDir);
        const outputDir = path.join(cwd, 'dist');

        const expectDir = path.join(__dirname, 'expect', fixtureDir);

        process.chdir(cwd);

        del.sync(outputDir);

        options.cwd = cwd;

        build(options, function (error) {
            if (error) {
                throw new Error(error);
            }

            const actualFiles = glob.sync('**/*', {
                cwd: outputDir,
                nodir: true
            });

            actualFiles.forEach(function (file) {
                const outputFile = fs.readFileSync(path.join(outputDir, file), 'utf-8');
                const expectFile = fs.readFileSync(path.join(expectDir, file), 'utf-8');

                expect(outputFile).toEqual(expectFile);
            });

            resolve();
        });
    });
}


describe('Build', function() {
    this.timeout(50000);
    // it('es6 to es5', function() {
    //     return testBuild({}, 'es6-to-es5');
    // });
    it('sass', function() {
        return testBuild({}, 'sass');
    });
    // it('sprites', function() {
    //     return testBuild({}, 'sprites');
    // });
});