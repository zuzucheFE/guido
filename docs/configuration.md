### 配置


#### entry

页面的入口文件

```javascript
module.exports = {
    entry: {
        index: './src/js/index.js'
    }
}
```





#### output

包含一系列关于打包后文件的配置



##### publicPath

> 输出文件中，所依赖根目录路径，该值一般以`/`结尾

- Default: ''
- Required: `false`

##### path

> 打包后文件存储目录

- Default: `dist`
- Required: `true`


##### jsDir

> 打包后js文件存储目录

- Default: `js`
- Required: `true`

##### cssDir

> 打包后css文件存储目录

- Default: `css`
- Required: `true`

##### imagesDir

> 打包后js文件存储目录

- Default: `images`
- Required: `true`

##### fontDir

> 打包后font文件存储目录

- Default: `font`
- Required: `true`

##### templateDir

> 打包后html文件存储目录

- Default: `html`
- Required: `true`




#### devServer

本地资源http服务

##### host

> 指定host

- Default: `0.0.0.0`
- Required: `false`

##### port

> 指定监听端口

- Default: `8080`
- Required: `false`

##### historyApiFallback

> rewrites路由指向

- Default: `null`
- Required: `false`




#### browserslist

autoprefixer的浏览器兼容配置，详细规则[点这里](https://github.com/ai/browserslist)

- Default: `'last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'`

规则的测试地址，[点这里](http://browserl.ist/?q=last+2+versions%2C+Firefox+ESR%2C+%3E+1%25%2C+ie+%3E%3D+8%2C+iOS+%3E%3D+8%2C+Android+%3E%3D+4)



示例：

```js
// webpack.config.js
module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        publicPath: '//www.example.com/static/bundles/',
    	path: 'dist',
    	
    	jsDir: 'js',
    	cssDir: 'css',
    	imageDir: 'images',
    	fontDir: 'font',
    	templateDir: 'html'
  	},
  	devServer: {
    	host: '0.0.0.0',
    	port: '8080'
  	},
    
  	browserslist: ['last 2 versions', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
}
```

