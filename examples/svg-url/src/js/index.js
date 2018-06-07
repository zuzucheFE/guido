require('../css/style.css');

import facebook from '../images/facebook.svg';
document.getElementById('js-facebook').style.backgroundImage = `url(${facebook})`;

import twitter from '../images/twitter.svg?__url';
document.getElementById('js-twitter').style.backgroundImage = `url(${twitter})`;

console.log('svg url done.');
