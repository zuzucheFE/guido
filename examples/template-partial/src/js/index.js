let $el2 = document.getElementById('J-tpl-2');

let tpl2 = require('../pages/partial2.handlebars');
let tpl3 = require('../pages/partial3.handlebars');
$el2.innerHTML = tpl2({
    title2: 'title2',
    title3: 'title3'
}, {
    partials: tpl3
});

console.log('template-partial done.');
