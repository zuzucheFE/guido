---
title: 资源嵌入
---

### html文件中嵌入资源

源码：
```html
<img src="./images/s.gif?__inline">
```

编译后：
```html
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
```

