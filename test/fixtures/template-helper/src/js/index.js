let tpl = require('../html/tpl.handlebars');

let $el = document.getElementById('J-tpl');

$el.innerHTML = tpl({
    list: [
        {"name": "name1"},
        {"name": "name2"},
        {"name": "name3"}
    ]
}, {
    helpers: {
        toUpperCase: function () {
            return 'Hi, ' + this.name.toUpperCase();
        }
    }
});

console.log('template-helper done.');
