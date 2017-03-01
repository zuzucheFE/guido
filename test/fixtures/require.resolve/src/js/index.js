let a = require('./a');

// get module id
let aId = require.resolve('./a.js');

// clear module in require.cache
delete require.cache[aId];

// require module again, it should be reexecuted
let a2 = require('./a');

// vertify it
if(a == a2) throw new Error('Cache clear failed :(');
