## CSS Sprite图片合并

在构建CSS过程中，会对路径带有 `?__sprite` 的图片才进行Sprite图片合并，并带上 `background-position` `width` `height` 属性。

支持分组切割功能，方便css按需加载场景



### 通用场景

源码：
```css
.icon-level-1 {
  background-image: url(../images/level-1.png?__sprite);
}
.icon-level-2 {
  background-image: url(../images/level-2.png?__sprite);
}
```


编译后：
```css
.icon-level-1 {
  background-image: url(images/sprite-55a52070388b2b8dbed16393cf103230.png);
  background-position: 0 0;
  width: 20px;
  height: 20px;
}
.icon-level-2 {
  background-image: url(images/sprite-55a52070388b2b8dbed16393cf103230.png);
  background-position: -20px 0;
  width: 20px;
  height: 20px;
}
```


### Retina场景

源码：
```css
.icon-level-1 {
  background-image: url(../images/level-1.png?__sprite);
}
.icon-level-2 {
  background-image: url(../images/level-2.png?__sprite);
}
@media
  only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (   min--moz-device-pixel-ratio: 2),
  only screen and (     -o-min-device-pixel-ratio: 2/1),
  only screen and (        min-device-pixel-ratio: 2),
  only screen and (                min-resolution: 192dpi),
  only screen and (                min-resolution: 2dppx) {
    .icon-level-1 {
      background: url(../images/level-1@2x.png?__sprite) no-repeat;
    }
    .icon-level-2 {
      background: url(../images/level-2@2x.png?__sprite) no-repeat;
    }
  }
```


编译后：
```css
.icon-level-1 {
  background-image: url(images/sprite-55a52070388b2b8dbed16393cf103230.png);
  background-position: 0 0;
  width: 20px;
  height: 20px;
}
.icon-level-2 {
  background-image: url(images/sprite-55a52070388b2b8dbed16393cf103230.png);
  background-position: -20px 0;
  width: 20px;
  height: 20px;
}

@media
  only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min--moz-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2),
  only screen and (min-resolution: 192dpi),
  only screen and (min-resolution: 2dppx) {
    .icon-level-1 {
      background-image:url(images/sprite-@2x-95d9acd6d025589b4d77f506c5af7a73.png);
      background-size: 40px 20px;
    }
    .icon-level-2 {
      background-image:url(images/sprite-@2x-95d9acd6d025589b4d77f506c5af7a73.png);
      background-size: 40px 20px;
    }
  }
```



### 分组切割场景

源码：
```css
.icon-level-1 {
  background: url(../images/sp1/level-1.png?__sprite) no-repeat;
}
.icon-level-2 {
  background: url(../images/sp1/level-2.png?__sprite) no-repeat;
}
.icon-level-3 {
  background: url(../images/sp1/level-3.png?__sprite) no-repeat;
}
.icon-level-4 {
  background: url(../images/sp2/level-4.png?__sprite) no-repeat;
}
.icon-level-5 {
  background: url(../images/sp2/level-5.png?__sprite) no-repeat;
}
```
编译后：
```css
.icon-level-1 {
  background-image: url(images/sprite-sp1-546b8dacd562e8304603144190633d5f.png);
  background-position: 0 0;
  width: 20px;
  height: 20px
}
.icon-level-2 {
  background-image: url(images/sprite-sp1-546b8dacd562e8304603144190633d5f.png);
  background-position: -20px 0;
  width: 20px;
  height: 20px
}
.icon-level-3 {
  background-image: url(images/sprite-sp1-546b8dacd562e8304603144190633d5f.png);
  background-position: 0 -20px;
  width: 20px;
  height: 20px
}
.icon-level-4 {
  background-image: url(images/sprite-sp2-923522f116f5b97f266f390b54458fba.png);
  background-position: 0 0;
  width: 20px;
  height: 20px
}
.icon-level-5 {
  background-image: url(images/sprite-sp2-923522f116f5b97f266f390b54458fba.png);
  background-position: -20px 0;
  width: 20px;
  height: 20px
}
```


### Retina分组切割场景

源码：
```css
.icon-level-1 {
  background-image: url(../images/sp1/level-1.png?__sprite);
}
.icon-level-2 {
  background-image: url(../images/sp1/level-2.png?__sprite);
}
.icon-level-3 {
  background-image: url(../images/sp1/level-3.png?__sprite);
}
.icon-level-4 {
  background-image: url(../images/sp2/level-4.png?__sprite);
}
.icon-level-5 {
  background-image: url(../images/sp2/level-5.png?__sprite);
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2),
only screen and (   min--moz-device-pixel-ratio: 2),
only screen and (     -o-min-device-pixel-ratio: 2/1),
only screen and (        min-device-pixel-ratio: 2),
only screen and (                min-resolution: 192dpi),
only screen and (                min-resolution: 2dppx) {
  .icon-level-1 {
    background-image: url(../images/sp1/level-1@2x.png?__sprite);
  }
  .icon-level-2 {
    background-image: url(../images/sp1/level-2@2x.png?__sprite);
  }
  .icon-level-3 {
    background-image: url(../images/sp1/level-3@2x.png?__sprite);
  }
  .icon-level-4 {
    background-image: url(../images/sp2/level-4@2x.png?__sprite);
  }
  .icon-level-5 {
    background-image: url(../images/sp2/level-5@2x.png?__sprite);
  }
}
```


编译后：
```css
.icon-level-1 {
  background-image: url(images/sprite-sp1-546b8dacd562e8304603144190633d5f.png);
  background-position: 0 0;
  width: 20px;
  height: 20px
}
.icon-level-2 {
  background-image: url(images/sprite-sp1-546b8dacd562e8304603144190633d5f.png);
  background-position: -20px 0;
  width: 20px;
  height: 20px
}
.icon-level-3 {
  background-image: url(images/sprite-sp1-546b8dacd562e8304603144190633d5f.png);
  background-position: 0 -20px;
  width: 20px;
  height: 20px
}
.icon-level-4 {
  background-image: url(images/sprite-sp2-923522f116f5b97f266f390b54458fba.png);
  background-position: 0 0;
  width: 20px;
  height: 20px
}
.icon-level-5 {
  background-image: url(images/sprite-sp2-923522f116f5b97f266f390b54458fba.png);
  background-position: -20px 0;
  width: 20px;
  height: 20px
}
@media only screen and (-webkit-min-device-pixel-ratio: 2),
only screen and (min--moz-device-pixel-ratio: 2),
only screen and (min-device-pixel-ratio: 2),
only screen and (min-resolution: 192dpi),
only screen and (min-resolution: 2dppx) {
  .icon-level-1 {
    background-image: url(images/sprite-sp1@2x-16810c949a17c7b2267740edc8eb683c.png);
    background-size: 40px 40px
  }
  .icon-level-2 {
    background-image: url(images/sprite-sp1@2x-16810c949a17c7b2267740edc8eb683c.png);
    background-size: 40px 40px
  }
  .icon-level-3 {
    background-image: url(images/sprite-sp1@2x-16810c949a17c7b2267740edc8eb683c.png);
    background-size: 40px 40px
  }
  .icon-level-4 {
    background-image: url(images/sprite-sp2@2x-f5f5b53efe302c636d31c7542d9f1ff6.png);
    background-size: 40px 20px
  }
  .icon-level-5 {
    background-image: url(images/sprite-sp2@2x-f5f5b53efe302c636d31c7542d9f1ff6.png);
    background-size: 40px 20px
  }
}
```