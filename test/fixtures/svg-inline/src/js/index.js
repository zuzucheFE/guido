require('../css/style.css');

import svg from '../images/page_placeholder.svg?__inline';
import '../images/page_placeholder.svg';

document.getElementById('js-page-placeholder').style.backgroundImage = `url(${svg})`;

console.log('svg inline done.');
