"use strict";

const path = require('path');
const fs = require('fs');
const prompt = require('prompt');
const chalk = require('chalk');

function mkdirSync(dirName) {
    return fs.mkdirSync(dirName);
}
function writeFile(path, content) {
    fs.writeFileSync(path, content, {
        encoding: 'utf8'
    });
}
function readFile(path, content) {
    return fs.readFileSync(path, content, {
        encoding: 'utf8'
    });
}
function fileExists(path) {
    return fs.existsSync(path);
}

const defaultJS = readFile(path.join(__dirname, 'init-template/script.js'));
const defaultSCSS = readFile(path.join(__dirname, 'init-template/style.scss'));
const defaultHtml = readFile(path.join(__dirname, 'init-template/html.html'));
const defaultEsLintRC = readFile(path.join(__dirname, 'init-template/.eslintrc'));
const defaultWebpackConfig = readFile(path.join(__dirname, 'init-template/webpack.config.js'));

module.exports = function (options, callback) {
    options || (options = {});

    const cwd = options.cwd ? options.cwd : process.cwd();

    prompt.message = '';

    prompt.start();

    prompt.get({
        properties: {
            name: {
                description: '项目名称',
                type: 'string',
                pattern: /^\w{0,1}[\w-]+$/,
                required: true,
                message: '请填写项目名称'
            },
            version: {
                description: '项目版本',
                type: 'string',
                pattern: /(\d\.)+/,
                default: '1.0.0'
            },
            description: {
                description: '项目简介',
                type: 'string'
            }
        }
    }, function (err, result) {
        try {
            let packageJSONContent = JSON.stringify({
                name: result.name,
                version: result.version,
                description: result.description
            }, null, 2);
            writeFile(path.join(cwd, 'package.json'), packageJSONContent);

            writeFile(path.join(cwd, 'webpack.config.js'), defaultWebpackConfig);

            let srcDir = path.join(cwd, 'src');
            if (!fileExists(srcDir)) {
                mkdirSync(srcDir);
            }
            ['css', 'html', 'images', 'js'].forEach(function (value) {
                let fileDir = path.join(cwd, 'src', value);
                if (!fileExists(fileDir)) {
                    mkdirSync(fileDir);
                }

                switch (value) {
                    case 'js':
                        writeFile(path.join(cwd, 'src', value, 'index.js'), defaultJS);
                        break;
                    case 'css':
                        writeFile(path.join(cwd, 'src', value, 'index.scss'), defaultSCSS);
                        break;
                    case 'html':
                        writeFile(path.join(cwd, 'src', value, 'index.html'), defaultHtml);
                        break;
                }
            });
            writeFile(path.join(cwd, '.eslintrc'), defaultEsLintRC);

            console.log(
                chalk.green('Done，创建成功'));

            callback();
        } catch (e) {
            console.log(chalk.red('新建失败，检查写入权限'));
            console.log(e);
        }
    });
};
