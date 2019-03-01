---
id: folder-structure
title: 目录结构
---

对于项目的目录结构，并没有一个很强制的规范和约束，完全可以根据项目自身的情况

如下提供一个推荐的文件结构目录：

```
project/
  README.md
  node_modules/
  package.json
  webpack.config.js
  chore/ (可选)
    webpack.config.development.js
    webpack.config.production.js
  dist/
  src/
    util/
    service/
    pages/
      home/
        index.js
        tpl.handlebars
        style.scss
```

 - `chore/**` 用于存放工程构建、部署等脚本
 - `dist/**` 用于存放应用于生产环境、测试环境的代码
 - `src/util/**` 用于存放一些使用工具式独立函数
 - `src/service/**` 用于存放编写业务逻辑层
 - `src/pages/**` 用于存放页面组件
