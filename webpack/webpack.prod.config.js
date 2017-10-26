/**
 * @fileOverview webpack生产环境配置
 * @author langford@126.com
 */

'use strict'

const webpack = require('webpack')
const argv = require('yargs').argv
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.base.config')
const utils = require('../utils')

const abcConfig = utils.getAbcConfig
const rules = config.module.rules
const output = config.output
const plugins = config.plugins
const alias = config.resolve.alias

config.entry = JSON.stringify(abcConfig.entry) === '{}'
  ? {
    index: './src/index'
  }
  : abcConfig.entry

rules.push({
  test: /\.(css|less)$/,
  loader: ExtractTextPlugin.extract({
    fallback: "style",
    use: [
      {
        loader: 'css',
        options: {
          minimize: true
        }
      }, {
        loader: 'postcss',
        options: utils.getPostCssOptions()
      },
      "less"
    ]
  })
})

// 设置 def 构建器的输出目录
if (argv.buildTo) {
  output.path = argv.buildTo
}

plugins.push(new webpack.DefinePlugin({__dev__: false}), new ExtractTextPlugin('[name].css'), new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    drop_console: true,
    drop_debugger: true
  }
}))

module.exports = config