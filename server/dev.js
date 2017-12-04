/**
 * @fileOverview 本地调试服务器
 * @author langford@126.com
 */

const webpack = require('webpack')
const _ = require('lodash')
const Koa = require('koa')
const koaWebpackMiddleware = require('koa-webpack-middleware')
const devMiddleware = koaWebpackMiddleware.devMiddleware
const hotMiddleware = koaWebpackMiddleware.hotMiddleware
const proxy = require('koa-proxies')
const devConfig = require('../webpack/webpack.dev.config')
const utils = require('../utils')
const abcConfig = utils.getAbcConfig

const compile = webpack(devConfig)
const app = new Koa()

const port = abcConfig.port
const proxyConfig = utils.getProxyConfig()

_.forEach(proxyConfig, (config) => {
  app.use(proxy(config.context, config.options))
})

app.use(devMiddleware(compile, {
  noInfo: true,
  reload: true,
  stats: {
		colors: false
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  }
}))

app.use(hotMiddleware(compile, {
  // log: false,
  // path: '/__webpack_hmr',
  // heartbeat: 10 * 1000
}))

app.listen(port, () => {
  console.log(`app listen at ${port}`)
})