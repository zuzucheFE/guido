"use strict";

const path = require('path');
const fs = require('fs');

const chai = require('chai');
const expect = chai.expect;
const glob = require('glob');
const del = require('del');
const build = require('../lib/build');

function readFile(s) {
    return fs.readFileSync(s, 'utf-8');
}

function testBuild(options, fixtureDir) {
    return new Promise(function(resolve) {
        const cwd = path.join(__dirname, 'fixtures', fixtureDir);
        const outputDir = path.join(cwd, 'dist');

        const expectDir = path.join(__dirname, 'expect', fixtureDir);

        process.chdir(cwd);
        del.sync(outputDir);

        options.env = 'test';
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
                const outputFile = readFile(path.join(outputDir, file));
                const expectFile = readFile(path.join(expectDir, file));
                expect(outputFile).to.equal(expectFile);
            });
            resolve();
        });
    });
}


describe('Build', function() {
    this.timeout(10000);

    it('code-splitted-css-bundle', function() {
        return testBuild({}, 'code-splitted-css-bundle');
    });
    it('code-splitted-require.context', function() {
        return testBuild({}, 'code-splitted-require.context');
    });
    it('code-splitted-require.context-amd', function() {
        return testBuild({}, 'code-splitted-require.context-amd');
    });
    it('code-splitting', function() {
        return testBuild({}, 'code-splitting');
    });
    it('code-splitting-harmony', function() {
        return testBuild({}, 'code-splitting-harmony');
    });
    it('common-chunk-and-vendor-chunk', function() {
        return testBuild({}, 'common-chunk-and-vendor-chunk');
    });
    it('commonjs', function() {
        return testBuild({}, 'commonjs');
    });
    it('css', function() {
        return testBuild({}, 'css');
    });
    it('css-font-url', function() {
        return testBuild({}, 'css-font-url');
    });
    it('css-modules', function() {
        return testBuild({}, 'css-modules');
    });
    it('es6 to es5', function() {
        return testBuild({}, 'es6-to-es5');
    });
    it('extra-async-chunk', function() {
        return testBuild({}, 'extra-async-chunk');
    });
    it('handlebars', function() {
        return testBuild({}, 'handlebars');
    });
    it('image-dataurl', function() {
        return testBuild({}, 'image-dataurl');
    });
    it('jsx', function() {
        return testBuild({}, 'jsx');
    });
    it('require.context', function() {
        return testBuild({}, 'require.context');
    });
    it('require.resolve', function() {
        return testBuild({}, 'require.resolve');
    });
    it('scss', function() {
        return testBuild({}, 'scss');
    });
    it('scss-modules', function() {
        return testBuild({}, 'scss-modules');
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
    it('template-css-inline', function() {
        return testBuild({}, 'template-css-inline');
    });
    it('template-image', function() {
        return testBuild({}, 'template-image');
    });
    it('template-partial', function() {
        return testBuild({}, 'template-partial');
    });
    it('template-render-data', function() {
        return testBuild({}, 'template-render-data');
    });
});
