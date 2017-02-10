"use strict";

require('../css/index.css?__url');

let fragment = document.createDocumentFragment();


let aircraft = document.createElement('div');
aircraft.innerHTML = '<img src="' + require('../images/aircraft.png') + '">';
fragment.appendChild(aircraft);

let aircraftInline = document.createElement('div');
aircraftInline.innerHTML = '<img src="' + require('../images/aircraft.png?__inline') + '">';
fragment.appendChild(aircraftInline);

let aircraftUrl = document.createElement('div');
aircraftUrl.innerHTML = '<img src="' + require('../images/aircraft.png?__url') + '">';
fragment.appendChild(aircraftUrl);



let buzz = document.createElement('div');
buzz.innerHTML = '<img src="' + require('../images/buzz.jpg') + '">';
fragment.appendChild(buzz);

let buzzInline = document.createElement('div');
buzzInline.innerHTML = '<img src="' + require('../images/buzz.jpg?__inline') + '">';
fragment.appendChild(buzzInline);

let buzzUrl = document.createElement('div');
buzzUrl.innerHTML = '<img src="' + require('../images/buzz.jpg?__url') + '">';
fragment.appendChild(buzzUrl);



let woody = document.createElement('div');
woody.innerHTML = '<img src="' + require('../images/woody.jpg') + '">';
fragment.appendChild(woody);

let woodyInline = document.createElement('div');
woodyInline.innerHTML = '<img src="' + require('../images/woody.jpg?__inline') + '">';
fragment.appendChild(woodyInline);

let woodyUrl = document.createElement('div');
woodyUrl.innerHTML = '<img src="' + require('../images/woody.jpg?__url') + '">';
fragment.appendChild(woodyUrl);

document.body.appendChild(fragment);