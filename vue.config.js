const development = function (config) {
  // production(config)
}

const production = function (config) {
  config.externals({
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter'
  })
}

module.exports = {
  lintOnSave: false,
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['index-vendors', 'index-common', 'index']
    },
    login: {
      template: 'public/index.html',
      entry: 'src/login.js',
      chunks: ['login-vendors', 'login-common', 'login']
    }
  },
  chainWebpack: config => (process.env.NODE_ENV === 'production' ? production(config) : development(config))
}
