let fs = require('fs')
let path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
let files = [
  { from: resolve('node_modules/vue/dist/vue.min.js'), to: resolve('public/lib/vue/vue.min.js') },
  { from: resolve('node_modules/vue-router/dist/vue-router.min.js'), to: resolve('public/lib/vue/vue-router.min.js') },
  { from: resolve('node_modules/vuex/dist/vuex.min.js'), to: resolve('public/lib/vue/vuex.min.js') }
]

fs.rmdir(resolve('public/lib'), function () {
  fs.mkdir(resolve('public/lib'), function () {
    files.forEach(function (file) {
      fs.createReadStream(file.from).pipe(fs.createWriteStream(file.to))
    })
  })
})
