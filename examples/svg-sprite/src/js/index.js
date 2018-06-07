import '../images/edit.svg?__sprite&notrc';
import '../images/gear.svg?__sprite&notrc';
import '../images/info.svg?__sprite&notrc';
import '../images/search.svg?__sprite&notrc';

import moduleTpl from '../html/module.handlebars';

document.getElementById('js-module-tpl').innerHTML = moduleTpl();

console.log('svg sprite done.');
