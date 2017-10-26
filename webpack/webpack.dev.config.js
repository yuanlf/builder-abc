/**
 * @fileOverview webpack开发配置
 * @author langford@126.com
 */

'use strict'

const webpack = require('webpack')
const path = require('path')
const config = require('./webpack.base.config')
const utils = require('../utils')
const abcConfig = utils.getAbcConfig
const rules = config.module.rules
const output = config.output
const plugins = config.plugins
const alias = config.resolve.alias

const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const port = abcConfig.port

config.entry = JSON.stringify(abcConfig.entry) === '{}' || !abcConfig.entry
  ? {
    index: [
      'eventsource-polyfill', 'webpack-hot-middleware/client?noInfo=true&reload=true', './demo/index.js'
    ]
  }
  : utils.getDevEntry(abcConfig.entry)

rules.push({
  test: /\.(css|less)$/,
  use: [
    'style', {
      loader: 'css',
      options: {
        modules: false
      }
    },
    'less', {
      loader: 'postcss',
      options: utils.getPostCssOptions()
    }
  ],
  exclude: /node_modules/
})

// sourcemap配置，方便本地调试用
config.devtool = abcConfig.devtool

plugins.push(new webpack.DefinePlugin({
  __dev__: true,
  'process.env.NODE_ENV': JSON.stringify('development')
}), new HtmlWebpackPlugin({
  template: abcConfig.htmlTemplateUrl
    ? abcConfig.htmlTemplateUrl
    : path.resolve(__dirname, '..') + '/index.tmpl.html',
  inject: 'body'
}), new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin(), new OpenBrowserPlugin({url: `http://localhost:${port}`}))

module.exports = config