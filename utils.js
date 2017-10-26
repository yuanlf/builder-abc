/**
 * @fileOverview 工具方法
 * @author langford@126.com
 */

const path = require('path')
const objectAssign = require('object-assign')
const _ = require('lodash')
const fs = require('fs')

const getAbcConfig = (() => {
  const abcConfigPath = path.resolve(process.cwd() + '/.abcrc')
  const defaultConfig = {
    "port": 8080,
    "entry": {},
    "output": {},
    "rules": [],
    "plugins": [],
    "alias": [],
    "babelOptions": {},
    "htmlTemplateUrl": "",
    "devtool": "eval-source-map",
    "proxy": {}
  }
  let abcConfig = null

  try {
    abcConfig = objectAssign(defaultConfig, JSON.parse(fs.readFileSync(abcConfigPath).toString()))
  } catch(err) {
    abcConfig = defaultConfig
  }

  return abcConfig
})()

const getBabelOptions = (config) => {
  return objectAssign({
    "babelrc": false,
    "cacheDirectory": false,
    "presets": [
      [require.resolve('babel-preset-env'), {
        "node": "current",
        "targets": {
          "browsers": [
            '>5%',
            'last 4 versions',
            'Firefox ESR',
            'ie > 8'
          ]
        }
      }],
      require.resolve('babel-preset-react')
    ],
    "plugins": [
      require.resolve("babel-plugin-transform-runtime"),
      require.resolve("babel-plugin-transform-class-properties"),
      require.resolve("babel-plugin-add-module-exports"),
      require.resolve("babel-plugin-transform-object-rest-spread")
    ],
    "env": {
      "development": {
        "presets": [
          require.resolve('babel-preset-react-hmre')
        ]
      }
    }
  }, getAbcConfig.babelOptions)
}

const getPostCssOptions = (config) => {
  return {
    plugins: [
      require('autoprefixer')({
        browsers: [
          '>5%',
          'last 4 versions',
          'Firefox ESR',
          'ie > 8'
        ]
      })
    ]
  }
}

const paths = {
  builderNodeModulePath: path.resolve(__dirname, './node_modules'),
  appNodeModulePath: path.resolve(process.cwd(), './node_modules'),
  appRootPath: path.resolve(process.cwd())
}

const getDevEntry = (entry) => {
  const arr = ['eventsource-polyfill', 'webpack-hot-middleware/client?noInfo=true&reload=true']

  if (_.isString(entry)) {
    return { main: _.clone(arr).concat(entry) } 
  }

  if (_.isObject(entry)) {
    _.mapKeys(entry, (value, key) => {
      entry[key] = _.clone(arr).concat(value)
    })
  }

  return entry
}

/**
 * 处理代理配置
 * @param {Object} proxyConfig 
 * 
 * proxyConfig = {
 *  '/ecs': 'https://api.aliyun.com/',
 *  '/example/:id': params => {
 *     return {
 *       target: 'http://localhost:8000',
 *       logs: true,
 *       headers: {
 *         'X_HOST_S': 'google.com'
 *       }
 *     }
 *   }
 * }
 */
const getProxyConfig= () => {
  const result = []
  const proxyConfig = getAbcConfig.proxy

  _.keys(proxyConfig).forEach(context => {
    let options = proxyConfig[context]
    if (typeof options === 'string') {
      options = {
        target: options,
        changeOrigin: true,
        logs: true
      }
    }
    
    result.push({
      context,
      options
    })
  })
  
  return result
}

module.exports = {
  getBabelOptions,
  getPostCssOptions,
  paths,
  getAbcConfig,
  getDevEntry,
  getProxyConfig
}