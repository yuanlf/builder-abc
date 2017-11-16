# builder-abc
> 一个基于webpack的构建器，用户无需关心webpack配置，通过简单配置即可进行本地调试和线上打包

![dev](https://img.alicdn.com/tfs/TB1mUNfdvDH8KJjy1XcXXcpdXXa-2546-1448.gif)

![build](https://img.alicdn.com/tfs/TB1E3EVdlfH8KJjy1XbXXbLdXXa-2556-1380.gif)

# 安装
```
yarn global add builder-abc
或者
npm install builder-abc -g
```

### 基本配置
* 项目根目录新增 **.abcrc** 文件 (必须是严格的 json 格式)，大部分的场景下，只需要简单配置，比如：
``` json
{
  port: 8000
  entry: {
    'app': './index.js'
  },
  htmlTemplateUrl: './index.html'
}
```
* 本地开发调试 - 启动调式服务器，启动的服务器默认拥有 hmr 功能
```
abc dev
```
* 代码上线阶段 - 执行代码构建
```
abc build
```

### 高阶配置 - 完整的配置文件（.abcrc）说明，必须是一个标准的JSON格式文件
```json
{
  "port": 8080, // 服务器端口配置，默认8080
  "entry": {}, // 入口文件配置，一般需要覆盖配置，比如：entry: { app: './index.js' }
  "output": {}, // 输出配置，默认：{ path: './build', filename: '[name].js' }
  "rules": [], // loader配置，配置方式：[{ test: /\.js$/, use: ['babel'] }]
  "plugins": [], // 插件配置
  "alias": [], // 别名配置，配置方式：{ component: 'xx/xx/component' }
  "babelOptions": {}, // babel选项配置
  "htmlTemplateUrl": "", // 页面启动页默认配置，一般需要覆盖配置
  "devtool": "eval-source-map", // soucemap配置，开发模式下使用，默认：eval-source-map
  "proxy": {} // 代理设置，比如：{ '/api': 'http://www.aliyun.com/mocks', 'example/:id': (params) => return { target: 'http://localhost:8080/', logs: true } }
}
```

### 一些典型的配置
* 指定入口和模板路径，以及设置代理
```json
{
  "entry": {
    "app": "./src/index.js"
  },
  "htmlTemplateUrl": "./index.html",
  "proxy": {
    "/api": "http://www.aliyun.com/mocks"
  }
}
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