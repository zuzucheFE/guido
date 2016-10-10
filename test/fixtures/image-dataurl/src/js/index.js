"use strict";

require('../css/index.css');

let fragment = document.createDocumentFragment();

let div1 = document.createElement('div');
div1.innerHTML = '<img src="' + require('../images/buzz.jpg') + '">';
fragment.appendChild(div1);

let div2 = document.createElement('div');
div2.innerHTML = '<img src="' + require('../images/aircraft.png') + '">';
fragment.appendChild(div2);

let div3 = document.createElement('div');
div3.innerHTML = '<img src="' + require('../images/aircraft.png?__url') + '">';
fragment.appendChild(div3);

document.body.appendChild(fragment);