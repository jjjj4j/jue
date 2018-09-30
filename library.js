const isDel = process.env.NODE_ENV !== 'production'
const index = {
  entry: 'src/main.js',
  chunks: ['index-vendors', 'index-common', 'index']
}
const login = {
  entry: 'src/views/login/main.js',
  chunks: ['login-vendors', 'login-common', 'login']
}
const demo = {
  entry: 'src/demo/main.js',
  chunks: ['demo-vendors', 'demo-common', 'demo']
}
const externals = {
  'vue': 'Vue',
  'vuex': 'Vuex',
  'vue-router': 'VueRouter'
}

const conf = {
  externals
}
const prodConf = {}
const delConf = {
  devServer: {
    proxy: 'http://localhost:4000'
  }
}
const configureWebpack = function (config) {
  return Object.assign(isDel ? delConf : prodConf, conf)
}

const delChain = function (config) {
}

const prodChain = function (config) {
}

let path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const chainWebpack = function (config) {
  config
    .plugin('copy')
    .tap(function (list) {
      list[0] = list[0].concat([
        { from: resolve('node_modules/vue/dist/vue.min.js'), to: resolve('public/lib/vue.min.js') },
        { from: resolve('node_modules/vue-router/dist/vue-router.min.js'), to: resolve('public/lib/vue-router.min.js') },
        { from: resolve('node_modules/vuex/dist/vuex.min.js'), to: resolve('public/lib/vuex.min.js') }
      ]).reverse()
      console.log(list)
      return list
    })
  return isDel ? delChain(config) : prodChain(config)
}

let config = {
  configureWebpack,
  chainWebpack
}
config.pages = isDel ? { index, login } : { index, login, demo }
module.exports = config
