"use strict";

const path = require('path');
const fs = require('fs');
const prompt = require('prompt');
const chalk = require('chalk');
const UglifyJS = require('uglify-js');

function mkdirSync(dirName) {
    return fs.mkdirSync(dirName);
}
function writeFile(path, content) {
    fs.writeFileSync(path, content, {
        encoding: 'utf8'
    });
}

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
                pattern: /^\w+$/,
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

            let webpackJSONAST = UglifyJS.parse(`module.exports = {
                'entry': {
                    'index': './src/js/index.js'
                }
            };`);
            let webpackJSONContent = webpackJSONAST.print_to_string({
                beautify: true,
                indent_level: 4
            });
            writeFile(path.join(cwd, 'webpack.config.js'), webpackJSONContent);

            mkdirSync(path.join(cwd, 'src'));
            ['css', 'html', 'images', 'js'].forEach(function (value) {
                mkdirSync(path.join(cwd, 'src', value));

                switch (value) {
                    case 'js':
                        writeFile(path.join(cwd, 'src', value, 'index.js'), 'import \'../css/index.scss\';');
                        break;
                    case 'css':
                        writeFile(path.join(cwd, 'src', value, 'index.scss'), '');
                        break;
                }
            });

            console.log(
                chalk.green('Done，' +
                chalk.underline.bold('package.json') + '和' +
                chalk.underline.bold('webpack.config.js') +
                '已经创建成功，修改配置后即可开发。'
            ));

            callback();
        } catch (e) {
            console.log(chalk.red('新建失败，检查写入权限'));
            console.log(e);
        }
    });
};
