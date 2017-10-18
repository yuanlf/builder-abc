/**
 * @fileOverview 本地调试服务器
 * @author langford@126.com
 */

const webpack = require('webpack')
const Koa = require('koa')
const koaWebpackMiddleware = require('koa-webpack-middleware')
const devMiddleware = koaWebpackMiddleware.devMiddleware
const hotMiddleware = koaWebpackMiddleware.hotMiddleware
const devConfig = require('../webpack/webpack.dev.config')
const abcConfig = require('../utils').getAbcConfig

const compile = webpack(devConfig)
const app = new Koa()

const port = abcConfig.port

app.use(devMiddleware(compile, {
  noInfo: true,
  reload: true,
  stats: {
		colors: true
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  }
}))

app.use(hotMiddleware(compile, {
  // log: console.log,
  // path: '/__webpack_hmr',
  // heartbeat: 10 * 1000
}))

app.listen(port, () => {
  console.log(`app listen at ${port}`)
})