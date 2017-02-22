---
title: 安装 node-sass、phantomjs 失败的解决方案
---



因github.com挂在 `s3.amazonaws.com` 上，这地址的不科学导致经常下载失败，提供一下解决方案：

在项目内添加一个 `.npmrc` 文件：

```shell
phantomjs_cdnurl=http://cnpmjs.org/downloads
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

在使用 `npm install` 安装 `node-sass` 和 `phantomjs` 时都能从淘宝源上下载。



```shell
registry=https://registry.npm.taobao.org
```

