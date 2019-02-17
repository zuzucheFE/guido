---
id: babel-config
title: Babel配置
---

### 语言特性支持

内置 `babel-preset-zuzuche` 预设转换器，支持如下特性：

 - `Dynamic import()` [动态导入模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import#%E5%8A%A8%E6%80%81import)
 - `Async/await` [异步函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
 - `Object Rest/Spread Properties` [展开语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
 - `Class Fields and Static Properties` [](https://github.com/tc39/proposal-class-public-fields)
 - [JSX](https://reactjs.org/docs/introducing-jsx.html)
 - [Flow](https://flow.org/)


`babel-preset-zuzuche` 目前所包含的 `plugins/presets`:
     
 - [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)
 - [@babel/preset-flow](https://www.npmjs.com/package/@babel/preset-flow)
 - [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react)
 - [@babel/plugin-syntax-dynamic-import](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import)
 - [@babel/plugin-proposal-class-properties](https://www.npmjs.com/package/@babel/plugin-proposal-class-properties)
 - [@babel/plugin-proposal-object-rest-spread](https://www.npmjs.com/package/@babel/plugin-proposal-object-rest-spread)
 - [@babel/plugin-transform-runtime](https://www.npmjs.com/package/@babel/plugin-transform-runtime)


针对项目以外的脚本（如：`node_modules`），只会使用：`@babel/preset-env`、`@babel/plugin-transform-runtime` 和 `@babel/plugin-syntax-dynamic-import`
