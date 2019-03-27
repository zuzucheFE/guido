---
id: inline-resource
title: 嵌入资源
---

提供资源文件嵌入到 `HTML`、`JS`、`CSS`，可以有效的减少http请求数。


| 文件类型 | 嵌入实现 | 说明 |
| --- | --- | --- |
| `js`文件 | 内部 `IncludeAssetsHtmlPlugin` | **使用场景：**嵌入到`html`中<br>**触发条件：**模版变量 |
| `css`文件 | `style-loader` | **使用场景：**嵌入到js中<br>**触发条件：**`?__inline` 参数<br>**过程：**<br>1. import 导入的样式文件代码，打包到 `js` 文件中<br>2. 执行 `js` 文件时，将样式自动插入到`<style>`标签中<br><br>**使用场景：**嵌入到`html`中<br>**触发条件：**模版变量 |
| 图片文件<br>`jpg` `jpeg` `png` `gif` | `url-loader` | **使用场景：**嵌入到`html` `js` `css`中<br>1. 加 `?__inline` 参数<br>2. `10kb` 内文件会自动嵌入，使用 `?__url` 可以强制使用链接 |
| `svg`文件 | `svg-url-loader` | **使用场景：**嵌入到`html` `js` `css`中<br>**触发条件：**加 `?__inline` 参数 |



## 在js中嵌入资源

加 `?__inline` 参数来标记资源嵌入需求


源码：
```js
import '../css/style.css?__inline';
import '../images/pic.png?__inline';

// cjs
require('../css/style.css?__inline');
require('../images/pic.css?__inline');
```


## 在css中嵌入资源

加 `?__inline` 参数来标记资源嵌入需求

源码：
```css
.icon-level-1 {
    background-image: url(../images/level-1.png?__inline);
}
```

编译后：
```css
.icon-level-1 {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUh....);
}
```

## 在html中嵌入资源


源码：
```html
<style>{{{assets.index.css.0.source}}}</style>

<img src="images/pic.png?__inline">

<script>{{{assets.index.js.0.source}}}</script>
```


编译后：
```html
<style>body{background:#f00;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);box-sizing:border-box;}</style>

<img src="data:image/png;base64,iVBORw0KGgoAAAANSUh....">

<script>!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};/* more code ...*/}});</script>
```
