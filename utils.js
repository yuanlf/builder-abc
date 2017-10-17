/**
 * @fileOverview 工具方法
 * @author langford@126.com
 */

const path = require('path')
const objectAssign = require('object-assign')
const _ = require('lodash')

const getAbcConfig = (() => {
  const abcConfigPath = path.resolve(process.cwd() + '/abc.js')
  const defaultConfig = {
    "port": 8080,
    "entry": {},
    "output": {},
    "rules": [],
    "plugins": [],
    "alias": [],
    "babelOptions": {},
    "htmlTemplateUrl": ""
  }
  let abcConfig = null

  try {
    abcConfig = objectAssign(defaultConfig, require(abcConfigPath))
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
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0')
    ],
    "plugins": [
      
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
          '>1%',
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

module.exports = {
  getBabelOptions,
  getPostCssOptions,
  paths,
  getAbcConfig,
  getDevEntry
}