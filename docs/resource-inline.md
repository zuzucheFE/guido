---
title: 嵌入资源
---

# 嵌入资源

在一些特定场景，为了减少http请求数，需要把资源内容嵌入到js、css、html中，例如图片base64嵌入到css、js里，给资源加上 `?__inline` 参数来标记资源嵌入需求



## 嵌入规则

### js内

- 引入 `css` 文件时，默认是inline模式
- 引入 `png` `jpg` `jpeg` `gif` 文件时，文件体积 `< 8kb`  默认是inline模式，如加上 `?__inline` 参数会强制使用inline模式

### css内

- 引入 `png` `jpg` `jpeg` `gif` 文件时，文件体积 `< 8kb`  默认是inline模式，如加上 `?__inline` 参数会强制使用inline模式


### html内
- 引入 `js` 文件时，默认是外链模式，如加上 `?__inline` 参数会强制使用inline模式
- 引入 `png` `jpg` `jpeg` `gif` 文件时，文件体积 `< 8kb`  默认是inline模式，如加上 `?__inline` 参数会强制使用inline模式


## html文件中嵌入资源

### 嵌入图片

源码：
```html
<img src="./images/s.gif?__inline">
```

编译后：
```html
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
```



### 嵌入样式

源码：

```html	
<link rel="stylesheet" href="./css/style.css?__inline">
```

编译后：

```html
<style>body{font:400 14px/1.5 "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", tahoma, arial, Microsoft Yahei, \5b8b\4f53, sans-serif;background:#f5f5f5}.simple{margin:0 auto;width:1190px;font-size:24px}</style>
```



### 嵌入JS脚本

源码：

```html
<script src="./js/script-inline.js?__inline"></script>
```

编译后：

```html
<script>/******/ (function(modules) { // webpackBootstrap
/******/ 	// 省略...
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log('i am script-inline page');

/***/ })
/******/ ]);</script>
```



## js文件中嵌入资源

### 嵌入图片

源码：

```javascript
var img = document.createElement('img');
img.src = require('../images/aircraft.png?__inline');
document.body.appendChild(aircraft);
```

编译后：

```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// 省略...
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAsCAMAAAAUyMtVAAAAUVBMVEVHcEwZsf/8NgYjrf8ZsP8asP8asP8ZsP8ZsP8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8asf8asP8asP8Zsf8Zsf/7Ngb7NQX8NQUasf+A7QW+AAAAGnRSTlMA+vwFsA4Z4ybwu6LJYNpuinhBN07RlU7gXkieiXIAAAGCSURBVEjHrZXbkoMgEESHBRFFRPGSrP//oYsScCB4q9p+SgmnnG5aAkxxeKRlWZpePAOspvvM4tV2wzPAquzMM2BlZkMfAVaVHOkjwDHFNdC0mCFMFYcAcXtm0U8RU+cOdZtAux2SgtBNNFyteQ4AFQgAruuISYrgABjdWMzlw1VNMIOLIKzWt36I2jstFIuYUITXqvWHSQjLjLKKi7AyP1bvbd241QanSROmpvAOAAxubYpzoSZkXfUUv8H6yREiZCa35xgAUTqDO1F03nrzMf1r9YKEKH2KqvSGld+irdQ+AG8RMfhTJ10RHVyJRubOYiWAy5CNSE4aA4GYfZ7t+NWlCIAiqt8W5TkABSqf5Ll6p8C8JFGeAyHKZTr64jAwIAfsGtijvAXQPkTZ3wHGcG101FwDAoVZmUtgb+U2FZEXwN5K3d4wXeFWonNmV3erayWdbwJ7KzW5AUSt/FwgZ0DSStGeA9+t3KwfAaXKPF+t5wH8gUfSJAuw4z9oI+Ef9AftHUrU4iV78QAAAABJRU5ErkJggg=="

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var img = document.createElement('img');
img.src = __webpack_require__(0);

document.body.appendChild(aircraft);

/***/ })
/******/ ]);
```



### 嵌入样式

源码：

```javascript
import '../css/style.css'; // es6用法
//require('../css/style.css'); // es5用法
```

编译后：

```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// 省略...
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// 省略...
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "body {\n  background: #f00;\n  -webkit-transform: translate3d(0,0,0);\n          transform: translate3d(0,0,0);\n  box-sizing: border-box;\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// 省略...
/***/ }),
/* 4 */
/***/ (function(module, exports) {

// 省略...
  
/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

console.log('css inline-css');

/***/ })
/******/ ]);
```



## css文件中嵌入资源

### 嵌入图片

源码：

```css
.aircraft {
  background: url(../images/aircraft.png) no-repeat 0 0;
}
```

编译后：

```css
.aircraft {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAsCAMAAAAUyMtVAAAAUVBMVEVHcEwZsf/8NgYjrf8ZsP8asP8asP8ZsP8ZsP8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8Zsf8asf8asP8asP8Zsf8Zsf/7Ngb7NQX8NQUasf+A7QW+AAAAGnRSTlMA+vwFsA4Z4ybwu6LJYNpuinhBN07RlU7gXkieiXIAAAGCSURBVEjHrZXbkoMgEESHBRFFRPGSrP//oYsScCB4q9p+SgmnnG5aAkxxeKRlWZpePAOspvvM4tV2wzPAquzMM2BlZkMfAVaVHOkjwDHFNdC0mCFMFYcAcXtm0U8RU+cOdZtAux2SgtBNNFyteQ4AFQgAruuISYrgABjdWMzlw1VNMIOLIKzWt36I2jstFIuYUITXqvWHSQjLjLKKi7AyP1bvbd241QanSROmpvAOAAxubYpzoSZkXfUUv8H6yREiZCa35xgAUTqDO1F03nrzMf1r9YKEKH2KqvSGld+irdQ+AG8RMfhTJ10RHVyJRubOYiWAy5CNSE4aA4GYfZ7t+NWlCIAiqt8W5TkABSqf5Ll6p8C8JFGeAyHKZTr64jAwIAfsGtijvAXQPkTZ3wHGcG101FwDAoVZmUtgb+U2FZEXwN5K3d4wXeFWonNmV3erayWdbwJ7KzW5AUSt/FwgZ0DSStGeA9+t3KwfAaXKPF+t5wH8gUfSJAuw4z9oI+Ef9AftHUrU4iV78QAAAABJRU5ErkJggg==) no-repeat 0 0;
}
```
