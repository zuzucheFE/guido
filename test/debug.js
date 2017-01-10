"use strict";

// process.env = 'development';

const path = require('path');

let build = require('../lib/build');
let options = {
    cwd: path.join(__dirname, 'fixtures', 'es6-to-es5'),
    hash: false
};

build(options, function (err, stats) {
    //console.log(stats);
});
