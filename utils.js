/**
 * @fileOverview 工具方法
 * @author langford@126.com
 */

const path = require('path')
const objectAssign = require('object-assign')
const _ = require('lodash')
const fs = require('fs')
const browsers = [
  '>5%',
  'last 2 versions',
  'Firefox ESR',
  'ie > 8'
]

const paths = {
  builderNodeModulePath: path.resolve(__dirname, './node_modules'),
  appNodeModulePath: path.resolve(process.cwd(), './node_modules'),
  appRootPath: path.resolve(process.cwd())
}

const getAbcConfig = (() => {
  const defaultConfig = {
    "port": 8080,
    "entry": {},
    "output": {
      path: paths.appRootPath + '/build',
      filename: '[name].js',
      publicPath: './'
    },
    "rules": [],
    "plugins": [],
    "alias": [],
    "externals": [],
    "babelOptions": {},
    "htmlTemplateUrl": path.resolve(__dirname, '.') + '/index.tmpl.html',
    "devtool": "eval-source-map",
    "isExtractCss": true,
    "proxy": {}
  }
  let abcConfig = null

  try {
    // 优先取 .abcrc 中的配置，必须 json 格式
    const abcConfigPath = path.resolve(process.cwd() + '/.abcrc')
    abcConfig = objectAssign(defaultConfig, JSON.parse(fs.readFileSync(abcConfigPath).toString()))
  } catch(err) {
    try {
      // 然后取 abc.json 中的配置
      const abc = require(process.cwd() + '/abc.json')
      abcConfig = objectAssign(defaultConfig, abc)

      // 如果使用的是 generator 生成的组件，默认配置 umd 打包
      abcConfig.output.library = abc.name
      abcConfig.output.libraryTarget = 'umd'
    } catch(err) {
      // 否则使用默认配置
      abcConfig = defaultConfig
    }
  }

  return abcConfig
})()

const getBabelOptions = (config) => {
  return objectAssign({
    "babelrc": false,
    "cacheDirectory": false,
    "presets": [
      [require.resolve('babel-preset-env'), {
        "targets": {
          "browsers": browsers
        },
        helpers: true,
        polyfill: true,
        regenerator: true,
        // debug: true,
        // Resolve the Babel runtime relative to the config.
        moduleName: path.dirname(require.resolve('babel-runtime/package'))
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

// IE9+,firefox,chorme等
const getPostCssOptions = (config) => {
  return {
    plugins: [
      require('autoprefixer')({
        browsers: browsers
      })
    ]
  }
}

const getDevEntry = (entry) => {
  const arr = [
    require.resolve('eventsource-polyfill'), 
    require.resolve('webpack-hot-middleware/client')
  ]

  if (_.isString(entry)) {
    return { app: _.clone(arr).concat(entry) } 
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
  getProxyConfig,
  browsers
}