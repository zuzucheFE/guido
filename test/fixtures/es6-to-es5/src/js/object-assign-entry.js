import objectMerge from './object-assign';

let a = {code: 0};
let b = {msg: 'wow!'};

alert(JSON.stringify(a));
alert(JSON.stringify(b));

let c = objectMerge(a, b);

alert(JSON.stringify(a));
alert(JSON.stringify(b));
alert(JSON.stringify(c));

let r = Object.assign({}, {name: 'kidney'});
alert(r.name);
