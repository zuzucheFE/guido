---
title: 快速上手
---


在使用Guido之前，需了解[webpack3](https://webpack.js.org/)的使用，并已安装Node v4.3.x以上版本。


### 1. 安装

```shell
npm install guido -g
```

guido依赖着 `node-sass` `phantomjs-prebuilt `等组件，若安装缓慢报错，[点我](./npm-install-fail)。



### 2. 创建项目

初始化过程和 `npm init` 一样，输入必填的`项目名称`即可。

```shell
mkdir guido-demo && cd guido-demo
guido init
```

运行完毕，会在所在目录创建 `package.json` `webpack.config.js` `.eslintrc`

```shell
└─┬ guido-demo/
  ├─┬ src/
  │ ├─┬ css/
  │ │ └── index.scss
  │ ├── html/
  │ ├─┬ images/
  │ │ └── index.html
  │ └─┬ js/
  │   └── index.scss
  ├── .eslintrc
  ├── package.json
  └── webpack.config.js
```



### 3. 开发调试

启动本地服务，访问http://0.0.0.0:8080/ 查看效果

```shell
guido server
```



### 4. 构建和部署

默认构建到`dist`目录中，如需更改输出目录，请查看[配置文档](./configuration)。

```shell
guido build
```





### 扩展阅读

- [webpack3官方文档](https://webpack.js.org/)
- [webpack3中文文档](https://doc.webpack-china.org/)

