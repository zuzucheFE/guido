import $ from 'jquery';
import mainTpl from './main.handlebars';
import partial2Tpl from './partial2.handlebars';

let str = mainTpl({
    data: [{
        name: 'Eddard'
    }, {
        name: 'Sansa'
    }, {
        name: 'Bran'
    }, {
        name: 'Arya'
    }, {
        name: 'Jon Snow'
    }]
}, {
    helpers: {
        isGuide: function (options) {
            return options.fn(this);
        }
    },

    partials: {
        partial2: partial2Tpl
    }
});

$(document.body).html(str);
