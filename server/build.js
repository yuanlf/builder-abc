/**
 * @fileOverview 执行代码构建
 * @author langford@126.com
 */

const webpack = require('webpack')
const config = require('../webpack/webpack.prod.config')

webpack(config, (err, stats) => {
  // console.log(stats.toString({
  //   chunks: false,
  //   color: true,
  //   children: false
  // }))
})