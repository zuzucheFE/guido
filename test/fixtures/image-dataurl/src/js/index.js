"use strict";

require('../css/index.css');

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



let arrows = document.createElement('div');
arrows.innerHTML = '<img src="' + require('../images/arrows.png') + '">';
fragment.appendChild(arrows);

let arrowsInline = document.createElement('div');
arrowsInline.innerHTML = '<img src="' + require('../images/arrows.png?__inline') + '">';
fragment.appendChild(arrowsInline);

let arrowsUrl = document.createElement('div');
arrowsUrl.innerHTML = '<img src="' + require('../images/arrows.png?__url') + '">';
fragment.appendChild(arrowsUrl);



let p1 = document.createElement('div');
p1.innerHTML = '<img src="' + require('../images/p1.png') + '">';
fragment.appendChild(p1);

let p1Inline = document.createElement('div');
p1Inline.innerHTML = '<img src="' + require('../images/p1.png?__inline') + '">';
fragment.appendChild(p1Inline);

let p1Url = document.createElement('div');
p1Url.innerHTML = '<img src="' + require('../images/p1.png?__url') + '">';
fragment.appendChild(p1Url);

document.body.appendChild(fragment);
