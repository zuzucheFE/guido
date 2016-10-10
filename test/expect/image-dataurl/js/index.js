/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(1);
	
	var fragment = document.createDocumentFragment();
	
	var div1 = document.createElement('div');
	div1.innerHTML = '<img src="' + __webpack_require__(4) + '">';
	fragment.appendChild(div1);
	
	var div2 = document.createElement('div');
	div2.innerHTML = '<img src="' + __webpack_require__(3) + '">';
	fragment.appendChild(div2);
	
	var div3 = document.createElement('div');
	div3.innerHTML = '<img src="' + __webpack_require__(2) + '">';
	fragment.appendChild(div3);
	
	document.body.appendChild(fragment);

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/aircraft-232e884c.png";

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAsCAMAAAAUyMtVAAAAUVBMVEVHcEwZsf/8NgYjrf8ZsP8asP8asP8ZsP8ZsP8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8asf8asP8asP8Zsf8Zsf/7Ngb7NQX8NQUasf+A7QW+AAAAGnRSTlMA+vwFsA4Z4ybwu6LJYNpuinhBN07RlU7gXkieiXIAAAGCSURBVEjHrZXbkoMgEESHBRFFRPGSrP//oYsScCB4q9p+SgmnnG5aAkxxeKRlWZpePAOspvvM4tV2wzPAquzMM2BlZkMfAVaVHOkjwDHFNdC0mCFMFYcAcXtm0U8RU+cOdZtAux2SgtBNNFyteQ4AFQgAruuISYrgABjdWMzlw1VNMIOLIKzWt36I2jstFIuYUITXqvWHSQjLjLKKi7AyP1bvbd241QanSROmpvAOAAxubYpzoSZkXfUUv8H6yREiZCa35xgAUTqDO1F03nrzMf1r9YKEKH2KqvSGld+irdQ+AG8RMfhTJ10RHVyJRubOYiWAy5CNSE4aA4GYfZ7t+NWlCIAiqt8W5TkABSqf5Ll6p8C8JFGeAyHKZTr64jAwIAfsGtijvAXQPkTZ3wHGcG101FwDAoVZmUtgb+U2FZEXwN5K3d4wXeFWonNmV3erayWdbwJ7KzW5AUSt/FwgZ0DSStGeA9+t3KwfAaXKPF+t5wH8gUfSJAuw4z9oI+Ef9AftHUrU4iV78QAAAABJRU5ErkJggg=="

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/buzz-9407c5eb.jpg";

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map