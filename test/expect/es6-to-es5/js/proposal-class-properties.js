/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 131);
/******/ })
/************************************************************************/
/******/ ({

/***/ 131:
/***/ (function(module, exports) {

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bork = (_temp = _class = function Bork() {
  var _this = this;

  _classCallCheck(this, Bork);

  Object.defineProperty(this, "instanceProperty", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "bork"
  });
  Object.defineProperty(this, "boundFunction", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.instanceProperty;
    }
  });
}, Object.defineProperty(_class, "staticProperty", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "babelIsCool"
}), Object.defineProperty(_class, "staticFunction", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function value() {
    return Bork.staticProperty;
  }
}), _temp);
var myBork = new Bork(); //Property initializers are not on the prototype.

console.log(myBork.__proto__.boundFunction); // > undefined
//Bound functions are bound to the class instance.

console.log(myBork.boundFunction.call(undefined)); // > "bork"
//Static function exists on the class.

console.log(Bork.staticFunction()); // > "babelIsCool"

/***/ })

/******/ });