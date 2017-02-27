let a = require('./component/a');
let b = require('./component/b');
require.ensure(['./component/c'], function (require) {
    require('./component/b').xyz();
    let d = require('./component/d');
});
