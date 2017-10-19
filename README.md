# builder-webpack
> 一个基于webpack的构建器，用户无需关心webpack配置，通过简单配置即可进行本地调试和线上打包

![dev](http://img.daily.taobaocdn.net/tps/TB1qKPhXow7LKJjyzdKXXaShXXa-2546-1448.gif)

![build](http://img.daily.taobaocdn.net/tps/TB1quPhXow7LKJjyzdKXXaShXXa-2556-1380.gif)

# 安装
```
yarn add builder-abc -g
或者
npm install builder-abc -g
```

### 基本配置
* 项目根目录新增 **.abcrc** 文件，大部分的场景下，只需要简单配置，比如：
``` json
{
  port: 8000
  entry: {
    'app': './index.js'
  },
  htmlTemplateUrl: './index.html'
}
```
* 本地开发调试 - 启动调式服务器，启动的服务器默认拥有hmr功能
```
abc dev
```
* 代码上线阶段 - 执行代码构建
```
abc build
```

### 高阶配置 - 完整的配置文件（.abcrc）说明
```json
"port": 8080, // 服务器端口配置，默认8080
"entry": {}, // 入口文件配置，一般需要覆盖配置，比如：entry: { app: './index.js' }
"output": {}, // 输出配置，默认：{ path: './build', filename: '[name].js' }
"rules": [], // loader配置，配置方式：[{ test: /\.js$/, use: ['babel'] }]
"plugins": [], // 插件配置
"alias": [], // 别名配置，配置方式：{ component: 'xx/xx/component' }
"babelOptions": {}, // babel选项配置
"htmlTemplateUrl": "", // 页面启动页默认配置，一般需要覆盖配置
"devtool": "eval-source-map", // soucemap配置，开发模式下使用，默认：eval-source-map
"publicPath": "./" // 打包资源中的静态路径配置，默认：”./“
```

### 常见问题
* libpng issues
Installing on some versions of OSX may raise errors with a missing libpng dependency:
```
Module build failed: Error: dyld: Library not loaded: /usr/local/opt/libpng/lib/libpng16.16.dylib
```
This can be remedied by installing the newest version of libpng with homebrew:
```
brew install libpng
```