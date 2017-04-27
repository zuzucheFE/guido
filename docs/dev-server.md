---
title: 本地开发
---

基于 `webpack-dev-server` 提供本地静态服务器，它是一个小型的node.js Express服务器，为经过webpack构建出来的静态文件提供web服务，还可以实现本地开发的便利。



- 自动刷新
- 模块热替换（局限于JS模块）
- 扩展Express app object（实现自定义路由）



### 启动

默认指定host `http://0.0.0.0`，监听端口 `8080`
``` shell
guido server
```



### 预览

启动Server后，通过浏览器访问 `http://0.0.0.0:8080` 进行本地预览。

***Server 是常驻的，如需关闭，按 `Ctrl+c`***



### 配置

英文文档devServer部分 https://webpack.js.org/configuration/dev-server/

中文文档devServer 部分 http://www.css88.com/doc/webpack2/configuration/dev-server/

*英文文档为准*