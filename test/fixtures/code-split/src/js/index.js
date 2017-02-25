var a = require('./component/a');
var b = require('./component/b');
require.ensure(['./component/c'], function (require) {
    require('./component/b').xyz();
    var d = require('./component/d');
});
