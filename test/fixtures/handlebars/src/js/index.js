"use strict";


import { mainTpl } from './main.handlebars';

document.body.innerHTML = mainTpl({
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
});