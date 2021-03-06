/**
 * @fileOverview webpack基础配置
 * @author langford@126.com
 */
 
'use strict'

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const objectAssign = require('object-assign')
const SimpleProgressWebpackPlugin = require( 'customized-progress-webpack-plugin' )

const utils = require('../utils')
const paths = utils.paths
const abcConfig = utils.getAbcConfig
const cwd = process.cwd()

module.exports = {
  entry: abcConfig.entry,
  output: abcConfig.output,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel',
            options: utils.getBabelOptions({})
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        use: [
          {
            loader: 'url',
            options: {
              limit: 1000,
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      }, {
        test: /\.(png|jpe?g)$/,
        use: [
          {
            loader: 'file',
            options: {
              limit: 10000,
              name: '[path][name].[ext]?[hash]'
            }
          },
          'image-webpack'
        ]
      }, {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      }, {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel',
            options: utils.getBabelOptions({}),
          },
          {
            loader: 'awesome-typescript',
            options: {
              transpileOnly: true,
            },
          },
        ],
      }
    ].concat(abcConfig.rules)
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: utils.browsers
          })
        ],
        context: paths.appRootPath
      }
    }),
    new SimpleProgressWebpackPlugin()
  ].concat(abcConfig.plugins),
  resolve: {
    modules: [
      paths.appNodeModulePath,
      paths.builderNodeModulePath,
      'node_modules'
    ],
    extensions: [
      '.js', '.json', '.jsx', '.ts', '.tsx'
    ],
    alias: objectAssign({
      demo:  `${cwd}/demo`,
      src: `${cwd}/src`
    }, abcConfig.alias)
  },
  resolveLoader: {
    modules: [
      paths.builderNodeModulePath,
      paths.appNodeModulePath,
      'node_modules'
    ],
    moduleExtensions: ['-loader'],
  }
}