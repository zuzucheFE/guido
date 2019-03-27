---
id: image-sprite
title: 雪碧图
---

雪碧图优势就不再叙述，在根据


## 基础使用


源码：
```css
.icon-level-1 {
    background-image: url(../images/level-1.png?__sprite);
}
.icon-level-2 {
    background-image: url(../images/level-2.png?__sprite);
}
.icon-level-3 {
    background-image: url(../images/level-3.png?__sprite);
}
```


编译后：
```css
.icon-level-1 {
    width: 20px;
    height: 20px;
    background-position: 0 0;
    background-image: url(images/sprite.png);
}
.icon-level-2 {
    width: 20px;
    height: 20px;
    background-position: -20px 0;
    background-image: url(images/sprite.png);
}
.icon-level-3 {
    width: 20px;
    height: 20px;
    background-position: 0 -20px;
    background-image: url(images/sprite.png);
}
```


## 支持 Retina


## 切割

