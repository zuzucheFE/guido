---
title: 快速上手
---


在使用Guido之前，需了解[webpack2](https://webpack.js.org/)的使用，并已安装Node v4.3.x以上版本。


### 1. 安装

```shell
npm install guido -g
```

guido依赖着 `node-sass` `phantomjs-prebuilt `等组件，若安装缓慢报错，[点我]()。



### 2. 创建项目

初始化过程和 `npm init` 一样，输入必填的`项目名称`即可。

```shell
mkdir guido-demo && cd guido-demo
guido init
```

运行完毕，会在所在目录创建`package.json` 和 `webpack.config.js`

```shell
└─┬ guido-demo/
  ├── package.json
  ├── webpack.config.js
```



### 3. 开发调试

启动本地服务，访问http://0.0.0.0:8080/ 查看效果

```shell
guido dev
```



### 4. 构建和部署

默认构建到`dist`目录中，如需更改输出目录，请查看[配置文档]()。

```shell
guido build
```

