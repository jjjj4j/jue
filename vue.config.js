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
let prodConf = {
}
let delConf = {
  devServer: {
    proxy: 'http://192.168.12.56:9102'
  }
}
const configureWebpack = function () {
  return Object.assign(isDel ? delConf : prodConf, conf)
}

const delChain = function (config) {
}

const prodChain = function (config) {
}

const chainWebpack = function (config) {
  return isDel ? delChain(config) : prodChain(config)
}

let config = {
  productionSourceMap: false,
  transpileDependencies: ['element-ui'], // 直接使用element-ui的vue文件
  configureWebpack,
  chainWebpack
}

config.pages = isDel ? { index, login, demo } : { index, login }
module.exports = config
