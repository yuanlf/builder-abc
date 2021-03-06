/**
 * @fileOverview webpack生产环境配置
 * @author langford@126.com
 */

'use strict'

const webpack = require('webpack')
const argv = require('yargs').argv
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const objectAssign = require('object-assign')
const config = require('./webpack.base.config')
const utils = require('../utils')

const abcConfig = utils.getAbcConfig
const rules = config.module.rules
const output = config.output
const plugins = config.plugins
const alias = config.resolve.alias

config.entry = JSON.stringify(abcConfig.entry) === '{}' ? { 'index': './src/index.js' } :  abcConfig.entry

// css 是否单独打包
if (abcConfig.isExtractCss) {
  rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style',
      use: [
        'css'
      ]
    })
  }, {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style',
      use: [
        'css',
        'less'
      ]
    })
  })
} else {
  rules.push({
    test: /\.css$/,
    use: [
      'style',
      'css', 
      {
        loader: 'postcss',
        options: utils.getPostCssOptions()
      }
    ]
  }, {
    test: /\.less$/,
    use: [
      'style',
      {
        loader: 'css',
        options: {
          modules: false
        }
      },
      'less', 
      {
        loader: 'postcss',
        options: utils.getPostCssOptions()
      }
    ]
  })
}

// 接入 def 云构建，需要设置 def 构建器的输出目录
if (argv.buildTo) {
  output.path = argv.buildTo
}

plugins.push(
  new webpack.DefinePlugin({
    __dev__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  }), 
  new ExtractTextPlugin('[name].css'),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      drop_debugger: true
    }
  })
 )

// const reactExternal = {
//   root: 'React',
//   commonjs2: 'react',
//   commonjs: 'react',
//   amd: 'react'
// }

// const reactDOMExternal = {
//   root: 'ReactDOM',
//   commonjs2: 'react-dom',
//   commonjs: 'react-dom',
//   amd: 'react-dom'
// }

// const windExternal = {
//   root: 'wind',
//   commonjs2: '@ali/wind',
//   commonjs: '@ali/wind',
//   amd: '@ali/wind'
// }

// 默认不打包 react 以及 react-dom 模块
config.externals = objectAssign({
  // react: reactExternal,
  // 'react-dom': reactDOMExternal,
  // '@ali/wind': windExternal
}, abcConfig.externals)

module.exports = config