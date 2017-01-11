"use strict";

const path = require('path');
const fs = require('fs');

const expect = require('expect');
const glob = require('glob');
const del = require('del');
const build = require('../lib/build');

function readFileSync(s) {
    return fs.readFileSync(s, 'utf-8');
}

function testBuild(options, fixtureDir) {
    return new Promise(function(resolve) {
        const cwd = path.join(__dirname, 'fixtures', fixtureDir);
        const outputDir = path.join(cwd, 'dist');

        const expectDir = path.join(__dirname, 'expect', fixtureDir);

        process.chdir(cwd);
        del.sync(outputDir);

        options.cwd = cwd;
        options.quiet = true; // 不输出任何信息

        build(options, function (error) {
            if (error) {
                throw new Error(error);
            }

            const actualFiles = glob.sync('**/*', {
                cwd: outputDir,
                nodir: true
            });

            actualFiles.forEach(function (file) {
                const outputFile = readFileSync(path.join(outputDir, file));
                const expectFile = readFileSync(path.join(expectDir, file));

                expect(outputFile).toEqual(expectFile);
            });

            resolve();
        });
    });
}


describe('Build', function() {
    this.timeout(50000);

    it('es6 to es5', function() {
        return testBuild({}, 'es6-to-es5');
    });
    it('css', function() {
        return testBuild({}, 'css');
    });
    it('sass', function() {
        return testBuild({}, 'sass');
    });
    it('sprites', function() {
        return testBuild({}, 'sprites');
    });
    it('sprites-retina', function() {
        return testBuild({}, 'sprites-retina');
    });
    it('sprites-split', function() {
        return testBuild({}, 'sprites-split');
    });
    it('sprites-split-retina', function() {
        return testBuild({}, 'sprites-split-retina');
    });
    it('handlebars', function() {
        return testBuild({}, 'handlebars');
    });
    it('image-dataurl', function() {
        return testBuild({}, 'image-dataurl');
    });
    it('template', function() {
        return testBuild({
            hash: true
        }, 'template');
    });
});