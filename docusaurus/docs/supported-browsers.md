---
id: supported-browsers
title: 浏览器兼容性
---

### 浏览器支持

支持所有 `现代浏览器`，可以通过 `browserslist` 配置项进行配置

配置项传递给 `@babel/preset-env` 和 `autoprefixer` 对代码进行转译

内置默认配置： 
```js
module.exports = {
    //...
    browserslist: [
        'Chrome >= 45',
		'last 2 Firefox versions',
		'ie >= 9',
		'Edge >= 12',
		'iOS >= 9',
		'Android >= 4',
		'last 2 ChromeAndroid versions',
	]
};
```

只兼容国内主流移动端环境

```js
module.exports = {
    //...
    browserslist: [
		'iOS >= 9',
		'Android >= 4',
		'last 2 ChromeAndroid versions',
	]
};
```

具体语法清移步到：https://browserl.ist/



